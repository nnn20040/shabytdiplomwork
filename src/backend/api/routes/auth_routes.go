package routes

import (
	"net/http"

	"github.com/nnn20040/shabytdiplomwork/src/backend/controllers"
	"github.com/nnn20040/shabytdiplomwork/src/backend/middleware"

	"github.com/gorilla/mux"
)

func RegisterAuthRoutes(router *mux.Router) {
	authRouter := router.PathPrefix("/auth").Subrouter()

	authRouter.HandleFunc("/register", controllers.Register).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/login", controllers.Login).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/forgot-password", controllers.ForgotPassword).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/reset-password", controllers.ResetPassword).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/me", middleware.RequireAuth(controllers.GetCurrentUser)).Methods("GET", "OPTIONS")
	authRouter.HandleFunc("/profile", controllers.UpdateProfile).Methods("PUT", "OPTIONS")
	authRouter.HandleFunc("/change-password", controllers.ChangePassword).Methods("POST", "OPTIONS")

	authRouter.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"success": true, "message": "Logged out successfully"}`))
	}).Methods("POST", "OPTIONS")
}
