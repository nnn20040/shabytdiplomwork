package config

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"sync"
	"time"
)

// MockDB is a simple in-memory database for development and testing
type MockDB struct {
	users        map[string]*mockUser
	courses      map[string]*mockCourse
	lessons      map[string]*mockLesson
	tests        map[string]*mockTest
	enrollments  map[string]*mockEnrollment
	discussions  map[string]*mockDiscussion
	mutex        sync.RWMutex
	nextUserID   int
	nextCourseID int
	nextLessonID int
	nextTestID   int
}

// Mock data structures
type mockUser struct {
	ID               string
	Name             string
	Email            string
	Password         string
	Role             string
	CreatedAt        time.Time
	UpdatedAt        time.Time
	ResetToken       *string
	ResetTokenExpiry *int64
}

type mockCourse struct {
	ID          string
	Title       string
	Description string
	Category    string
	Image       string
	TeacherID   string
	Duration    string
	Featured    bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type mockLesson struct {
	ID          string
	CourseID    string
	Title       string
	Description string
	VideoURL    string
	Content     string
	OrderIndex  int
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type mockTest struct {
	ID           string
	CourseID     string
	LessonID     string
	Title        string
	Description  string
	TimeLimit    int
	PassingScore int
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type mockEnrollment struct {
	ID         string
	UserID     string
	CourseID   string
	Progress   int
	Status     string
	EnrolledAt time.Time
	UpdatedAt  time.Time
}

type mockDiscussion struct {
	ID        string
	CourseID  string
	Title     string
	Content   string
	AuthorID  string
	CreatedAt time.Time
	UpdatedAt time.Time
}

var mockDBInstance *MockDB
var mockDBOnce sync.Once

// InitMockDB initializes the mock database
func InitMockDB() {
	mockDBOnce.Do(func() {
		mockDBInstance = &MockDB{
			users:        make(map[string]*mockUser),
			courses:      make(map[string]*mockCourse),
			lessons:      make(map[string]*mockLesson),
			tests:        make(map[string]*mockTest),
			enrollments:  make(map[string]*mockEnrollment),
			discussions:  make(map[string]*mockDiscussion),
			nextUserID:   1,
			nextCourseID: 1,
			nextLessonID: 1,
			nextTestID:   1,
		}

		// Add sample users
		mockDBInstance.addSampleData()
		log.Println("Mock database initialized with sample data")
	})
}

// addSampleData adds sample data to the mock database
func (db *MockDB) addSampleData() {
	// Add sample users
	db.users["1"] = &mockUser{
		ID:        "1",
		Name:      "Әлібек Нұрғали",
		Email:     "alibek@shabyt.kz",
		Password:  "$2a$10$xVLXxKFZpX4FwKGFn1OhQ.n5AEiW1ETyuNBkpy7n99s4VJ3sO/b8i", // "password"
		Role:      "admin",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	db.users["2"] = &mockUser{
		ID:        "2",
		Name:      "Айгүл Қанатова",
		Email:     "aigul@shabyt.kz",
		Password:  "$2a$10$xVLXxKFZpX4FwKGFn1OhQ.n5AEiW1ETyuNBkpy7n99s4VJ3sO/b8i", // "password"
		Role:      "teacher",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	db.users["3"] = &mockUser{
		ID:        "3",
		Name:      "Нұрлан Серікұлы",
		Email:     "nurlan@shabyt.kz",
		Password:  "$2a$10$xVLXxKFZpX4FwKGFn1OhQ.n5AEiW1ETyuNBkpy7n99s4VJ3sO/b8i", // "password"
		Role:      "student",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	db.nextUserID = 4

	// Add sample courses, lessons, etc. as needed
}

// UseMockDB returns true if the mock database should be used
func UseMockDB() bool {
	return os.Getenv("USE_MOCK_DB") == "true"
}

// InitDB initializes either the real or mock database
func InitDB() error {
	if UseMockDB() {
		InitMockDB()
		log.Println("Using mock database")
		return nil
	}

	// Initialize the real database
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

// MockQuery simulates a database query and returns mock rows
func MockQuery(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	// This would need to parse the query and return appropriate mock data
	// For simplicity, just return a not implemented error
	return nil, errors.New("mock database query not implemented")
}

// MockQueryRow simulates a database query and returns a mock row
func MockQueryRow(ctx context.Context, query string, args ...interface{}) *sql.Row {
	// This is a placeholder. In a real implementation, you would parse the query
	// and return appropriate mock data
	return nil
}

// MockExec simulates a database execution
func MockExec(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	// This is a placeholder. In a real implementation, you would parse the query
	// and update the appropriate mock data
	return nil, errors.New("mock database exec not implemented")
}

// Overridden versions of the database functions that check for mock DB

// QueryContext executes a query that returns rows
func QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	if UseMockDB() {
		return MockQuery(ctx, query, args...)
	}
	return DB.QueryContext(ctx, query, args...)
}

// QueryRowContext executes a query that returns a single row
func QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row {
	if UseMockDB() {
		return MockQueryRow(ctx, query, args...)
	}
	return DB.QueryRowContext(ctx, query, args...)
}

// ExecContext executes a query that doesn't return rows
func ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	if UseMockDB() {
		return MockExec(ctx, query, args...)
	}
	return DB.ExecContext(ctx, query, args...)
}

// MockGetUserByID gets a user by ID from the mock database
func (db *MockDB) GetUserByID(id string) (*mockUser, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()
	
	user, exists := db.users[id]
	if !exists {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil
}

// MockGetUserByEmail gets a user by email from the mock database
func (db *MockDB) GetUserByEmail(email string) (*mockUser, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()
	
	for _, user := range db.users {
		if user.Email == email {
			return user, nil
		}
	}
	return nil, fmt.Errorf("user not found")
}

// MockCreateUser creates a new user in the mock database
func (db *MockDB) CreateUser(name, email, password, role string) (*mockUser, error) {
	db.mutex.Lock()
	defer db.mutex.Unlock()
	
	// Check if email already exists
	for _, user := range db.users {
		if user.Email == email {
			return nil, fmt.Errorf("user with this email already exists")
		}
	}
	
	id := fmt.Sprintf("%d", db.nextUserID)
	db.nextUserID++
	
	now := time.Now()
	user := &mockUser{
		ID:        id,
		Name:      name,
		Email:     email,
		Password:  password,
		Role:      role,
		CreatedAt: now,
		UpdatedAt: now,
	}
	
	db.users[id] = user
	return user, nil
}

// GetMockDB returns the mock database instance
func GetMockDB() *MockDB {
	if mockDBInstance == nil {
		InitMockDB()
	}
	return mockDBInstance
}
