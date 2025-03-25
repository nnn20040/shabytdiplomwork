
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

	// Public routes
	courseRouter.HandleFunc("/", controllers.GetAllCourses).Methods("GET")
	courseRouter.HandleFunc("/search", controllers.SearchCourses).Methods("GET")
	courseRouter.HandleFunc("/{id}", controllers.GetCourseByID).Methods("GET")

	// Protected routes
	courseRouter.Handle("/", middleware.Protect(middleware.TeacherOnly(http.HandlerFunc(controllers.CreateCourse)))).Methods("POST")
	courseRouter.Handle("/teacher/my-courses", middleware.Protect(middleware.TeacherOnly(http.HandlerFunc(controllers.GetTeacherCourses)))).Methods("GET")
	courseRouter.Handle("/{id}", middleware.Protect(http.HandlerFunc(controllers.UpdateCourse))).Methods("PUT")
	courseRouter.Handle("/{id}", middleware.Protect(http.HandlerFunc(controllers.DeleteCourse))).Methods("DELETE")
}
