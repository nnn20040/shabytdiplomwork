
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
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
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
	var req RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Name == "" || req.Email == "" || req.Password == "" {
		http.Error(w, "Please provide all required fields", http.StatusBadRequest)
		return
	}

	// Create user
	user, err := models.CreateUser(r.Context(), req.Name, req.Email, req.Password, req.Role)
	if err != nil {
		if err.Error() == "user with this email already exists" {
			http.Error(w, err.Error(), http.StatusBadRequest)
		} else {
			log.Printf("Register error: %v", err)
			http.Error(w, "Server error during registration", http.StatusInternalServerError)
		}
		return
	}

	// Generate JWT token
	token, err := generateJWTToken(user)
	if err != nil {
		log.Printf("Error generating token: %v", err)
		http.Error(w, "Error generating authentication token", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
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

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// Login authenticates a user
func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Email == "" || req.Password == "" {
		http.Error(w, "Please provide email and password", http.StatusBadRequest)
		return
	}

	// Find user by email
	user, err := models.GetUserByEmail(r.Context(), req.Email)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Verify password
	err = models.ComparePassword(user.Password, req.Password)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Generate JWT token
	token, err := generateJWTToken(user)
	if err != nil {
		log.Printf("Error generating token: %v", err)
		http.Error(w, "Error generating authentication token", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
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

	w.Header().Set("Content-Type", "application/json")
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
