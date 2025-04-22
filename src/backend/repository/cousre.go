package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/nnn20040/shabytdiplomwork/src/backend/database"
	"github.com/nnn20040/shabytdiplomwork/src/backend/models"
)

func CreateCourse(ctx context.Context, teacherID string, request models.CreateCourseRequest) (*models.Course, error) {
	var course models.Course
	err := database.QueryRowContext(ctx,
		`INSERT INTO courses (title, description, teacher_id, category, image, duration, featured) VALUES ($1, $2, $3, $4, $5, $6, $7) 
		RETURNING id, title, description, teacher_id, category, image, duration, featured, created_at, updated_at`,
		request.Title, request.Description, teacherID, request.Category, request.Image, request.Duration, request.Featured).Scan(
		&course.ID, &course.Title, &course.Description, &course.TeacherID, &course.Category,
		&course.Image, &course.Duration, &course.Featured, &course.CreatedAt, &course.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("error creating course: %w", err)
	}
	return &course, nil
}

func GetCourseByID(ctx context.Context, id string) (*models.Course, error) {
	var course models.Course
	err := database.QueryRowContext(ctx,
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
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("error getting course by ID: %w", err)
	}
	return &course, nil
}

func GetAllCourses(ctx context.Context, category, teacherID string, featured bool, featuredSpecified bool) ([]*models.Course, error) {
	query := `
		SELECT c.*, u.first_name AS instructor_name,
		(SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) AS students,
		(SELECT COUNT(*) FROM lessons WHERE course_id = c.id) AS lessons
		FROM courses c
		JOIN users u ON c.teacher_id = u.id
		WHERE 1=1`

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

	rows, err := database.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("error getting all courses: %w", err)
	}
	defer rows.Close()

	var courses []*models.Course
	for rows.Next() {
		var course models.Course
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

func UpdateCourse(ctx context.Context, id string, request models.UpdateCourseRequest) (*models.Course, error) {
	var course models.Course
	err := database.QueryRowContext(ctx,
		`UPDATE courses 
         SET title = $1, description = $2, category = $3, image = $4, duration = $5, featured = $6, updated_at = NOW()
         WHERE id = $7
         RETURNING id, title, description, teacher_id, category, image, duration, featured, created_at, updated_at`,
		request.Title, request.Description, request.Category, request.Image, request.Duration, request.Featured, id).Scan(
		&course.ID, &course.Title, &course.Description, &course.TeacherID, &course.Category,
		&course.Image, &course.Duration, &course.Featured, &course.CreatedAt, &course.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("error updating course: %w", err)
	}
	return &course, nil
}

func DeleteCourse(ctx context.Context, id string) error {
	tx, err := database.BeginTx(ctx)
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}
	defer tx.Rollback()

	_, err = tx.ExecContext(ctx, "DELETE FROM lessons WHERE course_id = $1", id)
	if err != nil {
		return fmt.Errorf("error deleting course lessons: %w", err)
	}

	_, err = tx.ExecContext(ctx, "DELETE FROM courses WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("error deleting course: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	return nil
}

func GetCourseCount(c context.Context, courseId string) (int, error) {
	var count int
	err := database.QueryRowContext(c, "SELECT COUNT(*) FROM courses WHERE id = $1", courseId).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func GetCoursesByTeacher(ctx context.Context, teacherID string) ([]*models.Course, error) {
	rows, err := database.QueryContext(ctx,
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

	var courses []*models.Course
	for rows.Next() {
		var course models.Course
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

func SearchCourses(ctx context.Context, term string) ([]*models.Course, error) {
	searchTerm := "%" + term + "%"
	rows, err := database.QueryContext(ctx,
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

	var courses []*models.Course
	for rows.Next() {
		var course models.Course
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
