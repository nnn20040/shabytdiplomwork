
package middleware

import (
	"log"
	"net/http"
	"strings"
)

var allowedOrigins = []string{
	"http://localhost:8080",
	"http://localhost:5173",
	"http://127.0.0.1:8080",
	"http://127.0.0.1:5173",
	"http://localhost:3000",
	"http://127.0.0.1:3000",
}

// CORSMiddleware adds CORS headers to every response
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		log.Printf("Received request from origin: %s, method: %s, path: %s", origin, r.Method, r.URL.Path)
		
		// Check if the origin is allowed
		allowedOrigin := ""
		for _, allowed := range allowedOrigins {
			if allowed == origin || strings.TrimSpace(origin) == "" {
				allowedOrigin = origin
				break
			}
		}
		
		// If origin is allowed or empty, set headers
		if allowedOrigin != "" || strings.TrimSpace(origin) == "" {
			log.Printf("Setting CORS headers for origin: %s", allowedOrigin)
			
			// If no origin is specified, allow all for development
			if strings.TrimSpace(origin) == "" {
				w.Header().Set("Access-Control-Allow-Origin", "*")
			} else {
				w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
			}
			
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Max-Age", "86400") // 24 hours
		} else {
			log.Printf("Origin not allowed: %s", origin)
		}
		
		// Handle OPTIONS requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		
		next.ServeHTTP(w, r)
	})
}
