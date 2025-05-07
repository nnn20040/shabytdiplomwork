
package routes

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func RegisterAuthRoutes(router *mux.Router) {
	authRouter := router.PathPrefix("/auth").Subrouter()

	// Demo mode: All auth endpoints return success with demo data
	authRouter.HandleFunc("/register", handleDemoRegister).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/login", handleDemoLogin).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/forgot-password", handleDemoSuccess).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/reset-password", handleDemoSuccess).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/me", handleDemoCurrentUser).Methods("GET", "OPTIONS")
	authRouter.HandleFunc("/profile", handleDemoSuccess).Methods("PUT", "OPTIONS")
	authRouter.HandleFunc("/change-password", handleDemoSuccess).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/logout", handleDemoLogout).Methods("POST", "OPTIONS")
}

func handleDemoRegister(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"message": "Регистрация прошла успешно",
			"user": map[string]interface{}{
				"id":    "demo-123",
				"name":  "Демо Пользователь",
				"email": "demo@example.com",
				"role":  getRequestedRole(r),
			},
			"data": "demo_token_for_presentation",
		},
	})
}

func handleDemoLogin(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"message": "Вход выполнен успешно",
			"user": map[string]interface{}{
				"id":    "demo-123",
				"name":  "Демо Пользователь",
				"email": "demo@example.com",
				"role":  getRequestedRole(r),
			},
			"data": "demo_token_for_presentation",
		},
	})
}

func handleDemoCurrentUser(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"user": map[string]interface{}{
				"id":    "demo-123",
				"name":  "Демо Пользователь",
				"email": "demo@example.com",
				"role":  getRequestedRole(r),
			},
		},
	})
}

func handleDemoLogout(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Logged out successfully",
	})
}

func handleDemoSuccess(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Operation completed successfully",
	})
}

func setCorsHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func getRequestedRole(r *http.Request) string {
	// Try to extract role from request body for login/register
	var requestData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err == nil {
		if role, ok := requestData["role"].(string); ok && role != "" {
			return role
		}
	}
	
	// Default role
	return "student"
}
