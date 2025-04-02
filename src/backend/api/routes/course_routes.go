
package routes

import (
	"net/http"

	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
)

// RegisterCourseRoutes registers course routes
func RegisterCourseRoutes(router *mux.Router) {
	// Course routes
	courseRouter := router.PathPrefix("/api/courses").Subrouter()

	// Enable CORS for all course routes
	courseRouter.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Handle OPTIONS requests
			if r.Method == http.MethodOptions {
				w.Header().Set("Access-Control-Allow-Origin", "*")
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept")
				w.WriteHeader(http.StatusOK)
				return
			}
			
			// Set CORS headers for all other requests
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept")
			
			next.ServeHTTP(w, r)
		})
	})

	// Public routes
	courseRouter.HandleFunc("/", controllers.GetAllCourses).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/search", controllers.SearchCourses).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{id}", controllers.GetCourseByID).Methods("GET", "OPTIONS")

	// Protected routes
	courseRouter.Handle("/", middleware.Protect(middleware.TeacherOnly(http.HandlerFunc(controllers.CreateCourse)))).Methods("POST", "OPTIONS")
	courseRouter.Handle("/teacher/my-courses", middleware.Protect(middleware.TeacherOnly(http.HandlerFunc(controllers.GetTeacherCourses)))).Methods("GET", "OPTIONS")
	courseRouter.Handle("/{id}", middleware.Protect(http.HandlerFunc(controllers.UpdateCourse))).Methods("PUT", "OPTIONS")
	courseRouter.Handle("/{id}", middleware.Protect(http.HandlerFunc(controllers.DeleteCourse))).Methods("DELETE", "OPTIONS")
	
	// Lesson routes
	courseRouter.Handle("/{id}/lessons", middleware.Protect(middleware.TeacherOnly(http.HandlerFunc(controllers.CreateLesson)))).Methods("POST", "OPTIONS")
	courseRouter.Handle("/{id}/lessons/{lessonId}", middleware.Protect(middleware.TeacherOnly(http.HandlerFunc(controllers.UpdateLesson)))).Methods("PUT", "OPTIONS")
	courseRouter.Handle("/{id}/lessons/{lessonId}", middleware.Protect(middleware.TeacherOnly(http.HandlerFunc(controllers.DeleteLesson)))).Methods("DELETE", "OPTIONS")
}
