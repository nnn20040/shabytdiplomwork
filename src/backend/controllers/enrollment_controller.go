package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/nnn20040/shabytdiplomwork/src/backend/models"
)

func EnrollCourse(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["id"]

	response := models.Response{
		Success: true,
		Message: "Successfully enrolled in course " + courseID,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetFeaturedCourses(w http.ResponseWriter, r *http.Request) {
	response := models.Response{
		Success: true,
		Data: []map[string]interface{}{
			{
				"id":          1,
				"title":       "Математика для начинающих",
				"description": "Базовый курс математики",
				"featured":    true,
				"image_url":   "https://example.com/math.jpg",
			},
			{
				"id":          2,
				"title":       "Физика в примерах",
				"description": "Интерактивный курс физики",
				"featured":    true,
				"image_url":   "https://example.com/physics.jpg",
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetCourseAnalytics(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["id"]

	response := models.Response{
		Success: true,
		Data: map[string]interface{}{
			"course_id":       courseID,
			"total_students":  45,
			"average_score":   78.5,
			"completion_rate": 0.65,
			"engagement_metrics": map[string]interface{}{
				"lessons_viewed": 320,
				"tests_taken":    98,
				"discussions":    34,
			},
			"student_progress": []map[string]interface{}{
				{
					"user_id":  1,
					"name":     "Студент 1",
					"progress": 0.9,
					"score":    85,
				},
				{
					"user_id":  2,
					"name":     "Студент 2",
					"progress": 0.75,
					"score":    72,
				},
				{
					"user_id":  3,
					"name":     "Студент 3",
					"progress": 0.6,
					"score":    68,
				},
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
