
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

	// Public routes с CORS поддержкой
	courseRouter.HandleFunc("/", addCorsHeaders(http.HandlerFunc(controllers.GetAllCourses))).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/search", addCorsHeaders(http.HandlerFunc(controllers.SearchCourses))).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{id}", addCorsHeaders(http.HandlerFunc(controllers.GetCourseByID))).Methods("GET", "OPTIONS")

	// Protected routes с CORS поддержкой
	courseRouter.Handle("/", addCorsHeaders(middleware.Protect(middleware.TeacherOnly(http.HandlerFunc(controllers.CreateCourse))))).Methods("POST", "OPTIONS")
	courseRouter.Handle("/teacher/my-courses", addCorsHeaders(middleware.Protect(middleware.TeacherOnly(http.HandlerFunc(controllers.GetTeacherCourses))))).Methods("GET", "OPTIONS")
	courseRouter.Handle("/{id}", addCorsHeaders(middleware.Protect(http.HandlerFunc(controllers.UpdateCourse)))).Methods("PUT", "OPTIONS")
	courseRouter.Handle("/{id}", addCorsHeaders(middleware.Protect(http.HandlerFunc(controllers.DeleteCourse)))).Methods("DELETE", "OPTIONS")
}
