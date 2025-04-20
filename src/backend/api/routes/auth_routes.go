package routes

import (
	"net/http"

	"backend/controllers"
	"backend/middleware"
	"net/http"

	"github.com/gorilla/mux"
)

// RegisterAuthRoutes registers authentication routes
func RegisterAuthRoutes(router *mux.Router) {
	// Auth routes
	authRouter := router.PathPrefix("/api/auth").Subrouter()

	// Use common CORS middleware
	authRouter.Use(middleware.CORSMiddleware)

	// Public routes
	authRouter.HandleFunc("/register", controllers.Register).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/login", controllers.Login).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/forgot-password", controllers.ForgotPassword).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/reset-password", controllers.ResetPassword).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/me", controllers.GetCurrentUser).Methods("GET", "OPTIONS")
	authRouter.HandleFunc("/profile", controllers.UpdateProfile).Methods("PUT", "OPTIONS")
	authRouter.HandleFunc("/change-password", controllers.ChangePassword).Methods("PUT", "OPTIONS")
	
	// Logout route
	authRouter.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"success": true, "message": "Logged out successfully"}`))
	}).Methods("POST", "OPTIONS")
}
