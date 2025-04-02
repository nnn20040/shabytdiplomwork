
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
	
	// Enable CORS for all AI routes
	aiRouter.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Handle OPTIONS requests
			if r.Method == http.MethodOptions {
				w.Header().Set("Access-Control-Allow-Origin", "*")
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept")
				w.WriteHeader(http.StatusOK)
				return
			}
			
			// Set CORS headers for all other requests
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept")
			
			next.ServeHTTP(w, r)
		})
	})

	// Protected routes
	aiRouter.Handle("/ask", middleware.Protect(http.HandlerFunc(controllers.AskQuestion))).Methods("POST", "OPTIONS")
	aiRouter.Handle("/history", middleware.Protect(http.HandlerFunc(controllers.GetHistory))).Methods("GET", "OPTIONS")

	// Add a public endpoint for AI assistance without authentication
	aiRouter.HandleFunc("/public-ask", controllers.PublicAskQuestion).Methods("POST", "OPTIONS")
}
