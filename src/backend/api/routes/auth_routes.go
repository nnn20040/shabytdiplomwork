
package routes

import (
	"net/http"

	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
)

// RegisterAuthRoutes registers authentication routes
func RegisterAuthRoutes(router *mux.Router) {
	// Auth routes
	authRouter := router.PathPrefix("/api/auth").Subrouter()

	// Для всех маршрутов добавим обработку OPTIONS для CORS preflight запросов
	// Public routes - добавляем обработку OPTIONS
	authRouter.HandleFunc("/register", addCorsHeaders(controllers.Register)).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/login", addCorsHeaders(controllers.Login)).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/forgot-password", addCorsHeaders(controllers.ForgotPassword)).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/reset-password", addCorsHeaders(controllers.ResetPassword)).Methods("POST", "OPTIONS")

	// Protected routes - добавляем обработку OPTIONS и через middleware Protect
	authRouter.Handle("/me", addCorsHeaders(middleware.Protect(http.HandlerFunc(controllers.GetCurrentUser)))).Methods("GET", "OPTIONS")
	authRouter.Handle("/profile", addCorsHeaders(middleware.Protect(http.HandlerFunc(controllers.UpdateProfile)))).Methods("PUT", "OPTIONS")
	authRouter.Handle("/change-password", addCorsHeaders(middleware.Protect(http.HandlerFunc(controllers.ChangePassword)))).Methods("PUT", "OPTIONS")
}

// addCorsHeaders является вспомогательной функцией для добавления CORS заголовков
func addCorsHeaders(h http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Обработка preflight запросов
		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept")
			w.WriteHeader(http.StatusOK)
			return
		}
		
		// Добавляем CORS заголовки для всех запросов
		w.Header().Set("Access-Control-Allow-Origin", "*")
		
		// Вызываем оригинальный обработчик
		h.ServeHTTP(w, r)
	}
}
