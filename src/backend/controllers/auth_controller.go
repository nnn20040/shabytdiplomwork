package controllers

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"backend/middleware"
	"backend/models"

	"github.com/dgrijalva/jwt-go"
	"gopkg.in/gomail.v2"
)

// Response represents a generic API response
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Token   string      `json:"token,omitempty"`
	User    interface{} `json:"user,omitempty"`
}

// RegisterRequest represents a user registration request
type RegisterRequest struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Role      string `json:"role"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
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

// JWTSecret is the secret key used to sign JWT tokens
var JWTSecret = []byte(os.Getenv("JWT_SECRET"))

// EnsureJWTSecret ensures that a JWT secret is set
func init() {
	if len(JWTSecret) == 0 {
		JWTSecret = []byte("shabyt_secure_jwt_key_2025")
	}
}

// Register registers a new user
func Register(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers for all responses
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Content-Type", "application/json")
	
	// Handle OPTIONS request for CORS preflight
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Printf("Error decoding request body: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{
			Success: false,
			Message: "Invalid request data",
		})
		return
	}

	// Log the registration request (without the password)
	logReq := req
	logReq.Password = "***REDACTED***"
	log.Printf("Registration request: %+v", logReq)

	// Validate input
	if req.Name == "" || req.Email == "" || req.Password == "" {
		log.Printf("Missing required fields: name=%s, email=%s, password_len=%d", req.Name, req.Email, len(req.Password))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{
			Success: false,
			Message: "Пожалуйста, заполните все необходимые поля",
		})
		return
	}

	// Create user
	user, err := models.CreateUser(r.Context(), req.FirstName, req.LastName, req.Email, req.Password, req.Role)
	if err != nil {
		log.Printf("Error creating user: %v", err)
		
		if strings.Contains(err.Error(), "user with this email already exists") {
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(Response{
				Success: false,
				Message: "Пользователь с таким email уже существует",
			})
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(Response{
				Success: false,
				Message: "Ошибка сервера при регистрации: " + err.Error(),
			})
		}
		return
	}

	// Generate JWT token
	token, err := generateJWTToken(user)
	if err != nil {
		log.Printf("Error generating token: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Response{
			Success: false,
			Message: "Ошибка генерации токена аутентификации",
		})
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Message: "Регистрация успешна",
		Token:   token,
		User: map[string]interface{}{
			"id":        user.ID,
			"name":      user.Name,
			"email":     user.Email,
			"role":      user.Role,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
		},
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// Login authenticates a user
func Login(w http.ResponseWriter, r *http.Request) {
	log.Printf("Login handler called with method: %s", r.Method)
	
	// Set CORS headers for all responses
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	
	// Handle OPTIONS request for CORS preflight
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Parse request body
	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Printf("Login error: Invalid request data - %v", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Debug login request
	log.Printf("Login attempt for email: %s", req.Email)

	// Validate input
	if req.Email == "" || req.Password == "" {
		log.Printf("Login error: Missing email or password")
		http.Error(w, "Please provide email and password", http.StatusBadRequest)
		return
	}

	// Find user by email
	user, err := models.GetUserByEmail(r.Context(), req.Email)
	if err != nil {
		log.Printf("Login error: User not found for email %s - %v", req.Email, err)
		
		// Use Response struct for consistent JSON format even in error cases
		response := Response{
			Success: false,
			Message: "Invalid credentials",
		}
		
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(response)
		return
	}

	log.Printf("User found: %s (%s)", user.Name, user.Email)
	log.Printf("Stored password hash: %s", user.Password)
	log.Printf("Comparing with provided password: %s", req.Password)

	// Verify password
	err = models.ComparePassword(user.Password, req.Password)
	if err != nil {
		log.Printf("Login error: Invalid password for user %s - %v", user.Email, err)
		
		// Use Response struct for consistent JSON format
		response := Response{
			Success: false,
			Message: "Invalid credentials",
		}
		
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Generate JWT token
	token, err := generateJWTToken(user)
	if err != nil {
		log.Printf("Error generating token: %v", err)
		
		response := Response{
			Success: false,
			Message: "Error generating authentication token",
		}
		
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Message: "Login successful",
		Token:   token,
		User: map[string]interface{}{
			"id":        user.ID,
			"name":      user.Name,
			"email":     user.Email,
			"role":      user.Role,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
		},
	}

	log.Printf("Login successful for user: %s", user.Email)
	log.Printf("Token generated: %s...", token[:20])

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// GetCurrentUser returns the current authenticated user
func GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	// Get user from context (added by Protect middleware)
	user, ok := r.Context().Value(middleware.UserKey).(*models.User)
	if !ok {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Return success response
	response := Response{
		Success: true,
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

// UpdateProfile updates a user's profile
func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	// Get user from context (added by Protect middleware)
	user, ok := r.Context().Value(middleware.UserKey).(*models.User)
	if !ok {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	var req UpdateProfileRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Name == "" || req.Email == "" {
		http.Error(w, "Please provide all required fields", http.StatusBadRequest)
		return
	}

	// Update user
	updatedUser, err := models.UpdateUser(r.Context(), user.ID, req.Name, req.Email, user.Role)
	if err != nil {
		log.Printf("Update profile error: %v", err)
		http.Error(w, "Server error during profile update", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
		User:    updatedUser,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// ChangePassword changes a user's password
func ChangePassword(w http.ResponseWriter, r *http.Request) {
	// Get user from context (added by Protect middleware)
	user, ok := r.Context().Value(middleware.UserKey).(*models.User)
	if !ok {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	var req ChangePasswordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.CurrentPassword == "" || req.NewPassword == "" {
		http.Error(w, "Please provide current and new passwords", http.StatusBadRequest)
		return
	}

	// Get user with password (the user from context doesn't include the password)
	userWithPassword, err := models.GetUserByEmail(r.Context(), user.Email)
	if err != nil {
		log.Printf("Error getting user: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// Verify current password
	err = models.ComparePassword(userWithPassword.Password, req.CurrentPassword)
	if err != nil {
		http.Error(w, "Current password is incorrect", http.StatusUnauthorized)
		return
	}

	// Update password
	err = models.UpdatePassword(r.Context(), user.ID, req.NewPassword)
	if err != nil {
		log.Printf("Change password error: %v", err)
		http.Error(w, "Server error during password change", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Message: "Password updated successfully",
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

	if req.Email == "" {
		http.Error(w, "Please provide an email", http.StatusBadRequest)
		return
	}

	// Find user by email
	user, err := models.GetUserByEmail(r.Context(), req.Email)
	if err != nil {
		// Don't reveal that the user doesn't exist
		response := Response{
			Success: true,
			Message: "Если аккаунт с таким email существует, код для сброса пароля был отправлен",
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	// Generate reset token (6-digit hex code for better visibility)
	tokenBytes := make([]byte, 3)
	if _, err := rand.Read(tokenBytes); err != nil {
		log.Printf("Error generating reset token: %v", err)
		http.Error(w, "Ошибка сервера при обработке запроса на сброс пароля", http.StatusInternalServerError)
		return
	}
	resetToken := hex.EncodeToString(tokenBytes)[:6]
	resetTokenExpiry := time.Now().Add(15 * time.Minute).Unix()

	// Save token to database
	err = models.SaveResetToken(r.Context(), user.ID, resetToken, resetTokenExpiry)
	if err != nil {
		log.Printf("Error saving reset token: %v", err)
		http.Error(w, "Ошибка сервера при обработке запроса на сброс пароля", http.StatusInternalServerError)
		return
	}

	// Send email
	err = sendResetEmail(user.Email, resetToken)
	if err != nil {
		log.Printf("Error sending reset email: %v", err)
		// Log the token temporarily for debugging
		fmt.Printf("DEBUG RESET TOKEN for %s: %s\n", user.Email, resetToken)
	}

	// Return success response with token in dev environments
	response := Response{
		Success: true,
		Message: "Код для сброса пароля отправлен на ваш email",
	}

	// Include the reset token in development environment
	if os.Getenv("GO_ENV") != "production" {
		response.Data = map[string]string{
			"resetToken": resetToken,
		}
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

	if req.Email == "" || req.Token == "" || req.NewPassword == "" {
		http.Error(w, "Please provide email, reset token, and new password", http.StatusBadRequest)
		return
	}

	// Find user by email
	user, err := models.GetUserByEmail(r.Context(), req.Email)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Verify token
	valid, err := models.VerifyResetToken(r.Context(), user.ID, req.Token)
	if err != nil {
		log.Printf("Error verifying reset token: %v", err)
		http.Error(w, "Server error during password reset", http.StatusInternalServerError)
		return
	}

	if !valid {
		http.Error(w, "Invalid or expired reset token", http.StatusBadRequest)
		return
	}

	// Update password
	err = models.UpdatePassword(r.Context(), user.ID, req.NewPassword)
	if err != nil {
		log.Printf("Error updating password: %v", err)
		http.Error(w, "Server error during password reset", http.StatusInternalServerError)
		return
	}

	// Clear reset token
	err = models.ClearResetToken(r.Context(), user.ID)
	if err != nil {
		log.Printf("Error clearing reset token: %v", err)
		// Continue anyway
	}

	// Return success response
	response := Response{
		Success: true,
		Message: "Password has been reset successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Helper functions

// generateJWTToken generates a JWT token for a user
func generateJWTToken(user *models.User) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = user.ID
	claims["name"] = user.Name
	claims["email"] = user.Email
	claims["role"] = user.Role
	claims["firstName"] = user.FirstName
	claims["lastName"] = user.LastName
	claims["exp"] = time.Now().Add(30 * 24 * time.Hour).Unix() // 30 days expiry

	return token.SignedString(JWTSecret)
}

// sendResetEmail sends a password reset email to a user
func sendResetEmail(email, resetToken string) error {
	host := os.Getenv("SMTP_HOST")
	if host == "" {
		host = "smtp.gmail.com"
	}

	port := 587
	if portStr := os.Getenv("SMTP_PORT"); portStr != "" {
		if p, err := strconv.Atoi(portStr); err == nil {
			port = p
		}
	}

	username := os.Getenv("SMTP_USER")
	password := os.Getenv("SMTP_PASSWORD")

	from := os.Getenv("FROM_EMAIL")
	if from == "" {
		from = "noreply@shabyt.kz"
	}

	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", email)
	m.SetHeader("Subject", "Shabyt - Сброс пароля")
	m.SetBody("text/plain", "Ваш код для сброса пароля: "+resetToken+". Код действителен в течение 15 минут.")
	m.SetBody("text/html", `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
			<h2 style="color: #4f46e5;">Shabyt - Сброс пароля</h2>
			<p>Вы запросили сброс пароля. Используйте следующий код для восстановления доступа:</p>
			<div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
				`+resetToken+`
			</div>
			<p>Код действителен в течение 15 минут.</p>
			<p>Если вы не запрашивали сброс пароля, проигнорируйте это сообщение.</p>
		</div>
	`)

	d := gomail.NewDialer(host, port, username, password)

	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
}
