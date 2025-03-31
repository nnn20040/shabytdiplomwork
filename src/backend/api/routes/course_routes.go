
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

	// Handle CORS Preflight globally for course routes
	courseRouter.Methods("OPTIONS").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Authorization")
		w.WriteHeader(http.StatusOK)
	})

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
