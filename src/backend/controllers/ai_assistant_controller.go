
package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"backend/config"
	"backend/middleware"
	"backend/models"
	"backend/services"
)

// AskQuestionRequest represents a request to ask a question to the AI assistant
type AskQuestionRequest struct {
	Question string `json:"question"`
}

// AIInteraction represents an interaction with the AI assistant
type AIInteraction struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Question  string    `json:"question"`
	Response  string    `json:"response"`
	CreatedAt time.Time `json:"created_at"`
}

// AskQuestion handles a request to ask a question to the AI assistant
func AskQuestion(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers for the main request
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept")
	
	// Get user from context (added by Protect middleware)
	user, ok := r.Context().Value(middleware.UserKey).(*models.User)
	if !ok {
		log.Println("User not found in context")
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	var req AskQuestionRequest
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

	log.Printf("Processing AI question: %s", req.Question)

	// Generate AI response
	response, err := services.GenerateAIResponse(req.Question, user.Role)
	if err != nil {
		log.Printf("AI response error: %v", err)
		http.Error(w, "Server error while processing AI request", http.StatusInternalServerError)
		return
	}

	// Save the interaction in the database
	var interaction AIInteraction
	err = config.QueryRowContext(r.Context(),
		"INSERT INTO ai_assistant (user_id, question, response, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, user_id, question, response, created_at",
		user.ID, req.Question, response).Scan(&interaction.ID, &interaction.UserID, &interaction.Question, &interaction.Response, &interaction.CreatedAt)
	if err != nil {
		log.Printf("Error saving AI interaction: %v", err)
		// Continue anyway, we can still return the response
	}

	// Return success response
	responseObj := Response{
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

// PublicAskQuestion handles anonymous requests to the AI assistant
func PublicAskQuestion(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers for the main request
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept")
	
	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req AskQuestionRequest
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

	// Generate AI response without user role
	response, err := services.GenerateAIResponse(req.Question, "anonymous")
	if err != nil {
		log.Printf("AI response error: %v", err)
		http.Error(w, "Server error while processing AI request", http.StatusInternalServerError)
		return
	}

	// Return success response
	responseObj := Response{
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

// GetHistory returns a user's AI assistant interaction history
func GetHistory(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers for the main request
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept")
	
	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	
	// Get user from context (added by Protect middleware)
	user, ok := r.Context().Value(middleware.UserKey).(*models.User)
	if !ok {
		log.Println("User not found in context")
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Get user's AI interaction history
	rows, err := config.QueryContext(r.Context(),
		"SELECT id, user_id, question, response, created_at FROM ai_assistant WHERE user_id = $1 ORDER BY created_at DESC",
		user.ID)
	if err != nil {
		log.Printf("Get AI history error: %v", err)
		http.Error(w, "Server error while retrieving AI history", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var interactions []AIInteraction
	for rows.Next() {
		var interaction AIInteraction
		err := rows.Scan(&interaction.ID, &interaction.UserID, &interaction.Question, &interaction.Response, &interaction.CreatedAt)
		if err != nil {
			log.Printf("Error scanning AI interaction row: %v", err)
			continue
		}
		interactions = append(interactions, interaction)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating AI interaction rows: %v", err)
		http.Error(w, "Server error while retrieving AI history", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Data:    interactions,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
