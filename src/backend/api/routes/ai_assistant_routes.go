package routes

import (
	"github.com/nnn20040/shabytdiplomwork/src/backend/controllers"
	"github.com/nnn20040/shabytdiplomwork/src/backend/middleware"

	"github.com/gorilla/mux"
)

func RegisterAIAssistantRoutes(router *mux.Router) {
	aiRouter := router.PathPrefix("/ai-assistant").Subrouter()

	aiRouter.HandleFunc("/ask", middleware.RequireAuth(controllers.AskQuestion)).Methods("POST", "OPTIONS")
	aiRouter.HandleFunc("/history", middleware.RequireAuth(controllers.GetHistory)).Methods("GET", "OPTIONS")
	aiRouter.HandleFunc("/public-ask", controllers.PublicAskQuestion).Methods("POST", "OPTIONS")
}
