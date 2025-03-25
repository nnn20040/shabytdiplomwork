
package routes

import (
	"net/http"

	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
)

// RegisterAIAssistantRoutes registers AI assistant routes
func RegisterAIAssistantRoutes(router *mux.Router) {
	// AI Assistant routes
	aiRouter := router.PathPrefix("/api/ai-assistant").Subrouter()

	// Protected routes
	aiRouter.Handle("/ask", middleware.Protect(http.HandlerFunc(controllers.AskQuestion))).Methods("POST")
	aiRouter.Handle("/history", middleware.Protect(http.HandlerFunc(controllers.GetHistory))).Methods("GET")
}
