
package routes

import (
	"net/http"

	"backend/controllers"

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

	// All routes are now public - simplified auth
	courseRouter.HandleFunc("/", controllers.GetAllCourses).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/search", controllers.SearchCourses).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{id}", controllers.GetCourseByID).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/", controllers.CreateCourse).Methods("POST", "OPTIONS")
	courseRouter.HandleFunc("/teacher/my-courses", controllers.GetTeacherCourses).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{id}", controllers.UpdateCourse).Methods("PUT", "OPTIONS")
	courseRouter.HandleFunc("/{id}", controllers.DeleteCourse).Methods("DELETE", "OPTIONS")
}
