
package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
)

// RegisterCourseRoutes registers course routes
func RegisterCourseRoutes(router *mux.Router) {
	// Course routes
	courseRouter := router.PathPrefix("/api/courses").Subrouter()

	// Use common CORS middleware
	courseRouter.Use(middleware.CORSMiddleware)

	// All routes are now public - simplified auth
	courseRouter.HandleFunc("/", controllers.GetAllCourses).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/search", controllers.SearchCourses).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{id}", controllers.GetCourseByID).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/", controllers.CreateCourse).Methods("POST", "OPTIONS")
	courseRouter.HandleFunc("/teacher/my-courses", controllers.GetTeacherCourses).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{id}", controllers.UpdateCourse).Methods("PUT", "OPTIONS")
	courseRouter.HandleFunc("/{id}", controllers.DeleteCourse).Methods("DELETE", "OPTIONS")
	
	// Add featured courses route to match frontend API
	courseRouter.HandleFunc("/featured", controllers.GetFeaturedCourses).Methods("GET", "OPTIONS")
	
	// Add course enrollment routes to match frontend API
	courseRouter.HandleFunc("/{id}/enroll", controllers.EnrollCourse).Methods("POST", "OPTIONS")
	
	// Add lesson routes to match frontend API
	courseRouter.HandleFunc("/{courseId}/lessons", controllers.CreateLesson).Methods("POST", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/lessons/{lessonId}", controllers.UpdateLesson).Methods("PUT", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/lessons/{lessonId}", controllers.DeleteLesson).Methods("DELETE", "OPTIONS")
	
	// Add test routes to match frontend API
	courseRouter.HandleFunc("/{courseId}/tests", controllers.CreateTest).Methods("POST", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/tests/{testId}", controllers.GetTest).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/tests/{testId}", controllers.UpdateTest).Methods("PUT", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/tests/{testId}", controllers.DeleteTest).Methods("DELETE", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/tests/{testId}/submit", controllers.SubmitTest).Methods("POST", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/tests/{testId}/results", controllers.GetTestResults).Methods("GET", "OPTIONS")
	
	// Add discussion routes to match frontend API
	courseRouter.HandleFunc("/{courseId}/discussions", controllers.GetDiscussions).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/discussions", controllers.CreateDiscussion).Methods("POST", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/discussions/{discussionId}", controllers.GetDiscussion).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/discussions/{discussionId}/replies", controllers.ReplyToDiscussion).Methods("POST", "OPTIONS")
	
	// Add analytics routes to match frontend API
	courseRouter.HandleFunc("/{id}/analytics", controllers.GetCourseAnalytics).Methods("GET", "OPTIONS")
}
