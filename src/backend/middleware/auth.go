
package middleware

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/nnn20040/shabytdiplomwork/src/backend/models"
)

func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Running auth middleware")
		
		// Разрешаем CORS preflight запросы
		if r.Method == "OPTIONS" {
			next.ServeHTTP(w, r)
			return
		}
		
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			log.Println("Missing Authorization header")
			http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			log.Println("Invalid token format")
			http.Error(w, "Invalid token format", http.StatusUnauthorized)
			return
		}

		jwtSecret := os.Getenv("JWT_SECRET")
		if jwtSecret == "" {
			// Use a default secret for development
			jwtSecret = "shabyt_secure_jwt_key_2025"
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			log.Printf("Invalid token: %v", err)
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			userID, ok := claims["user_id"].(string)
			if !ok {
				log.Println("Invalid token claims - user_id missing or not string")
				http.Error(w, "Invalid token claims", http.StatusUnauthorized)
				return
			}

			log.Printf("User authenticated: %s", userID)
			ctx := context.WithValue(r.Context(), models.UserContextKey, userID)
			
			// Для ролевых проверок
			role, _ := claims["role"].(string)
			if role != "" {
				ctx = context.WithValue(ctx, "role", role)
			}
			
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			log.Println("Failed to extract claims from token")
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}
	}
}

func StudentOrTeacherOnly(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		role, ok := r.Context().Value("role").(string)
		if !ok || (role != "student" && role != "teacher" && role != "admin") {
			log.Println("Access denied - student or teacher role required")
			http.Error(w, "Access denied - student or teacher role required", http.StatusForbidden)
			return
		}
		log.Printf("Role check passed: %s", role)
		next.ServeHTTP(w, r)
	}
}

func TeacherOnly(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		role, ok := r.Context().Value("role").(string)
		if !ok || (role != "teacher" && role != "admin") {
			log.Println("Access denied - teacher role required")
			http.Error(w, "Access denied - teacher role required", http.StatusForbidden)
			return
		}
		log.Printf("Teacher role check passed: %s", role)
		next.ServeHTTP(w, r)
	}
}

func AdminOnly(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		role, ok := r.Context().Value("role").(string)
		if !ok || role != "admin" {
			log.Println("Access denied - admin role required")
			http.Error(w, "Access denied - admin role required", http.StatusForbidden)
			return
		}
		log.Printf("Admin role check passed: %s", role)
		next.ServeHTTP(w, r)
	}
}
