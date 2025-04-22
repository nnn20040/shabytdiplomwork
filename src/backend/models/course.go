package models

import (
	"errors"
	"time"
)

var (
	ErrNotFound = errors.New("resource not found")
)

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

	InstructorName string `json:"instructor_name,omitempty"`
	Students       int    `json:"students,omitempty"`
	Lessons        int    `json:"lessons,omitempty"`
}

type CourseDetail struct {
	Course
	Content       string   `json:"content"`
	Outcomes      []string `json:"outcomes"`
	Prerequisites []string `json:"prerequisites"`
	Materials     []string `json:"materials"`
	Progress      int      `json:"progress,omitempty"`
}

type CreateCourseRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Image       string `json:"image"`
	Duration    string `json:"duration"`
	Featured    bool   `json:"featured"`
}

type UpdateCourseRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Image       string `json:"image"`
	Duration    string `json:"duration"`
	Featured    bool   `json:"featured"`
}
