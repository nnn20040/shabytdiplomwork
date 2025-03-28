
package config

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// InitDB initializes the database connection
func InitDB() error {
	user := os.Getenv("DB_USER")
	if user == "" {
		user = "postgres"
	}
	
	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		password = "postgres"
	}
	
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}
	
	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "5432"
	}
	
	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "shabyt_db"
	}
	
	sslMode := "disable"
	if os.Getenv("DB_SSL") == "true" {
		sslMode = "require"
	}

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s", 
		host, port, user, password, dbname, sslMode)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("failed to open database connection: %w", err)
	}

	// Set connection pool settings
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(5)
	DB.SetConnMaxLifetime(5 * time.Minute)

	// Test the connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	
	if err := DB.PingContext(ctx); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	var now time.Time
	if err := DB.QueryRowContext(ctx, "SELECT NOW()").Scan(&now); err != nil {
		return fmt.Errorf("failed to query database: %w", err)
	}

	log.Printf("Database connected successfully at: %v", now)
	return nil
}

// QueryContext executes a query that returns rows
func QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	return DB.QueryContext(ctx, query, args...)
}

// QueryRowContext executes a query that returns a single row
func QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row {
	return DB.QueryRowContext(ctx, query, args...)
}

// ExecContext executes a query that doesn't return rows
func ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	return DB.ExecContext(ctx, query, args...)
}

// BeginTx starts a transaction
func BeginTx(ctx context.Context) (*sql.Tx, error) {
	return DB.BeginTx(ctx, nil)
}

// GetUserByID retrieves a user by ID
func GetUserByID(ctx context.Context, id string) (map[string]interface{}, error) {
	var user = make(map[string]interface{})
	var id_val, name, email, role string
	var created_at, updated_at time.Time
	
	err := QueryRowContext(ctx,
		"SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1",
		id).Scan(&id_val, &name, &email, &role, &created_at, &updated_at)
	
	if err != nil {
		return nil, fmt.Errorf("error getting user by ID: %w", err)
	}
	
	user["ID"] = id_val
	user["Name"] = name
	user["Email"] = email
	user["Role"] = role
	user["CreatedAt"] = created_at
	user["UpdatedAt"] = updated_at
	
	return user, nil
}

// GetUserByEmail retrieves a user by email
func GetUserByEmail(ctx context.Context, email string) (map[string]interface{}, error) {
	var user = make(map[string]interface{})
	var id, name, email_val, password, role string
	var created_at, updated_at time.Time
	var reset_token sql.NullString
	var reset_token_expiry sql.NullInt64
	
	err := QueryRowContext(ctx,
		"SELECT id, name, email, password, role, created_at, updated_at, reset_token, reset_token_expiry FROM users WHERE email = $1",
		email).Scan(&id, &name, &email_val, &password, &role, &created_at, &updated_at, &reset_token, &reset_token_expiry)
	
	if err != nil {
		return nil, fmt.Errorf("error getting user by email: %w", err)
	}
	
	user["ID"] = id
	user["Name"] = name
	user["Email"] = email_val
	user["Password"] = password
	user["Role"] = role
	user["CreatedAt"] = created_at
	user["UpdatedAt"] = updated_at
	
	if reset_token.Valid {
		user["ResetToken"] = reset_token.String
	}
	
	if reset_token_expiry.Valid {
		user["ResetTokenExpiry"] = reset_token_expiry.Int64
	}
	
	return user, nil
}

// CreateUser creates a new user in the database
func CreateUser(ctx context.Context, name, email, password, role string) (map[string]interface{}, error) {
	var user = make(map[string]interface{})
	var id, name_val, email_val, role_val string
	var created_at, updated_at time.Time
	
	// Check if user already exists
	var count int
	err := QueryRowContext(ctx, "SELECT COUNT(*) FROM users WHERE email = $1", email).Scan(&count)
	if err != nil {
		return nil, fmt.Errorf("error checking if user exists: %w", err)
	}

	if count > 0 {
		return nil, fmt.Errorf("user with this email already exists")
	}
	
	// Insert user into database
	err = QueryRowContext(ctx,
		"INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at",
		name, email, password, role).Scan(&id, &name_val, &email_val, &role_val, &created_at, &updated_at)
	
	if err != nil {
		return nil, fmt.Errorf("error creating user: %w", err)
	}
	
	user["ID"] = id
	user["Name"] = name_val
	user["Email"] = email_val
	user["Role"] = role_val
	user["CreatedAt"] = created_at
	user["UpdatedAt"] = updated_at
	
	return user, nil
}

// UpdateUser updates user information
func UpdateUser(ctx context.Context, id, name, email, role string) (map[string]interface{}, error) {
	var user = make(map[string]interface{})
	var id_val, name_val, email_val, role_val string
	var created_at, updated_at time.Time
	
	err := QueryRowContext(ctx,
		"UPDATE users SET name = $1, email = $2, role = $3, updated_at = NOW() WHERE id = $4 RETURNING id, name, email, role, created_at, updated_at",
		name, email, role, id).Scan(&id_val, &name_val, &email_val, &role_val, &created_at, &updated_at)
	
	if err != nil {
		return nil, fmt.Errorf("error updating user: %w", err)
	}
	
	user["ID"] = id_val
	user["Name"] = name_val
	user["Email"] = email_val
	user["Role"] = role_val
	user["CreatedAt"] = created_at
	user["UpdatedAt"] = updated_at
	
	return user, nil
}

// SaveResetToken saves a password reset token for a user
func SaveResetToken(ctx context.Context, id, resetToken string, resetTokenExpiry int64) error {
	_, err := ExecContext(ctx,
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
	
	err := QueryRowContext(ctx,
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
	_, err := ExecContext(ctx,
		"UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = $1",
		id)
		
	if err != nil {
		return fmt.Errorf("error clearing reset token: %w", err)
	}
	
	return nil
}
