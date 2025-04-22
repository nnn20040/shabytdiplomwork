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
