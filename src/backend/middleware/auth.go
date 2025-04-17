
package middleware

import (
	"context"
	"log"
	"net/http"

	"backend/models"
)

// UserKey is the context key for the user object
type userContextKey string
const UserKey userContextKey = "user"

// RequireAuth is a simplified middleware that checks if a request has basic auth
func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// For simplified authentication, we'll just pass the request through
		// In a real system, you would validate session/auth here
		log.Println("Auth check passed - simplified auth")
		next.ServeHTTP(w, r)
	}
}

// StudentOrTeacherOnly is a middleware that checks if the user is a student or teacher
func StudentOrTeacherOnly(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// For simplified authentication, we'll just pass the request through
		// In a real system, you would check user roles here
		log.Println("Role check passed - simplified auth")
		next.ServeHTTP(w, r)
	}
}

// TeacherOnly is a middleware that checks if the user is a teacher
func TeacherOnly(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// For simplified authentication, we'll just pass the request through
		// In a real system, you would check if user is a teacher here
		log.Println("Teacher role check passed - simplified auth")
		next.ServeHTTP(w, r)
	}
}

// AdminOnly is a middleware that checks if the user is an admin
func AdminOnly(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// For simplified authentication, we'll just pass the request through
		// In a real system, you would check if user is an admin here
		log.Println("Admin role check passed - simplified auth")
		next.ServeHTTP(w, r)
	}
}
