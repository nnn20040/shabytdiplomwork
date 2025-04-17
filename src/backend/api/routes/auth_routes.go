
package routes

import (
	"net/http"

	"backend/controllers"

	"github.com/gorilla/mux"
)

// RegisterAuthRoutes registers authentication routes
func RegisterAuthRoutes(router *mux.Router) {
	// Auth routes
	authRouter := router.PathPrefix("/api/auth").Subrouter()

	// Enable CORS for all auth routes
	authRouter.Use(func(next http.Handler) http.Handler {
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

	// Public routes - simplified auth without tokens
	authRouter.HandleFunc("/register", controllers.Register).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/login", controllers.Login).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/forgot-password", controllers.ForgotPassword).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/reset-password", controllers.ResetPassword).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/me", controllers.GetCurrentUser).Methods("GET", "OPTIONS") // Simplified - no protection
	authRouter.HandleFunc("/profile", controllers.UpdateProfile).Methods("PUT", "OPTIONS") // Simplified - no protection
	authRouter.HandleFunc("/change-password", controllers.ChangePassword).Methods("PUT", "OPTIONS") // Simplified - no protection
	
	// Add simple logout route
	authRouter.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"success": true, "message": "Logged out successfully"}`))
	}).Methods("POST", "OPTIONS")
}
