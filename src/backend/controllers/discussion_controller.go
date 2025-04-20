
package controllers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// GetDiscussions gets all discussions for a course
func GetDiscussions(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]

	// Simplified implementation - just returns sample discussions
	response := Response{
		Success: true,
		Data: []map[string]interface{}{
			{
				"id":         1,
				"course_id":  courseID,
				"user_id":    1,
				"title":      "Помогите с заданием",
				"content":    "У меня возникла проблема с заданием 5, можете помочь?",
				"created_at": time.Now().Format(time.RFC3339),
				"user_name":  "Студент 1",
			},
			{
				"id":         2,
				"course_id":  courseID,
				"user_id":    2,
				"title":      "Вопрос по лекции",
				"content":    "Не понял часть про алгоритмы в последней лекции",
				"created_at": time.Now().Add(-24 * time.Hour).Format(time.RFC3339),
				"user_name":  "Студент 2",
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetDiscussion gets a discussion by ID
func GetDiscussion(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]
	discussionID := params["discussionId"]

	// Simplified implementation - just returns a sample discussion
	response := Response{
		Success: true,
		Data: map[string]interface{}{
			"id":         discussionID,
			"course_id":  courseID,
			"user_id":    1,
			"title":      "Помогите с заданием",
			"content":    "У меня возникла проблема с заданием 5, можете помочь?",
			"created_at": time.Now().Format(time.RFC3339),
			"user_name":  "Студент 1",
			"replies": []map[string]interface{}{
				{
					"id":           1,
					"discussion_id": discussionID,
					"user_id":      3,
					"content":      "Я тоже столкнулся с этой проблемой",
					"created_at":   time.Now().Add(-1 * time.Hour).Format(time.RFC3339),
					"user_name":    "Студент 3",
				},
				{
					"id":           2,
					"discussion_id": discussionID,
					"user_id":      4,
					"content":      "Попробуйте подход, описанный в лекции 3",
					"created_at":   time.Now().Add(-30 * time.Minute).Format(time.RFC3339),
					"user_name":    "Преподаватель",
				},
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// CreateDiscussion creates a new discussion
func CreateDiscussion(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]

	// Simplified implementation - just returns a success response
	response := Response{
		Success: true,
		Message: "Discussion created successfully for course " + courseID,
		Data: map[string]interface{}{
			"id":         3,
			"course_id":  courseID,
			"user_id":    1,
			"title":      "Новое обсуждение",
			"content":    "Содержание нового обсуждения",
			"created_at": time.Now().Format(time.RFC3339),
			"user_name":  "Студент 1",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// ReplyToDiscussion adds a reply to a discussion
func ReplyToDiscussion(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]
	discussionID := params["discussionId"]

	// Simplified implementation - just returns a success response
	response := Response{
		Success: true,
		Message: "Reply added to discussion " + discussionID + " in course " + courseID,
		Data: map[string]interface{}{
			"id":            3,
			"discussion_id": discussionID,
			"user_id":       1,
			"content":       "Новый ответ на обсуждение",
			"created_at":    time.Now().Format(time.RFC3339),
			"user_name":     "Студент 1",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}
