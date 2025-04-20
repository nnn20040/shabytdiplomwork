package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
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

<<<<<<< HEAD
	// Middleware
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8080", "https://localhost:5000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})
=======
	// Define allowed origins
	allowedOrigins := []string{"http://localhost:8080", "http://localhost:5173", "http://127.0.0.1:8080", "http://127.0.0.1:5173"}
	
	// Register middleware
	router.Use(middleware.RequestLogger)

	// Create a basic health check endpoint
	router.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","message":"Server is running"}`))
	}).Methods("GET", "OPTIONS")
>>>>>>> cd921a5ac2f69d998d31ec5ec2307706058d18ee

	// Register routes
	routes.RegisterAuthRoutes(router)
	routes.RegisterCourseRoutes(router)
	routes.RegisterLessonRoutes(router) // Register lessons routes
	routes.RegisterAIAssistantRoutes(router)
	routes.RegisterUserRoutes(router)

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
<<<<<<< HEAD
	if port == "" {
		port = "5000"
	}

=======
	
>>>>>>> cd921a5ac2f69d998d31ec5ec2307706058d18ee
	log.Printf("Server running on port %s", port)
	log.Printf("CORS allowed origins: %v", allowedOrigins)
	
	// Use our custom CORS middleware
	log.Printf("Starting HTTP server on :%s", port)
	if err := http.ListenAndServe(":"+port, middleware.CORSMiddleware(router)); err != nil {
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
