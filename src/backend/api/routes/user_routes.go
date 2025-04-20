
package routes

import (
	"encoding/json"
	"net/http"

	"backend/middleware"

	"github.com/gorilla/mux"
)

// RegisterUserRoutes registers user routes
func RegisterUserRoutes(router *mux.Router) {
	// User routes
	userRouter := router.PathPrefix("/api/user").Subrouter()
	
	// Use common CORS middleware
	userRouter.Use(middleware.CORSMiddleware)

	// Add user progress route (simplified implementation)
	userRouter.HandleFunc("/progress", func(w http.ResponseWriter, r *http.Request) {
		// Simplified implementation - just returns a success response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"data": map[string]interface{}{
				"coursesCompleted": 2,
				"lessonsCompleted": 15,
				"testsCompleted": 8,
				"averageScore": 85,
			},
		})
	}).Methods("GET", "OPTIONS")
	
	// Add enrollments route (simplified implementation)
	enrollmentsRouter := router.PathPrefix("/api/enrollments").Subrouter()
	enrollmentsRouter.Use(middleware.CORSMiddleware)
	
	enrollmentsRouter.HandleFunc("", func(w http.ResponseWriter, r *http.Request) {
		// Simplified implementation - just returns a success response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"data": []map[string]interface{}{
				{
					"id": 1,
					"course_id": 1,
					"user_id": 1,
					"title": "Математика для начинающих",
					"progress": 75,
				},
				{
					"id": 2,
					"course_id": 2,
					"user_id": 1,
					"title": "Основы программирования",
					"progress": 50,
				},
			},
		})
	}).Methods("GET", "OPTIONS")
}
