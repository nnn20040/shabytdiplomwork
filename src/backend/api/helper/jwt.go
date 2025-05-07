
package helper

import (
	"time"
)

// Modified to always return a valid demo token without requiring a secret
func GenerateJWT(userID string, role string) (string, error) {
	// Create a demo token that won't be verified by backend
	demoToken := "demo_jwt_token_for_presentation_" + role + "_" + userID + "_" + time.Now().String()
	return demoToken, nil
}
