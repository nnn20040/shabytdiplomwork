
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

	// Set default environment variable for mock database if needed
	if os.Getenv("USE_MOCK_DB") == "" {
		// Check if we should default to mock DB
		if os.Getenv("DB_HOST") == "" || os.Getenv("DB_USER") == "" {
			os.Setenv("USE_MOCK_DB", "true")
			log.Println("No database configuration found, defaulting to mock database")
		}
	}

	// Initialize database
	if err := config.InitDB(); err != nil {
		log.Printf("Failed to initialize database: %v", err)
		log.Println("Continuing with mock database...")
		os.Setenv("USE_MOCK_DB", "true")
		config.InitMockDB()
	}

	// Create router
	router := mux.NewRouter()

	// Middleware
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},                               // Allow requests from any origin (including localhost:8080)
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Origin", "Accept"},
		AllowCredentials: true,
		Debug:            true, // Enable debugging to log CORS issues
	})

	// Register routes
	router.Use(middleware.RequestLogger)
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
	if config.UseMockDB() {
		log.Println("⚠️ USING MOCK DATABASE - Data will not persist between restarts")
		log.Println("Login with:")
		log.Println("  - Email: alibek@shabyt.kz, Password: password (Admin)")
		log.Println("  - Email: aigul@shabyt.kz, Password: password (Teacher)")
		log.Println("  - Email: nurlan@shabyt.kz, Password: password (Student)")
	}
	
	log.Println("CORS enabled, accepting requests from all origins")
	
	if err := http.ListenAndServe(":"+port, corsMiddleware.Handler(router)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
