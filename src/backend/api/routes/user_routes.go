package routes

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func RegisterUserRoutes(router *mux.Router) {
	userRouter := router.PathPrefix("/user").Subrouter()

	userRouter.HandleFunc("/progress", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"data": map[string]interface{}{
				"coursesCompleted": 2,
				"lessonsCompleted": 15,
				"testsCompleted":   8,
				"averageScore":     85,
			},
		})
	}).Methods("GET", "OPTIONS")

	enrollmentsRouter := router.PathPrefix("/api/enrollments").Subrouter()

	enrollmentsRouter.HandleFunc("", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"data": []map[string]interface{}{
				{
					"id":        1,
					"course_id": 1,
					"user_id":   1,
					"title":     "Математика для начинающих",
					"progress":  75,
				},
				{
					"id":        2,
					"course_id": 2,
					"user_id":   1,
					"title":     "Основы программирования",
					"progress":  50,
				},
			},
		})
	}).Methods("GET", "OPTIONS")
}
