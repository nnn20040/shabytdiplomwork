
package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

// GetCourseAnalytics gets analytics for a course
func GetCourseAnalytics(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["id"]

	// Simplified implementation - just returns sample analytics
	response := Response{
		Success: true,
		Data: map[string]interface{}{
			"course_id":     courseID,
			"total_students": 45,
			"average_score": 78.5,
			"completion_rate": 0.65,
			"engagement_metrics": map[string]interface{}{
				"lessons_viewed": 320,
				"tests_taken": 98,
				"discussions": 34,
			},
			"student_progress": []map[string]interface{}{
				{
					"user_id": 1,
					"name": "Студент 1",
					"progress": 0.9,
					"score": 85,
				},
				{
					"user_id": 2,
					"name": "Студент 2",
					"progress": 0.75,
					"score": 72,
				},
				{
					"user_id": 3,
					"name": "Студент 3",
					"progress": 0.6,
					"score": 68,
				},
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
