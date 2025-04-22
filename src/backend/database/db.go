package database

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

func InitDB() error {
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	dbname := os.Getenv("DB_NAME")
	sslMode := "disable"

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslMode)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("failed to open database connection: %w", err)
	}

	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(5)
	DB.SetConnMaxLifetime(5 * time.Minute)

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

	err = ensureTablesExist(ctx)
	if err != nil {
		return fmt.Errorf("failed to ensure tables exist: %w", err)
	}

	return nil
}

func ensureTablesExist(ctx context.Context) error {
	var exists bool
	err := DB.QueryRowContext(ctx, "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')").Scan(&exists)
	if err != nil {
		return fmt.Errorf("error checking if users table exists: %w", err)
	}

	if !exists {
		log.Println("Creating database tables...")

		schema, err := os.ReadFile("database/schema.sql")
		if err != nil {
			schema, err = os.ReadFile("./database/schema.sql")
			if err != nil {
				return fmt.Errorf("error reading schema.sql: %w", err)
			}
		}
		_, err = DB.ExecContext(ctx, string(schema))
		if err != nil {
			return fmt.Errorf("error executing schema.sql: %w", err)
		}

		log.Println("Database tables created successfully")
	}
	return nil
}

func QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	return DB.QueryContext(ctx, query, args...)
}

func QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row {
	return DB.QueryRowContext(ctx, query, args...)
}

func ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	return DB.ExecContext(ctx, query, args...)
}

func BeginTx(ctx context.Context) (*sql.Tx, error) {
	return DB.BeginTx(ctx, nil)
}

func LogRegistration(ctx context.Context, userID, email, ipAddress, userAgent, referrer string) error {
	_, err := ExecContext(ctx,
		"INSERT INTO registration_logs (user_id, email, ip_address, user_agent, referrer, registration_source) VALUES ($1, $2, $3, $4, $5, $6)",
		userID, email, ipAddress, userAgent, referrer, "web")

	if err != nil {
		log.Printf("Failed to log registration: %v", err)
		return nil
	}

	return nil
}

func LogLogin(ctx context.Context, userID, ipAddress, userAgent, status, failureReason string) error {
	_, err := ExecContext(ctx,
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
	_, err := ExecContext(ctx,
		"INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at) VALUES ($1, $2, $3, $4, $5)",
		userID, sessionToken, ipAddress, userAgent, expiresAt)

	if err != nil {
		return fmt.Errorf("failed to create user session: %w", err)
	}

	return nil
}

func UpdateUser(ctx context.Context, id, firstName, lastName, email, role string) (map[string]interface{}, error) {
	var user = make(map[string]interface{})
	var id_val, first_name, last_name, email_val, role_val string
	var created_at, updated_at time.Time

	err := QueryRowContext(ctx,
		"UPDATE users SET first_name = $1, last_name = $2, email = $3, role = $4, updated_at = NOW() WHERE id = $5 RETURNING id, first_name, last_name, email, role, created_at, updated_at",
		firstName, lastName, email, role, id).Scan(&id_val, &first_name, &last_name, &email_val, &role_val, &created_at, &updated_at)

	if err != nil {
		return nil, fmt.Errorf("error updating user: %w", err)
	}

	user["ID"] = id_val
	user["FirstName"] = first_name
	user["LastName"] = last_name
	user["Name"] = first_name + " " + last_name
	user["Email"] = email_val
	user["Role"] = role_val
	user["CreatedAt"] = created_at
	user["UpdatedAt"] = updated_at

	return user, nil
}

func SaveResetToken(ctx context.Context, id, resetToken string, resetTokenExpiry int64) error {
	_, err := ExecContext(ctx,
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

	err := QueryRowContext(ctx,
		"SELECT reset_token, reset_token_expiry FROM users WHERE id = $1",
		id).Scan(&storedToken, &expiry)

	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil
		}
		return false, fmt.Errorf("error verifying reset token: %w", err)
	}

	if storedToken == token && expiry > time.Now().Unix() {
		return true, nil
	}

	return false, nil
}

func ClearResetToken(ctx context.Context, id string) error {
	_, err := ExecContext(ctx,
		"UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = $1",
		id)

	if err != nil {
		return fmt.Errorf("error clearing reset token: %w", err)
	}

	return nil
}
