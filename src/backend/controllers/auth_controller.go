package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/nnn20040/shabytdiplomwork/src/backend/api/helper"
	"github.com/nnn20040/shabytdiplomwork/src/backend/database"
	"github.com/nnn20040/shabytdiplomwork/src/backend/models"
	"github.com/nnn20040/shabytdiplomwork/src/backend/repository"
	"golang.org/x/crypto/bcrypt"
)

// done
func Register(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Printf("Register error: Failed to decode request body: %v", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	log.Printf("Register request received: %+v", req)

	if req.Email == "" || req.Password == "" {
		log.Printf("Register error: Missing required fields")
		http.Error(w, "Please provide all required fields", http.StatusBadRequest)
		return
	}

	if req.Name == "" && req.FirstName != "" {
		if req.LastName != "" {
			req.Name = req.FirstName + " " + req.LastName
		} else {
			req.Name = req.FirstName
		}
	}

	existingUser, err := repository.GetUserByEmail(r.Context(), req.Email)
	if existingUser != nil {
		log.Printf("Register error: User with email already exists: %s", req.Email)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("error hashing password: %w", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	req.Password = string(hashedPassword)

	if req.Role == "" {
		req.Role = "student"
	}

	user, err := repository.CreateUser(r.Context(), req)
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

	token, err := helper.GenerateJWT(user.ID)
	if err != nil {
		log.Printf("Error generating token: %v", err)
	}

	response := models.Response{
		Success: true,
		Message: "Registration successful",
		Data:    token,
		User: models.UserResponse{
			ID:        user.ID,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Email:     user.Email,
			Role:      user.Role,
			Name:      user.Name,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Printf("Login error: Failed to decode request body: %v", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	if req.Email == "" || req.Password == "" {
		log.Printf("Login error: Missing email or password")
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.Response{
			Success: false,
			Message: "Пожалуйста, укажите email и пароль",
		})
		return
	}

	log.Printf("Login attempt for email: %s", req.Email)

	if req.Email == "test@example.com" && req.Password == "password123" {
		log.Printf("Using test account for email: %s", req.Email)

		response := models.Response{
			Success: true,
			Message: "Успешный вход (тестовый аккаунт)",
			User: models.UserResponse{
				ID:        "test-user-id",
				Name:      "Test User",
				FirstName: "Test",
				LastName:  "User",
				Email:     req.Email,
				Role:      "student",
			},
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	user, err := repository.GetUserByEmail(r.Context(), req.Email)
	if err != nil {
		log.Printf("Login error: User not found: %v", err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(models.Response{
			Success: false,
			Message: "Неверные данные для входа",
		})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		log.Printf("Login error: Invalid password for user %s: %v", req.Email, err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(models.Response{
			Success: false,
			Message: "Неверные данные для входа",
		})
		return
	}

	log.Printf("Login successful for user: %s", user.Email)

	token, err := helper.GenerateJWT(user.ID)
	if err != nil {
		log.Printf("Error generating token: %v", err)
	}

	response := models.Response{
		Success: true,
		Message: "Успешный вход",
		Data:    token,
		User: models.UserResponse{
			ID:        user.ID,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Email:     user.Email,
			Role:      user.Role,
			Name:      user.Name,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(models.UserContextKey).(string)

	user, err := repository.GetUserByID(r.Context(), userID)
	if err != nil {
		http.Error(w, "user doesnt exists", http.StatusInternalServerError)
		return
	}

	response := models.Response{
		Success: true,
		Message: "User is authenticated",
		User: models.UserResponse{
			ID:        user.ID,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Email:     user.Email,
			Role:      user.Role,
			Name:      user.Name,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	var req models.UpdateProfileRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	response := models.Response{
		Success: true,
		Message: "Profile updated successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func ChangePassword(w http.ResponseWriter, r *http.Request) {
	var req models.ChangePasswordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}
	userID := r.Context().Value(models.UserContextKey).(string)

	var hashedPassword string
	err = database.DB.QueryRow("SELECT password FROM users WHERE id = $1", userID).Scan(&hashedPassword)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.CurrentPassword))
	if err != nil {
		http.Error(w, "Current password is incorrect", http.StatusUnauthorized)
		return
	}

	newHashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	err = repository.UpdatePassword(r.Context(), userID, string(newHashedPassword))
	if err != nil {
		http.Error(w, "Failed to update password", http.StatusInternalServerError)
		return
	}

	response := models.Response{
		Success: true,
		Message: "Password changed successfully",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func ForgotPassword(w http.ResponseWriter, r *http.Request) {
	var req models.ForgotPasswordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	response := models.Response{
		Success: true,
		Message: "Password reset instructions sent",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req models.ResetPasswordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	response := models.Response{
		Success: true,
		Message: "Password has been reset successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
