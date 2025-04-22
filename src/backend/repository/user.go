package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/nnn20040/shabytdiplomwork/src/backend/database"
	"github.com/nnn20040/shabytdiplomwork/src/backend/models"
)

func CreateUser(ctx context.Context, request models.RegisterRequest) (*models.User, error) {
	var user models.User

	nameParts := strings.Split(request.Name, " ")
	firstName := nameParts[0]
	lastName := ""
	if len(nameParts) > 1 {
		lastName = strings.Join(nameParts[1:], " ")
	}

	err := database.QueryRowContext(ctx,
		`INSERT INTO users (first_name, last_name, email, password, role, is_active, language_preference) VALUES ($1, $2, $3, $4, $5, $6, $7) 
		RETURNING id, created_at, updated_at`, firstName, lastName, request.Email, request.Password, request.Role, true, "ru").
		Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("error creating user: %w", err)
	}
	user.FirstName = firstName
	user.LastName = lastName
	user.Email = request.Email
	user.Name = request.Name
	user.Role = request.Role
	user.IsActive = true
	user.LanguagePreference = "ru"

	return &user, nil
}

func GetUserByID(ctx context.Context, id string) (*models.User, error) {
	var user models.User

	err := database.QueryRowContext(ctx,
		"SELECT id, first_name, last_name, email, role, created_at, updated_at FROM users WHERE id = $1", id).
		Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Role, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("error getting user by id: %w", err)
	}
	return &user, nil
}

func GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User

	err := database.QueryRowContext(ctx,
		"SELECT id, first_name, last_name, email, password, role, created_at, updated_at FROM users WHERE email = $1", email).
		Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Password, &user.Role, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("error getting user by email: %w", err)
	}

	return &user, nil
}

func UpdateUser(ctx context.Context, id, name, email, role string) error {
	nameParts := strings.Split(name, " ")
	firstName := nameParts[0]
	lastName := ""
	if len(nameParts) > 1 {
		lastName = strings.Join(nameParts[1:], " ")
	}

	_, err := database.ExecContext(ctx, "UPDATE users SET first_name = $1, last_name = $2, email = $3, role = $4, updated_at = NOW() WHERE id = $1",
		firstName, lastName, email, role, id)

	if err != nil {
		return fmt.Errorf("error updating user: %w", err)
	}

	return nil
}

func UpdatePassword(ctx context.Context, id, newPassword string) error {
	_, err := database.ExecContext(ctx,
		"UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2", newPassword, id)
	if err != nil {
		return fmt.Errorf("error updating password: %w", err)
	}
	return nil
}

func DeleteUser(ctx context.Context, id string) error {
	_, err := database.ExecContext(ctx, "DELETE FROM users WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("error deleting user: %w", err)
	}
	return nil
}
