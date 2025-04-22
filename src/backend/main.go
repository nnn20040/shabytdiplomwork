package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/nnn20040/shabytdiplomwork/src/backend/api/routes"
	"github.com/nnn20040/shabytdiplomwork/src/backend/database"
	"github.com/nnn20040/shabytdiplomwork/src/backend/middleware"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	router := mux.NewRouter()

	router.Use(middleware.RequestLogger)
	router.Use(middleware.CORSMiddleware)

	router = router.PathPrefix("/api").Subrouter()

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","message":"Server is running"}`))
	}).Methods("GET", "OPTIONS")

	routes.RegisterAuthRoutes(router)
	routes.RegisterCourseRoutes(router)
	routes.RegisterAIAssistantRoutes(router)
	routes.RegisterUserRoutes(router)

	port := os.Getenv("PORT")

	log.Printf("Starting HTTP server on :%s", port)
	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
