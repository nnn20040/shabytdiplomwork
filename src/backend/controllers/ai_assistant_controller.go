package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/nnn20040/shabytdiplomwork/src/backend/models"
	"github.com/nnn20040/shabytdiplomwork/src/backend/repository"
	"github.com/nnn20040/shabytdiplomwork/src/backend/services"
)

func AskQuestion(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(models.UserContextKey).(string)

	user, err := repository.GetUserByID(r.Context(), userID)
	if err != nil {
		http.Error(w, "user doesnt exists", http.StatusInternalServerError)
		return
	}

	var req models.AskQuestionRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Printf("Invalid request data: %v", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	if req.Question == "" {
		log.Println("Empty question received")
		http.Error(w, "Question is required", http.StatusBadRequest)
		return
	}

	log.Printf("Processing AI question: %s", req.Question)

	response, err := services.GenerateAIResponse(req.Question, user.Role)
	if err != nil {
		log.Printf("AI response error: %v", err)
		http.Error(w, "Server error while processing AI request", http.StatusInternalServerError)
		return
	}

	interaction := repository.CreateAIInteraction(r.Context(), userID, req.Question, response)

	responseObj := models.Response{
		Success: true,
		Data: map[string]interface{}{
			"id":         interaction.ID,
			"question":   interaction.Question,
			"response":   interaction.Response,
			"created_at": interaction.CreatedAt,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(responseObj)
}

func PublicAskQuestion(w http.ResponseWriter, r *http.Request) {
	var req models.AskQuestionRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Printf("Invalid request data: %v", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	if req.Question == "" {
		log.Println("Empty question received")
		http.Error(w, "Question is required", http.StatusBadRequest)
		return
	}

	log.Printf("Processing public AI question: %s", req.Question)

	response, err := services.GenerateAIResponse(req.Question, "anonymous")
	if err != nil {
		log.Printf("AI response error: %v", err)
		http.Error(w, "Server error while processing AI request", http.StatusInternalServerError)
		return
	}

	responseObj := models.Response{
		Success: true,
		Data: map[string]interface{}{
			"id":         "public_" + time.Now().Format(time.RFC3339),
			"question":   req.Question,
			"response":   response,
			"created_at": time.Now(),
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(responseObj)
}

func GetHistory(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(models.UserContextKey).(string)

	interactions, err := repository.GetAIInteractions(r.Context(), userID)
	if err != nil {
		log.Printf("AI response error: %v", err)
		http.Error(w, "Server error while processing AI request", http.StatusInternalServerError)
		return
	}
	response := models.Response{
		Success: true,
		Data:    interactions,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
