package repository

import (
	"context"

	"github.com/nnn20040/shabytdiplomwork/src/backend/database"
	"github.com/nnn20040/shabytdiplomwork/src/backend/models"
)

func CreateLesson(c context.Context, courseId string, request models.LessonRequest) (models.Lesson, error) {
	var lesson models.Lesson
	err := database.QueryRowContext(
		c,
		`INSERT INTO lessons (course_id, title, description, content, video_url, order_index, created_at, updated_at) 
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
		RETURNING id, course_id, title, description, content, video_url, order_index, created_at, updated_at`,
		courseId, request.Title, request.Description, request.Content, request.VideoURL, request.OrderIndex,
	).Scan(
		&lesson.ID, &lesson.CourseID, &lesson.Title, &lesson.Description,
		&lesson.Content, &lesson.VideoURL, &lesson.OrderIndex, &lesson.CreatedAt, &lesson.UpdatedAt,
	)

	if err != nil {
		return lesson, err
	}
	return lesson, nil
}

func IsLessonExist(c context.Context, courseId string, lessonId int) (int, error) {
	var count int
	err := database.QueryRowContext(
		c, "SELECT COUNT(*) FROM lessons WHERE course_id = $1 and id=$2",
		courseId, lessonId).Scan(&count)
	if err != nil {
		return count, err
	}
	return count, nil
}

func UpdateLesson(c context.Context, lessonId int, courseId string, req models.LessonRequest) (models.Lesson, error) {
	var lesson models.Lesson
	err := database.QueryRowContext(
		c,
		`UPDATE lessons 
		SET title = $1, description = $2, content = $3, video_url = $4, order_index = $5, updated_at = NOW() 
		WHERE id = $6 AND course_id = $7 
		RETURNING id, course_id, title, description, content, video_url, order_index, created_at, updated_at`,
		req.Title, req.Description, req.Content, req.VideoURL, req.OrderIndex, lessonId, courseId,
	).Scan(
		&lesson.ID, &lesson.CourseID, &lesson.Title, &lesson.Description,
		&lesson.Content, &lesson.VideoURL, &lesson.OrderIndex, &lesson.CreatedAt, &lesson.UpdatedAt,
	)

	if err != nil {
		return lesson, err
	}
	return lesson, nil
}

func DeleteLesson(c context.Context, courseId string, lessonId int) error {
	_, err := database.ExecContext(
		c,
		"DELETE FROM lessons WHERE id = $1 AND course_id = $2",
		lessonId, courseId,
	)

	if err != nil {
		return err
	}
	return nil
}

func GetLessonsByCourseId(c context.Context, courseId string) ([]models.Lesson, error) {
	rows, err := database.QueryContext(
		c,
		`SELECT id, course_id, title, description, content, video_url, order_index, created_at, updated_at 
		FROM lessons 
		WHERE course_id = $1 
		ORDER BY order_index ASC`,
		courseId,
	)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var lessons []models.Lesson
	for rows.Next() {
		var lesson models.Lesson
		err := rows.Scan(
			&lesson.ID, &lesson.CourseID, &lesson.Title, &lesson.Description,
			&lesson.Content, &lesson.VideoURL, &lesson.OrderIndex, &lesson.CreatedAt, &lesson.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		lessons = append(lessons, lesson)
	}
	return lessons, nil
}

func GetLesson(c context.Context, courseId string, lessonId int) (models.Lesson, error) {
	var lesson models.Lesson
	err := database.QueryRowContext(
		c,
		`SELECT id, course_id, title, description, content, video_url, order_index, created_at, updated_at 
		FROM lessons 
		WHERE id = $1 AND course_id = $2`,
		lessonId, courseId,
	).Scan(
		&lesson.ID, &lesson.CourseID, &lesson.Title, &lesson.Description,
		&lesson.Content, &lesson.VideoURL, &lesson.OrderIndex, &lesson.CreatedAt, &lesson.UpdatedAt,
	)

	if err != nil {
		return lesson, err
	}
	return lesson, nil
}
