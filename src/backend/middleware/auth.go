
package middleware

import (
	"context"
	"database/sql"
	"errors"
	"log"
	"net/http"
	"os"
	"strings"

	"backend/models"

	"github.com/dgrijalva/jwt-go"
)

// UserCtxKey is the key used to store the user in the request context
type UserCtxKey string

const UserKey UserCtxKey = "user"

// JWTSecret is the secret key used to sign JWT tokens
var JWTSecret = []byte(os.Getenv("JWT_SECRET"))

// EnsureJWTSecret ensures that a JWT secret is set
func init() {
	if len(JWTSecret) == 0 {
		JWTSecret = []byte("shabyt_secure_jwt_key_2025")
	}
}

// Protect is middleware that verifies JWT tokens and adds the user to the request context
func Protect(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get token from Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Not authorized, no token", http.StatusUnauthorized)
			return
		}

		// Check if the Authorization header has the Bearer prefix
		if !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Invalid token format", http.StatusUnauthorized)
			return
		}

		// Extract the token
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		// Parse and validate the token
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			// Validate the signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return JWTSecret, nil
		})

		if err != nil {
			log.Printf("Error parsing token: %v", err)
			http.Error(w, "Not authorized, token failed", http.StatusUnauthorized)
			return
		}

		// Check if the token is valid
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			userID, ok := claims["id"].(string)
			if !ok {
				http.Error(w, "Invalid token claims", http.StatusUnauthorized)
				return
			}

			// Get user from database
			user, err := models.GetUserByID(r.Context(), userID)
			if err != nil {
				if err == sql.ErrNoRows {
					http.Error(w, "User not found", http.StatusUnauthorized)
				} else {
					log.Printf("Error getting user: %v", err)
					http.Error(w, "Server error", http.StatusInternalServerError)
				}
				return
			}

			// Add user to request context
			ctx := context.WithValue(r.Context(), UserKey, user)
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			http.Error(w, "Not authorized, invalid token", http.StatusUnauthorized)
		}
	})
}

// AdminOnly restricts access to admin users
func AdminOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user, ok := r.Context().Value(UserKey).(*models.User)
		if !ok || user.Role != "admin" {
			http.Error(w, "Not authorized as an admin", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// TeacherOnly restricts access to teacher and admin users
func TeacherOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user, ok := r.Context().Value(UserKey).(*models.User)
		if !ok || (user.Role != "teacher" && user.Role != "admin") {
			http.Error(w, "Not authorized as a teacher", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// RequestLogger logs incoming requests
func RequestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}
