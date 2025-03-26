
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

	// Public routes
	authRouter.HandleFunc("/register", controllers.Register).Methods("POST")
	authRouter.HandleFunc("/login", controllers.Login).Methods("POST")
	authRouter.HandleFunc("/forgot-password", controllers.ForgotPassword).Methods("POST")
	authRouter.HandleFunc("/reset-password", controllers.ResetPassword).Methods("POST")

	// Protected routes
	authRouter.Handle("/me", middleware.RequireAuth(http.HandlerFunc(controllers.GetCurrentUser))).Methods("GET")
	authRouter.Handle("/profile", middleware.RequireAuth(http.HandlerFunc(controllers.UpdateProfile))).Methods("PUT")
	authRouter.Handle("/change-password", middleware.RequireAuth(http.HandlerFunc(controllers.ChangePassword))).Methods("PUT")
}
