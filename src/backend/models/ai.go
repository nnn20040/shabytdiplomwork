package models

import "time"

type AskQuestionRequest struct {
	Question string `json:"question"`
}

type AIInteraction struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Question  string    `json:"question"`
	Response  string    `json:"response"`
	CreatedAt time.Time `json:"created_at"`
}
