
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
		dbname = "ent_prep_db"
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
