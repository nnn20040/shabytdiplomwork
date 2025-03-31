
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
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Initialize database
	if err := config.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Create router
	router := mux.NewRouter()

	// Middleware
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8080", "http://localhost:3000", "*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Origin", "Accept", "X-Requested-With"},
		ExposedHeaders:   []string{"Content-Length"},
		AllowCredentials: true,
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
	if port == "" {
		port = "5000"
	}
	
	log.Printf("Server running on port %s", port)
	log.Println("CORS enabled, accepting requests from all origins")
	
	// Wrap router with CORS middleware and start server
	handler := corsMiddleware.Handler(router)
	log.Printf("Starting HTTP server on :%s", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
