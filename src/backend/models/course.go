
package models

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"backend/config"
)

// Course represents a course in the system
type Course struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	Image       string    `json:"image"`
	TeacherID   string    `json:"teacher_id"`
	Duration    string    `json:"duration"`
	Featured    bool      `json:"featured"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	
	// Joined fields
	InstructorName string `json:"instructor_name,omitempty"`
	Students       int    `json:"students,omitempty"`
	Lessons        int    `json:"lessons,omitempty"`
}

// CourseDetail represents a course with additional details
type CourseDetail struct {
	Course
	Content       string   `json:"content"`
	Outcomes      []string `json:"outcomes"`
	Prerequisites []string `json:"prerequisites"`
	Materials     []string `json:"materials"`
	Progress      int      `json:"progress,omitempty"`
}

// CreateCourse creates a new course in the database
func CreateCourse(ctx context.Context, title, description, teacherID, category, image, duration string, featured bool) (*Course, error) {
	var course Course
	err := config.QueryRowContext(ctx,
		"INSERT INTO courses (title, description, teacher_id, category, image, duration, featured) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, description, teacher_id, category, image, duration, featured, created_at, updated_at",
		title, description, teacherID, category, image, duration, featured).Scan(
		&course.ID, &course.Title, &course.Description, &course.TeacherID, &course.Category,
		&course.Image, &course.Duration, &course.Featured, &course.CreatedAt, &course.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("error creating course: %w", err)
	}
	return &course, nil
}

// GetCourseByID retrieves a course by ID
func GetCourseByID(ctx context.Context, id string) (*Course, error) {
	var course Course
	err := config.QueryRowContext(ctx,
		`SELECT c.*, u.name AS instructor_name
         FROM courses c
         JOIN users u ON c.teacher_id = u.id
         WHERE c.id = $1`,
		id).Scan(
		&course.ID, &course.Title, &course.Description, &course.TeacherID, &course.Category,
		&course.Image, &course.Duration, &course.Featured, &course.CreatedAt, &course.UpdatedAt,
		&course.InstructorName)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, fmt.Errorf("error getting course by ID: %w", err)
	}
	return &course, nil
}

// GetAllCourses retrieves all courses with optional filters
func GetAllCourses(ctx context.Context, category, teacherID string, featured bool, featuredSpecified bool) ([]*Course, error) {
	query := `
		SELECT c.*, u.name AS instructor_name,
		(SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) AS students,
		(SELECT COUNT(*) FROM lessons WHERE course_id = c.id) AS lessons
		FROM courses c
		JOIN users u ON c.teacher_id = u.id
		WHERE 1=1
	`

	args := []interface{}{}
	argPos := 1

	if category != "" {
		query += fmt.Sprintf(" AND c.category = $%d", argPos)
		args = append(args, category)
		argPos++
	}

	if featuredSpecified {
		query += fmt.Sprintf(" AND c.featured = $%d", argPos)
		args = append(args, featured)
		argPos++
	}

	if teacherID != "" {
		query += fmt.Sprintf(" AND c.teacher_id = $%d", argPos)
		args = append(args, teacherID)
		argPos++
	}

	query += " ORDER BY c.created_at DESC"

	rows, err := config.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("error getting all courses: %w", err)
	}
	defer rows.Close()

	var courses []*Course
	for rows.Next() {
		var course Course
		err := rows.Scan(
			&course.ID, &course.Title, &course.Description, &course.TeacherID, &course.Category,
			&course.Image, &course.Duration, &course.Featured, &course.CreatedAt, &course.UpdatedAt,
			&course.InstructorName, &course.Students, &course.Lessons)
		if err != nil {
			return nil, fmt.Errorf("error scanning course row: %w", err)
		}
		courses = append(courses, &course)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating course rows: %w", err)
	}

	return courses, nil
}

// UpdateCourse updates course information
func UpdateCourse(ctx context.Context, id, title, description, category, image, duration string, featured bool) (*Course, error) {
	var course Course
	err := config.QueryRowContext(ctx,
		`UPDATE courses 
         SET title = $1, description = $2, category = $3, image = $4, duration = $5, featured = $6, updated_at = NOW()
         WHERE id = $7
         RETURNING id, title, description, teacher_id, category, image, duration, featured, created_at, updated_at`,
		title, description, category, image, duration, featured, id).Scan(
		&course.ID, &course.Title, &course.Description, &course.TeacherID, &course.Category,
		&course.Image, &course.Duration, &course.Featured, &course.CreatedAt, &course.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("error updating course: %w", err)
	}
	return &course, nil
}

// DeleteCourse deletes a course and its related resources
func DeleteCourse(ctx context.Context, id string) error {
	// Start transaction
	tx, err := config.BeginTx(ctx)
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}
	defer tx.Rollback()

	// Delete related lessons
	_, err = tx.ExecContext(ctx, "DELETE FROM lessons WHERE course_id = $1", id)
	if err != nil {
		return fmt.Errorf("error deleting course lessons: %w", err)
	}

	// Delete course
	_, err = tx.ExecContext(ctx, "DELETE FROM courses WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("error deleting course: %w", err)
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	return nil
}

// GetCoursesByTeacher retrieves courses taught by a specific teacher
func GetCoursesByTeacher(ctx context.Context, teacherID string) ([]*Course, error) {
	rows, err := config.QueryContext(ctx,
		`SELECT c.*, 
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) AS students,
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) AS lessons
        FROM courses c
        WHERE c.teacher_id = $1
        ORDER BY c.created_at DESC`,
		teacherID)
	if err != nil {
		return nil, fmt.Errorf("error getting courses by teacher: %w", err)
	}
	defer rows.Close()

	var courses []*Course
	for rows.Next() {
		var course Course
		err := rows.Scan(
			&course.ID, &course.Title, &course.Description, &course.TeacherID, &course.Category,
			&course.Image, &course.Duration, &course.Featured, &course.CreatedAt, &course.UpdatedAt,
			&course.Students, &course.Lessons)
		if err != nil {
			return nil, fmt.Errorf("error scanning course row: %w", err)
		}
		courses = append(courses, &course)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating course rows: %w", err)
	}

	return courses, nil
}

// SearchCourses searches for courses by term
func SearchCourses(ctx context.Context, term string) ([]*Course, error) {
	searchTerm := "%" + term + "%"
	rows, err := config.QueryContext(ctx,
		`SELECT c.*, u.name AS instructor_name,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) AS students,
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) AS lessons
        FROM courses c
        JOIN users u ON c.teacher_id = u.id
        WHERE 
          c.title ILIKE $1 OR
          c.description ILIKE $1 OR
          c.category ILIKE $1 OR
          u.name ILIKE $1
        ORDER BY c.created_at DESC`,
		searchTerm)
	if err != nil {
		return nil, fmt.Errorf("error searching courses: %w", err)
	}
	defer rows.Close()

	var courses []*Course
	for rows.Next() {
		var course Course
		err := rows.Scan(
			&course.ID, &course.Title, &course.Description, &course.TeacherID, &course.Category,
			&course.Image, &course.Duration, &course.Featured, &course.CreatedAt, &course.UpdatedAt,
			&course.InstructorName, &course.Students, &course.Lessons)
		if err != nil {
			return nil, fmt.Errorf("error scanning course row: %w", err)
		}
		courses = append(courses, &course)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating course rows: %w", err)
	}

	return courses, nil
}
