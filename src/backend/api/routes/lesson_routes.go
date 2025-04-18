
package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
)

// RegisterLessonRoutes registers lesson routes
func RegisterLessonRoutes(router *mux.Router) {
	// Create a lessons subrouter
	lessonRouter := router.PathPrefix("/api/courses/{courseId}/lessons").Subrouter()
	
	// Apply middleware
	lessonRouter.Use(middleware.CORSMiddleware)
	
	// Define routes
	lessonRouter.HandleFunc("", controllers.GetLessons).Methods("GET", "OPTIONS")
	lessonRouter.HandleFunc("", controllers.CreateLesson).Methods("POST", "OPTIONS") 
	lessonRouter.HandleFunc("/{lessonId}", controllers.GetLesson).Methods("GET", "OPTIONS")
	lessonRouter.HandleFunc("/{lessonId}", controllers.UpdateLesson).Methods("PUT", "OPTIONS")
	lessonRouter.HandleFunc("/{lessonId}", controllers.DeleteLesson).Methods("DELETE", "OPTIONS")
}
