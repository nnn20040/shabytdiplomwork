
package models

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"backend/config"

	"golang.org/x/crypto/bcrypt"
)

// User represents a user in the system
type User struct {
	ID               string    `json:"id"`
	Name             string    `json:"name"`
	Email            string    `json:"email"`
	Password         string    `json:"-"` // "-" means this field will be omitted from JSON output
	Role             string    `json:"role"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
	ResetToken       *string   `json:"-"`
	ResetTokenExpiry *int64    `json:"-"`
}

// CreateUser creates a new user in the database
func CreateUser(ctx context.Context, name, email, password, role string) (*User, error) {
	// Check if user already exists
	var count int
	err := config.QueryRowContext(ctx, "SELECT COUNT(*) FROM users WHERE email = $1", email).Scan(&count)
	if err != nil {
		return nil, fmt.Errorf("error checking if user exists: %w", err)
	}

	if count > 0 {
		return nil, errors.New("user with this email already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("error hashing password: %w", err)
	}

	// Set default role if not provided
	if role == "" {
		role = "student"
	}

	// Insert user into database
	var user User
	err = config.QueryRowContext(ctx,
		"INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at",
		name, email, string(hashedPassword), role).Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("error creating user: %w", err)
	}

	return &user, nil
}

// GetUserByID retrieves a user by ID
func GetUserByID(ctx context.Context, id string) (*User, error) {
	var user User
	err := config.QueryRowContext(ctx,
		"SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1",
		id).Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, fmt.Errorf("error getting user by ID: %w", err)
	}
	return &user, nil
}

// GetUserByEmail retrieves a user by email
func GetUserByEmail(ctx context.Context, email string) (*User, error) {
	var user User
	err := config.QueryRowContext(ctx,
		"SELECT id, name, email, password, role, created_at, updated_at, reset_token, reset_token_expiry FROM users WHERE email = $1",
		email).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Role, &user.CreatedAt, &user.UpdatedAt, &user.ResetToken, &user.ResetTokenExpiry)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, fmt.Errorf("error getting user by email: %w", err)
	}
	return &user, nil
}

// UpdateUser updates user information
func UpdateUser(ctx context.Context, id, name, email, role string) (*User, error) {
	var user User
	err := config.QueryRowContext(ctx,
		"UPDATE users SET name = $1, email = $2, role = $3, updated_at = NOW() WHERE id = $4 RETURNING id, name, email, role, created_at, updated_at",
		name, email, role, id).Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("error updating user: %w", err)
	}
	return &user, nil
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
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(providedPassword))
}

// SaveResetToken saves a password reset token for a user
func SaveResetToken(ctx context.Context, id, resetToken string, resetTokenExpiry int64) error {
	_, err := config.ExecContext(ctx,
		"UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3",
		resetToken, resetTokenExpiry, id)
	if err != nil {
		return fmt.Errorf("error saving reset token: %w", err)
	}
	return nil
}

// VerifyResetToken verifies a password reset token
func VerifyResetToken(ctx context.Context, id, token string) (bool, error) {
	var storedToken string
	var expiry int64
	err := config.QueryRowContext(ctx,
		"SELECT reset_token, reset_token_expiry FROM users WHERE id = $1",
		id).Scan(&storedToken, &expiry)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil
		}
		return false, fmt.Errorf("error verifying reset token: %w", err)
	}

	// Check if token matches and has not expired
	if storedToken == token && expiry > time.Now().Unix() {
		return true, nil
	}
	return false, nil
}

// ClearResetToken clears a user's password reset token
func ClearResetToken(ctx context.Context, id string) error {
	_, err := config.ExecContext(ctx,
		"UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = $1",
		id)
	if err != nil {
		return fmt.Errorf("error clearing reset token: %w", err)
	}
	return nil
}
