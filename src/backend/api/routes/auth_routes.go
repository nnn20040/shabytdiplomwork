
package routes

import (
	"net/http"

	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
)

// RegisterAuthRoutes registers authentication routes
func RegisterAuthRoutes(router *mux.Router) {
	// Auth routes
	authRouter := router.PathPrefix("/api/auth").Subrouter()

	// Handle CORS Preflight globally
	authRouter.Methods("OPTIONS").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Authorization")
		w.WriteHeader(http.StatusOK)
	})

	// Public routes
	authRouter.HandleFunc("/register", controllers.Register).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/login", controllers.Login).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/forgot-password", controllers.ForgotPassword).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/reset-password", controllers.ResetPassword).Methods("POST", "OPTIONS")

	// Protected routes - using Protect middleware
	authRouter.Handle("/me", middleware.Protect(http.HandlerFunc(controllers.GetCurrentUser))).Methods("GET", "OPTIONS")
	authRouter.Handle("/profile", middleware.Protect(http.HandlerFunc(controllers.UpdateProfile))).Methods("PUT", "OPTIONS")
	authRouter.Handle("/change-password", middleware.Protect(http.HandlerFunc(controllers.ChangePassword))).Methods("PUT", "OPTIONS")
}
