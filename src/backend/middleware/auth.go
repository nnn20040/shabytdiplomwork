
package middleware

import (
	"context"
	"log"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/nnn20040/shabytdiplomwork/src/backend/models"
)

func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("DEMO MODE: Auth middleware bypassed")
		
		// Demo mode: Always consider authenticated with a demo user ID
		demoUserID := "demo-user-123"
		ctx := context.WithValue(r.Context(), models.UserContextKey, demoUserID)
		
		// For role-based checks, assume a role from URL path or set a default
		role := "student"
		if r.URL.Path != nil && (r.URL.Path == "/teacher-dashboard" || r.URL.Path == "/create-course") {
			role = "teacher"
		}
		
		ctx = context.WithValue(ctx, "role", role)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func StudentOrTeacherOnly(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("DEMO MODE: StudentOrTeacherOnly middleware bypassed")
		next.ServeHTTP(w, r)
	}
}

func TeacherOnly(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("DEMO MODE: TeacherOnly middleware bypassed")
		next.ServeHTTP(w, r)
	}
}

func AdminOnly(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("DEMO MODE: AdminOnly middleware bypassed")
		next.ServeHTTP(w, r)
	}
}
