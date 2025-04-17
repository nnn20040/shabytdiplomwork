
package middleware

import (
	"net/http"
	"strings"
)

var allowedOrigins = []string{
	"http://localhost:8080",
	"http://localhost:5173",
	"http://127.0.0.1:8080",
	"http://127.0.0.1:5173",
}

// CORSMiddleware adds CORS headers to every response
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		
		// Check if the origin is allowed
		allowedOrigin := "*"
		for _, allowed := range allowedOrigins {
			if allowed == origin {
				allowedOrigin = origin
				break
			}
		}
		
		// Set CORS headers for all requests
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		
		// Handle OPTIONS requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		
		next.ServeHTTP(w, r)
	})
}
