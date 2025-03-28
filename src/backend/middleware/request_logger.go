
package middleware

import (
	"log"
	"net/http"
	"time"
)

// RequestLogger is a middleware that logs HTTP requests
func RequestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Handle OPTIONS requests specially for CORS preflight
		if r.Method == "OPTIONS" {
			log.Printf("CORS Preflight request: %s %s", r.Method, r.URL.Path)
			next.ServeHTTP(w, r)
			return
		}
		
		start := time.Now()
		
		// Log the request initially with more details
		log.Printf("Request: %s %s from %s", r.Method, r.URL.Path, r.RemoteAddr)
		
		// Wrap the ResponseWriter to capture the status code
		wrappedWriter := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}
		
		// Call the next handler
		next.ServeHTTP(wrappedWriter, r)
		
		// Log the request completion with status code
		log.Printf(
			"Response: %s %s - Status: %d - Completed in %s",
			r.Method,
			r.URL.Path,
			wrappedWriter.statusCode,
			time.Since(start),
		)
	})
}

// responseWriter is a wrapper for http.ResponseWriter that captures the status code
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

// WriteHeader captures the status code before writing it
func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}
