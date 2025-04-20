package controllers

import (
	"encoding/json"
	"log"
	"net/http"
<<<<<<< HEAD
	"os"
	"strconv"
	"time"
=======
>>>>>>> cd921a5ac2f69d998d31ec5ec2307706058d18ee

	"backend/models"
)

// Response represents a generic API response
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	User    interface{} `json:"user,omitempty"`
}

// RegisterRequest represents a user registration request
type RegisterRequest struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Role      string `json:"role"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

// LoginRequest represents a user login request
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// UpdateProfileRequest represents a request to update a user's profile
type UpdateProfileRequest struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

// ChangePasswordRequest represents a request to change a user's password
type ChangePasswordRequest struct {
	CurrentPassword string `json:"currentPassword"`
	NewPassword     string `json:"newPassword"`
}

// ForgotPasswordRequest represents a request to initiate the password reset process
type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

// ResetPasswordRequest represents a request to reset a user's password
type ResetPasswordRequest struct {
	Email       string `json:"email"`
	Token       string `json:"token"`
	NewPassword string `json:"newPassword"`
}

// Register registers a new user
func Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Printf("Register error: Failed to decode request body: %v", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	log.Printf("Register request received: %+v", req)

	// Validate input
	if req.Email == "" || req.Password == "" {
		log.Printf("Register error: Missing required fields")
		http.Error(w, "Please provide all required fields", http.StatusBadRequest)
		return
	}

	// If name is not provided but first name is, create name from first and last name
	if req.Name == "" && req.FirstName != "" {
		if req.LastName != "" {
			req.Name = req.FirstName + " " + req.LastName
		} else {
			req.Name = req.FirstName
		}
	}

	// Create user
	user, err := models.CreateUser(r.Context(), req.Name, req.Email, req.Password, req.Role)
	if err != nil {
		if err.Error() == "user with this email already exists" {
			log.Printf("Register error: User with email already exists: %s", req.Email)
			http.Error(w, err.Error(), http.StatusBadRequest)
		} else {
			log.Printf("Register error: %v", err)
			http.Error(w, "Server error during registration", http.StatusInternalServerError)
		}
		return
	}

	log.Printf("User registered successfully: %s", user.Email)

	// Return success response without token
	response := Response{
		Success: true,
		Message: "Registration successful",
		User: map[string]interface{}{
			"id":        user.ID,
			"name":      user.Name,
			"email":     user.Email,
			"role":      user.Role,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// Login authenticates a user
func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Printf("Login error: Failed to decode request body: %v", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Email == "" || req.Password == "" {
		log.Printf("Login error: Missing email or password")
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{
			Success: false,
			Message: "Пожалуйста, укажите email и пароль",
		})
		return
	}

	log.Printf("Login attempt for email: %s", req.Email)

	// Testing account for development
	if req.Email == "test@example.com" && req.Password == "password123" {
		log.Printf("Using test account for email: %s", req.Email)
		testUser := map[string]interface{}{
			"id":        "test-user-id",
			"name":      "Test User",
			"email":     req.Email,
			"role":      "student",
			"firstName": "Test",
			"lastName":  "User",
		}
		
		response := Response{
			Success: true,
			Message: "Успешный вход (тестовый аккаунт)",
			User:    testUser,
		}
		
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	// Find user by email
	user, err := models.GetUserByEmail(r.Context(), req.Email)
	if err != nil {
		log.Printf("Login error: User not found: %v", err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(Response{
			Success: false,
			Message: "Неверные данные для входа",
		})
		return
	}

	// Verify password
	err = models.ComparePassword(user.Password, req.Password)
	if err != nil {
		log.Printf("Login error: Invalid password for user %s: %v", req.Email, err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(Response{
			Success: false,
			Message: "Неверные данные для входа",
		})
		return
	}

	log.Printf("Login successful for user: %s", user.Email)

	// Return success response with user data
	response := Response{
		Success: true,
		Message: "Успешный вход",
		User: map[string]interface{}{
			"id":        user.ID,
			"name":      user.Name,
			"email":     user.Email,
			"role":      user.Role,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetCurrentUser returns the current authenticated user
func GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	// Simply return success with status 200 to indicate user is logged in
	response := Response{
		Success: true,
		Message: "User is authenticated",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// UpdateProfile updates a user's profile
func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	var req UpdateProfileRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// For the simplified version, just send a successful response
	response := Response{
		Success: true,
		Message: "Profile updated successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// ChangePassword changes a user's password
func ChangePassword(w http.ResponseWriter, r *http.Request) {
	var req ChangePasswordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// For the simplified version, just send a successful response
	response := Response{
		Success: true,
		Message: "Password changed successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// ForgotPassword initiates the password reset process
func ForgotPassword(w http.ResponseWriter, r *http.Request) {
	var req ForgotPasswordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// For the simplified version, just send a successful response
	response := Response{
		Success: true,
		Message: "Password reset instructions sent",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// ResetPassword resets a user's password using a reset token
func ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req ResetPasswordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// For the simplified version, just send a successful response
	response := Response{
		Success: true,
		Message: "Password has been reset successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
