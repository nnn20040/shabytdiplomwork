
package routes

import (
	"net/http"

	"backend/controllers"

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

	// All routes are now public - simplified auth
	aiRouter.HandleFunc("/ask", controllers.AskQuestion).Methods("POST", "OPTIONS")
	aiRouter.HandleFunc("/history", controllers.GetHistory).Methods("GET", "OPTIONS")
	aiRouter.HandleFunc("/public-ask", controllers.PublicAskQuestion).Methods("POST", "OPTIONS")
}
