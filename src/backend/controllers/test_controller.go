package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/nnn20040/shabytdiplomwork/src/backend/models"
)

func CreateTest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]

	response := models.Response{
		Success: true,
		Message: "Test created successfully for course " + courseID,
		Data: map[string]interface{}{
			"id":        1,
			"course_id": courseID,
			"title":     "New Test",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func GetTest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]
	testID := params["testId"]

	response := models.Response{
		Success: true,
		Data: map[string]interface{}{
			"id":        testID,
			"course_id": courseID,
			"title":     "Sample Test",
			"questions": []map[string]interface{}{
				{
					"id":      1,
					"text":    "What is 2+2?",
					"options": []string{"3", "4", "5", "6"},
					"answer":  1, 
				},
				{
					"id":      2,
					"text":    "What is the capital of France?",
					"options": []string{"London", "Berlin", "Paris", "Madrid"},
					"answer":  2, 
				},
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func UpdateTest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]
	testID := params["testId"]

	response := models.Response{
		Success: true,
		Message: "Test " + testID + " updated successfully for course " + courseID,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func DeleteTest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]
	testID := params["testId"]

	response := models.Response{
		Success: true,
		Message: "Test " + testID + " deleted successfully from course " + courseID,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func SubmitTest(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]
	testID := params["testId"]

	response := models.Response{
		Success: true,
		Message: "Test " + testID + " submitted successfully for course " + courseID,
		Data: map[string]interface{}{
			"score":      85,
			"total":      100,
			"percentage": 85,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetTestResults(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]
	testID := params["testId"]

	response := models.Response{
		Success: true,
		Data: map[string]interface{}{
			"id":         testID,
			"course_id":  courseID,
			"score":      85,
			"total":      100,
			"percentage": 85,
			"completed":  true,
			"answers": []map[string]interface{}{
				{
					"question_id": 1,
					"selected":    1,
					"correct":     true,
				},
				{
					"question_id": 2,
					"selected":    2,
					"correct":     true,
				},
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
