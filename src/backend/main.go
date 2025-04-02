
package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"

	"backend/api/routes"
	"backend/config"
	"backend/middleware"
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Set default values if not provided
	setDefaultEnvVars()

	// Initialize database
	if err := config.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Create router
	router := mux.NewRouter()

	// Define allowed origins - Allow all origins in development for easier testing
	allowedOrigins := []string{"*"}
	
	// Middleware
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Origin", "Accept", "X-Requested-With"},
		ExposedHeaders:   []string{"Content-Length"},
		AllowCredentials: true, // Important for cookies
		MaxAge:           86400, // Maximum value not ignored by any major browser
		Debug:            true,  // Enable debugging to log CORS issues
	})

	// Register middleware
	router.Use(middleware.RequestLogger)

	// Create a basic health check endpoint
	router.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","message":"Server is running"}`))
	}).Methods("GET", "OPTIONS")

	// Register routes
	routes.RegisterAuthRoutes(router)
	routes.RegisterCourseRoutes(router)
	routes.RegisterAIAssistantRoutes(router)

	// Serve static files in production
	if os.Getenv("GO_ENV") == "production" {
		distDir := "../../dist"
		fs := http.FileServer(http.Dir(distDir))
		
		router.PathPrefix("/").Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			path := filepath.Join(distDir, r.URL.Path)
			_, err := os.Stat(path)
			if os.IsNotExist(err) {
				http.ServeFile(w, r, filepath.Join(distDir, "index.html"))
				return
			}
			fs.ServeHTTP(w, r)
		}))
	}

	// Start server
	port := os.Getenv("PORT")
	
	log.Printf("Server running on port %s", port)
	log.Printf("CORS allowed origins: %v", allowedOrigins)
	
	// Wrap router with CORS middleware and start server
	handler := corsMiddleware.Handler(router)
	log.Printf("Starting HTTP server on :%s", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// setDefaultEnvVars sets default environment variables if not provided
func setDefaultEnvVars() {
	envVars := map[string]string{
		"DB_HOST":     "localhost",
		"DB_PORT":     "5432",
		"DB_USER":     "postgres",
		"DB_PASSWORD": "2004",
		"DB_NAME":     "shabyt4_db",
		"DB_SSL":      "disable",
		"PORT":        "5000",
		"JWT_SECRET":  "shabyt_secure_jwt_key_2025",
		"GO_ENV":      "development",
		"FROM_EMAIL":  "nurlibek1204@gmail.com",
		"GEMINI_API_KEY": "AIzaSyDJC5a7eWgwlPqRPjoQeR0rrxnDPVDXZY0", // Default API key
	}

	for key, defaultValue := range envVars {
		if os.Getenv(key) == "" {
			os.Setenv(key, defaultValue)
		}
	}
}
