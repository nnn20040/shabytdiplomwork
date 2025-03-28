
package middleware

import (
	"log"
	"net/http"
	"time"
)

// RequestLogger is a middleware that logs HTTP requests
func RequestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		
		// Log the request initially
		log.Printf("Received %s request to %s", r.Method, r.URL.Path)
		
		// Call the next handler
		next.ServeHTTP(w, r)
		
		// Log the request completion
		log.Printf(
			"Completed %s %s in %s",
			r.Method,
			r.RequestURI,
			time.Since(start),
		)
	})
}
