
package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

// EnrollCourse enrolls a user in a course
func EnrollCourse(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["id"]

	// Simplified implementation - just returns a success response
	response := Response{
		Success: true,
		Message: "Successfully enrolled in course " + courseID,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetFeaturedCourses gets featured courses
func GetFeaturedCourses(w http.ResponseWriter, r *http.Request) {
	// Simplified implementation - just returns a sample featured courses
	response := Response{
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
