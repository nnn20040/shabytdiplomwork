
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

// // RegisterForumRoutes добавляет маршруты для форума и общих обсуждений
// func RegisterForumRoutes(router *mux.Router) {
// 	forumRouter := router.PathPrefix("/forum").Subrouter()

// 	// Общие маршруты форума
// 	forumRouter.HandleFunc("", controllers.GetAllDiscussions).Methods("GET", "OPTIONS")
// 	forumRouter.HandleFunc("/categories", controllers.GetForumCategories).Methods("GET", "OPTIONS")
	
// 	// Создание новой темы на форуме
// 	forumRouter.HandleFunc("/topics", middleware.RequireAuth(controllers.CreateForumTopic)).Methods("POST", "OPTIONS")
// 	forumRouter.HandleFunc("/topics/{topicId}", controllers.GetForumTopic).Methods("GET", "OPTIONS")
// 	forumRouter.HandleFunc("/topics/{topicId}/replies", middleware.RequireAuth(controllers.ReplyToForumTopic)).Methods("POST", "OPTIONS")
	
// 	// Дополнительные действия
// 	forumRouter.HandleFunc("/topics/{topicId}/like", middleware.RequireAuth(controllers.LikeForumTopic)).Methods("POST", "OPTIONS")
// 	forumRouter.HandleFunc("/topics/{topicId}/replies/{replyId}/like", middleware.RequireAuth(controllers.LikeForumReply)).Methods("POST", "OPTIONS")
// }
