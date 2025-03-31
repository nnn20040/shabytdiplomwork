
package models

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"
	"strings"

	"backend/config"

	"golang.org/x/crypto/bcrypt"
)

// User represents a user in the system
type User struct {
	ID               string    `json:"id"`
	Email            string    `json:"email"`
	Password         string    `json:"-"` // "-" means this field will be omitted from JSON output
	FirstName        string    `json:"first_name"`
	LastName         string    `json:"last_name"`
	Name             string    `json:"name"` // Derived from FirstName and LastName
	Role             string    `json:"role"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
	LastLogin        *time.Time `json:"last_login,omitempty"`
	ProfileImageURL  *string   `json:"profile_image_url,omitempty"`
	IsActive         bool      `json:"is_active"`
	LanguagePreference string  `json:"language_preference"`
	ResetToken       *string   `json:"-"`
	ResetTokenExpiry *int64    `json:"-"`
}

// CreateUser creates a new user in the database
func CreateUser(ctx context.Context, name, email, password, role string) (*User, error) {
	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("error hashing password: %w", err)
	}

	// Set default role if not provided
	if role == "" {
		role = "student"
	}

	// Split name into first name and last name
	nameParts := strings.Split(name, " ")
	firstName := nameParts[0]
	lastName := ""
	if len(nameParts) > 1 {
		lastName = strings.Join(nameParts[1:], " ")
	}

	// Create user in the database
	userData, err := config.CreateUser(ctx, firstName, lastName, email, string(hashedPassword), role)
	if err != nil {
		return nil, err
	}

	user := &User{
		ID:        userData["ID"].(string),
		Email:     userData["Email"].(string),
		FirstName: userData["FirstName"].(string),
		LastName:  userData["LastName"].(string),
		Name:      userData["Name"].(string),
		Role:      userData["Role"].(string),
		CreatedAt: userData["CreatedAt"].(time.Time),
		UpdatedAt: userData["UpdatedAt"].(time.Time),
		IsActive:  true,
		LanguagePreference: "ru",
	}

	return user, nil
}

// GetUserByID retrieves a user by ID
func GetUserByID(ctx context.Context, id string) (*User, error) {
	userData, err := config.GetUserByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}

	user := &User{
		ID:        userData["ID"].(string),
		Email:     userData["Email"].(string),
		FirstName: userData["FirstName"].(string),
		LastName:  userData["LastName"].(string),
		Name:      userData["Name"].(string),
		Role:      userData["Role"].(string),
		CreatedAt: userData["CreatedAt"].(time.Time),
		UpdatedAt: userData["UpdatedAt"].(time.Time),
	}

	return user, nil
}

// GetUserByEmail retrieves a user by email
func GetUserByEmail(ctx context.Context, email string) (*User, error) {
	log.Printf("Retrieving user by email: %s", email)
	userData, err := config.GetUserByEmail(ctx, email)
	if err != nil {
		log.Printf("Error getting user by email %s: %v", email, err)
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}

	log.Printf("User found in database: %s (%s)", userData["Email"], userData["ID"])
	
	user := &User{
		ID:        userData["ID"].(string),
		Email:     userData["Email"].(string),
		FirstName: userData["FirstName"].(string),
		LastName:  userData["LastName"].(string),
		Name:      userData["Name"].(string),
		Password:  userData["Password"].(string),
		Role:      userData["Role"].(string),
		CreatedAt: userData["CreatedAt"].(time.Time),
		UpdatedAt: userData["UpdatedAt"].(time.Time),
	}

	if resetToken, ok := userData["ResetToken"]; ok {
		token := resetToken.(string)
		user.ResetToken = &token
	}

	if resetTokenExpiry, ok := userData["ResetTokenExpiry"]; ok {
		expiry := resetTokenExpiry.(int64)
		user.ResetTokenExpiry = &expiry
	}

	return user, nil
}

// UpdateUser updates user information
func UpdateUser(ctx context.Context, id, name, email, role string) (*User, error) {
	// Split name into first name and last name
	nameParts := strings.Split(name, " ")
	firstName := nameParts[0]
	lastName := ""
	if len(nameParts) > 1 {
		lastName = strings.Join(nameParts[1:], " ")
	}

	userData, err := config.UpdateUser(ctx, id, firstName, lastName, email, role)
	if err != nil {
		return nil, err
	}

	user := &User{
		ID:        userData["ID"].(string),
		Email:     userData["Email"].(string),
		FirstName: userData["FirstName"].(string),
		LastName:  userData["LastName"].(string),
		Name:      userData["Name"].(string),
		Role:      userData["Role"].(string),
		CreatedAt: userData["CreatedAt"].(time.Time),
		UpdatedAt: userData["UpdatedAt"].(time.Time),
	}

	return user, nil
}

// UpdatePassword updates a user's password
func UpdatePassword(ctx context.Context, id, newPassword string) error {
	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("error hashing password: %w", err)
	}

	_, err = config.ExecContext(ctx,
		"UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2",
		string(hashedPassword), id)
	if err != nil {
		return fmt.Errorf("error updating password: %w", err)
	}
	return nil
}

// DeleteUser deletes a user
func DeleteUser(ctx context.Context, id string) error {
	_, err := config.ExecContext(ctx, "DELETE FROM users WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("error deleting user: %w", err)
	}
	return nil
}

// ComparePassword compares a provided password with the user's hashed password
func ComparePassword(hashedPassword, providedPassword string) error {
	if hashedPassword == "" {
		log.Printf("Password comparison error: Stored password hash is empty")
		return fmt.Errorf("invalid password hash")
	}
	
	log.Printf("Comparing password: Hash length=%d, Provided password length=%d", len(hashedPassword), len(providedPassword))
	
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(providedPassword))
	if err != nil {
		log.Printf("Password comparison failed: %v", err)
		return err
	}
	
	log.Printf("Password comparison successful")
	return nil
}

// SaveResetToken saves a password reset token for a user
func SaveResetToken(ctx context.Context, id, resetToken string, resetTokenExpiry int64) error {
	return config.SaveResetToken(ctx, id, resetToken, resetTokenExpiry)
}

// VerifyResetToken verifies a password reset token
func VerifyResetToken(ctx context.Context, id, token string) (bool, error) {
	return config.VerifyResetToken(ctx, id, token)
}

// ClearResetToken clears a user's password reset token
func ClearResetToken(ctx context.Context, id string) error {
	return config.ClearResetToken(ctx, id)
}

