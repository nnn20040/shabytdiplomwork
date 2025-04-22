package repository

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/nnn20040/shabytdiplomwork/src/backend/database"
)

func LogRegistration(ctx context.Context, userID, email, ipAddress, userAgent, referrer string) error {
	_, err := database.ExecContext(ctx,
		"INSERT INTO registration_logs (user_id, email, ip_address, user_agent, referrer, registration_source) VALUES ($1, $2, $3, $4, $5, $6)",
		userID, email, ipAddress, userAgent, referrer, "web")

	if err != nil {
		log.Printf("Failed to log registration: %v", err)
		return nil
	}

	return nil
}

func LogLogin(ctx context.Context, userID, ipAddress, userAgent, status, failureReason string) error {
	_, err := database.ExecContext(ctx,
		"INSERT INTO login_logs (user_id, ip_address, user_agent, status, failure_reason, login_source) VALUES ($1, $2, $3, $4, $5, $6)",
		userID, ipAddress, userAgent, status, failureReason, "web")

	if err != nil {
		log.Printf("Failed to log login: %v", err)
		// Continue even if logging fails
		return nil
	}

	return nil
}

func CreateUserSession(ctx context.Context, userID, sessionToken, ipAddress, userAgent string, expiresAt time.Time) error {
	_, err := database.ExecContext(ctx,
		"INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at) VALUES ($1, $2, $3, $4, $5)",
		userID, sessionToken, ipAddress, userAgent, expiresAt)

	if err != nil {
		return fmt.Errorf("failed to create user session: %w", err)
	}

	return nil
}

func SaveResetToken(ctx context.Context, id, resetToken string, resetTokenExpiry int64) error {
	_, err := database.ExecContext(ctx,
		"UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3",
		resetToken, resetTokenExpiry, id)

	if err != nil {
		return fmt.Errorf("error saving reset token: %w", err)
	}

	return nil
}

func VerifyResetToken(ctx context.Context, id, token string) (bool, error) {
	var storedToken string
	var expiry int64

	err := database.QueryRowContext(ctx,
		"SELECT reset_token, reset_token_expiry FROM users WHERE id = $1",
		id).Scan(&storedToken, &expiry)

	if err != nil {
		return false, fmt.Errorf("error verifying reset token: %w", err)
	}

	if storedToken == token && expiry > time.Now().Unix() {
		return true, nil
	}

	return false, nil
}

func ClearResetToken(ctx context.Context, id string) error {
	_, err := database.ExecContext(ctx,
		"UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = $1",
		id)

	if err != nil {
		return fmt.Errorf("error clearing reset token: %w", err)
	}

	return nil
}
