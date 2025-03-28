
package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	"backend/models"
	"backend/config"

	"github.com/dgrijalva/jwt-go"
)

// UserKey is the context key for the user object
type userContextKey string
const UserKey userContextKey = "user"

// RequireAuth is a middleware that checks if the user is authenticated
func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized: No token provided", http.StatusUnauthorized)
			return
		}
		
		// Check if the authorization header has the Bearer scheme
		if !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Unauthorized: Invalid token format", http.StatusUnauthorized)
			return
		}
		
		// Extract the token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		
		// Validate token
		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			// Validate the signing algorithm
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			
			// Get JWT secret from environment or use default
			jwtSecret := []byte(os.Getenv("JWT_SECRET"))
			if len(jwtSecret) == 0 {
				jwtSecret = []byte("shabyt_secure_jwt_key_2025")
			}
			
			return jwtSecret, nil
		})
		
		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
			return
		}
		
		// Get user ID from claims
		userID, ok := claims["id"].(string)
		if !ok {
			http.Error(w, "Unauthorized: Invalid token claims", http.StatusUnauthorized)
			return
		}
		
		// Get user from database
		user, err := models.GetUserByID(r.Context(), userID)
		if err != nil {
			http.Error(w, "Unauthorized: User not found", http.StatusUnauthorized)
			return
		}
		
		// Add user to context
		ctx := context.WithValue(r.Context(), UserKey, user)
		
		// Call the next handler with the updated context
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

// StudentOrTeacherOnly is a middleware that checks if the user is a student or teacher
func StudentOrTeacherOnly(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, ok := r.Context().Value(UserKey).(*models.User)
		if !ok || (user.Role != "student" && user.Role != "teacher") {
			http.Error(w, "Unauthorized: Access denied", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	}
}

// TeacherOnly is a middleware that checks if the user is a teacher
func TeacherOnly(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, ok := r.Context().Value(UserKey).(*models.User)
		if !ok || user.Role != "teacher" {
			http.Error(w, "Unauthorized: Teachers only", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	}
}

// AdminOnly is a middleware that checks if the user is an admin
func AdminOnly(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, ok := r.Context().Value(UserKey).(*models.User)
		if !ok || user.Role != "admin" {
			http.Error(w, "Unauthorized: Admins only", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	}
}
