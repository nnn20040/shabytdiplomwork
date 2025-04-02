
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

	// Public routes - add OPTIONS method to handle CORS preflight
	authRouter.HandleFunc("/register", controllers.Register).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/login", controllers.Login).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/forgot-password", controllers.ForgotPassword).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/reset-password", controllers.ResetPassword).Methods("POST", "OPTIONS")

	// Protected routes - using Protect middleware
	authRouter.Handle("/me", middleware.Protect(http.HandlerFunc(controllers.GetCurrentUser))).Methods("GET", "OPTIONS")
	authRouter.Handle("/profile", middleware.Protect(http.HandlerFunc(controllers.UpdateProfile))).Methods("PUT", "OPTIONS")
	authRouter.Handle("/change-password", middleware.Protect(http.HandlerFunc(controllers.ChangePassword))).Methods("PUT", "OPTIONS")
}
