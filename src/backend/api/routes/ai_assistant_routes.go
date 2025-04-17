
package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
)

// RegisterAIAssistantRoutes registers AI assistant routes
func RegisterAIAssistantRoutes(router *mux.Router) {
	// AI Assistant routes
	aiRouter := router.PathPrefix("/api/ai-assistant").Subrouter()
	
	// Use common CORS middleware
	aiRouter.Use(middleware.CORSMiddleware)

	// All routes are now public - simplified auth
	aiRouter.HandleFunc("/ask", controllers.AskQuestion).Methods("POST", "OPTIONS")
	aiRouter.HandleFunc("/history", controllers.GetHistory).Methods("GET", "OPTIONS")
	aiRouter.HandleFunc("/public-ask", controllers.PublicAskQuestion).Methods("POST", "OPTIONS")
}
