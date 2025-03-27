package models

import (
	"context"
	"log"

	"backend/config"

	"golang.org/x/crypto/bcrypt"
)

// User represents a user in the system
type User struct {
	ID                 string    `json:"id"`
	Name               string    `json:"name"`
	Email              string    `json:"email"`
	Password           string    `json:"-"`
	Role               string    `json:"role"`
	TwoFactorEnabled   bool      `json:"two_factor_enabled"`
	TwoFactorSetupCompleted bool `json:"two_factor_setup_completed"`
}

var db = config.GetDB()

// CreateUser creates a new user in the database
func CreateUser(ctx context.Context, name, email, password, role string) (*User, error) {
	// Check if user with this email already exists
	existingUser, _ := GetUserByEmail(ctx, email)
	if existingUser != nil {
		return nil, ErrUserAlreadyExists
	}

	// Hash password
	hashedPassword, err := HashPassword(password)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return nil, err
	}

	// Generate UUID
	userID, err := generateUUID()
	if err != nil {
		log.Printf("Error generating UUID: %v", err)
		return nil, err
	}

	// Insert user into database
	_, err = db.ExecContext(ctx, `
		INSERT INTO users (id, name, email, password, role, two_factor_enabled, two_factor_setup_completed)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`, userID, name, email, hashedPassword, role, false, false)
	if err != nil {
		log.Printf("Error inserting user: %v", err)
		return nil, err
	}

	// Return user
	user := &User{
		ID:    userID,
		Name:  name,
		Email: email,
		Role:  role,
		TwoFactorEnabled: false,
		TwoFactorSetupCompleted: false,
	}
	return user, nil
}

// GetUserByID gets a user from the database by ID
func GetUserByID(ctx context.Context, id string) (*User, error) {
	// Query database
	row := db.QueryRowContext(ctx, `
		SELECT id, name, email, password, role, two_factor_enabled, two_factor_setup_completed
		FROM users
		WHERE id = $1
	`, id)

	// Scan row into user
	user := &User{}
	err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Role, &user.TwoFactorEnabled, &user.TwoFactorSetupCompleted)
	if err != nil {
		log.Printf("Error scanning user: %v", err)
		return nil, err
	}

	return user, nil
}

// GetUserByEmail gets a user from the database by email
func GetUserByEmail(ctx context.Context, email string) (*User, error) {
	// Query database
	row := db.QueryRowContext(ctx, `
		SELECT id, name, email, password, role, two_factor_enabled, two_factor_setup_completed
		FROM users
		WHERE email = $1
	`, email)

	// Scan row into user
	user := &User{}
	err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Role, &user.TwoFactorEnabled, &user.TwoFactorSetupCompleted)
	if err != nil {
		// Log the error for debugging purposes
		log.Printf("Error scanning user: %v", err)
		return nil, err
	}

	return user, nil
}

// UpdateUser updates a user in the database
func UpdateUser(ctx context.Context, id, name, email, role string) (*User, error) {
	// Update user in database
	_, err := db.ExecContext(ctx, `
		UPDATE users
		SET name = $1, email = $2, role = $3
		WHERE id = $4
	`, name, email, role, id)
	if err != nil {
		log.Printf("Error updating user: %v", err)
		return nil, err
	}

	// Return updated user
	user := &User{
		ID:    id,
		Name:  name,
		Email: email,
		Role:  role,
	}
	return user, nil
}

// UpdatePassword updates a user's password in the database
func UpdatePassword(ctx context.Context, id, newPassword string) error {
	// Hash password
	hashedPassword, err := HashPassword(newPassword)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return err
	}

	// Update password in database
	_, err = db.ExecContext(ctx, `
		UPDATE users
		SET password = $1
		WHERE id = $2
	`, hashedPassword, id)
	if err != nil {
		log.Printf("Error updating password: %v", err)
		return err
	}

	return nil
}

// DeleteUser deletes a user from the database
func DeleteUser(ctx context.Context, id string) error {
	// Delete user from database
	_, err := db.ExecContext(ctx, `
		DELETE FROM users
		WHERE id = $1
	`, id)
	if err != nil {
		log.Printf("Error deleting user: %v", err)
		return err
	}

	return nil
}

// HashPassword hashes a password using bcrypt
func HashPassword(password string) (string, error) {
	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return "", err
	}

	return string(hashedPassword), nil
}

// ComparePassword compares a password with a hash
func ComparePassword(hash, password string) error {
	// Compare password
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		return err
	}

	return nil
}

// SaveResetToken saves a reset token to the database
func SaveResetToken(ctx context.Context, userID string, token string, expiry int64) error {
	// Delete any existing tokens for this user
	_, err := db.ExecContext(ctx, `
		DELETE FROM password_reset_tokens
		WHERE user_id = $1
	`, userID)
	if err != nil {
		log.Printf("Error deleting existing reset tokens: %v", err)
		return err
	}

	// Insert token into database
	_, err = db.ExecContext(ctx, `
		INSERT INTO password_reset_tokens (user_id, token, expiry)
		VALUES ($1, $2, $3)
	`, userID, token, expiry)
	if err != nil {
		log.Printf("Error inserting reset token: %v", err)
		return err
	}

	return nil
}

// VerifyResetToken verifies a reset token
func VerifyResetToken(ctx context.Context, userID string, token string) (bool, error) {
	// Query database
	var expiry int64
	err := db.QueryRowContext(ctx, `
		SELECT expiry
		FROM password_reset_tokens
		WHERE user_id = $1 AND token = $2
	`, userID, token).Scan(&expiry)
	if err != nil {
		log.Printf("Error querying reset token: %v", err)
		return false, err
	}

	// Check if token is expired
	if expiry < timeNow().Unix() {
		return false, nil
	}

	return true, nil
}

// ClearResetToken clears a reset token from the database
func ClearResetToken(ctx context.Context, userID string) error {
	// Delete token from database
	_, err := db.ExecContext(ctx, `
		DELETE FROM password_reset_tokens
		WHERE user_id = $1
	`, userID)
	if err != nil {
		log.Printf("Error deleting reset token: %v", err)
		return err
	}

	return nil
}

// Добавим метод обновления статуса 2FA
func UpdateTwoFactorStatus(ctx context.Context, userID string, enabled, setupCompleted bool) error {
    query := `
        UPDATE users 
        SET two_factor_enabled = $1, two_factor_setup_completed = $2 
        WHERE id = $3
    `
    _, err := db.ExecContext(ctx, query, enabled, setupCompleted, userID)
    return err
}
