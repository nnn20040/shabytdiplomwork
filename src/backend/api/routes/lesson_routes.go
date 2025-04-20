
package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
)

// RegisterLessonRoutes registers lesson routes for the API
// These routes handle CRUD operations for course lessons
func RegisterLessonRoutes(router *mux.Router) {
	// Create a lessons subrouter
	lessonRouter := router.PathPrefix("/api/courses/{courseId}/lessons").Subrouter()
	
	// Apply middleware
	lessonRouter.Use(middleware.CORSMiddleware)
	
	// Define routes
	lessonRouter.HandleFunc("", controllers.GetLessons).Methods("GET", "OPTIONS")
	lessonRouter.HandleFunc("", middleware.RequireAuth(controllers.CreateLesson)).Methods("POST", "OPTIONS") 
	lessonRouter.HandleFunc("/{lessonId}", controllers.GetLesson).Methods("GET", "OPTIONS")
	lessonRouter.HandleFunc("/{lessonId}", middleware.RequireAuth(controllers.UpdateLesson)).Methods("PUT", "OPTIONS")
	lessonRouter.HandleFunc("/{lessonId}", middleware.RequireAuth(controllers.DeleteLesson)).Methods("DELETE", "OPTIONS")
}
