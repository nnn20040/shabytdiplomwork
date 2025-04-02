package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"backend/middleware"
	"backend/models"

	"github.com/gorilla/mux"
)

// CreateCourseRequest represents a request to create a new course
type CreateCourseRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Image       string `json:"image"`
	Duration    string `json:"duration"`
	Featured    bool   `json:"featured"`
}

// UpdateCourseRequest represents a request to update an existing course
type UpdateCourseRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Image       string `json:"image"`
	Duration    string `json:"duration"`
	Featured    bool   `json:"featured"`
}

// LessonRequest represents a request to create or update a lesson
type LessonRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Content     string `json:"content"`
	VideoURL    string `json:"video_url"`
	OrderIndex  int    `json:"order_index"`
}

// CreateCourse creates a new course
func CreateCourse(w http.ResponseWriter, r *http.Request) {
	// Get user from context (added by Protect middleware)
	user, ok := r.Context().Value(middleware.UserKey).(*models.User)
	if !ok {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Check if user is a teacher
	if user.Role != "teacher" && user.Role != "admin" {
		http.Error(w, "Only teachers can create courses", http.StatusForbidden)
		return
	}

	var req CreateCourseRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Title == "" || req.Description == "" || req.Category == "" {
		http.Error(w, "Please provide all required fields", http.StatusBadRequest)
		return
	}

	// Create course
	course, err := models.CreateCourse(r.Context(), req.Title, req.Description, user.ID, req.Category, req.Image, req.Duration, req.Featured)
	if err != nil {
		log.Printf("Create course error: %v", err)
		http.Error(w, "Server error during course creation", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Data:    course,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// GetAllCourses returns all courses with optional filters
func GetAllCourses(w http.ResponseWriter, r *http.Request) {
	// Parse query parameters
	category := r.URL.Query().Get("category")
	
	featuredStr := r.URL.Query().Get("featured")
	featured := false
	featuredSpecified := false
	if featuredStr != "" {
		featured = featuredStr == "true"
		featuredSpecified = true
	}
	
	teacherID := r.URL.Query().Get("teacher_id")

	// Get courses
	courses, err := models.GetAllCourses(r.Context(), category, teacherID, featured, featuredSpecified)
	if err != nil {
		log.Printf("Get all courses error: %v", err)
		http.Error(w, "Server error while retrieving courses", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Data: map[string]interface{}{
			"count":   len(courses),
			"courses": courses,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetCourseByID returns a course by ID
func GetCourseByID(w http.ResponseWriter, r *http.Request) {
	// Get course ID from URL
	vars := mux.Vars(r)
	id := vars["id"]

	// Get course
	course, err := models.GetCourseByID(r.Context(), id)
	if err != nil {
		if err == models.ErrNotFound {
			http.Error(w, "Course not found", http.StatusNotFound)
		} else {
			log.Printf("Get course by ID error: %v", err)
			http.Error(w, "Server error while retrieving course", http.StatusInternalServerError)
		}
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Data: map[string]interface{}{
			"course": course,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// UpdateCourse updates an existing course
func UpdateCourse(w http.ResponseWriter, r *http.Request) {
	// Get user from context (added by Protect middleware)
	user, ok := r.Context().Value(middleware.UserKey).(*models.User)
	if !ok {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Get course ID from URL
	vars := mux.Vars(r)
	id := vars["id"]

	// Get course
	course, err := models.GetCourseByID(r.Context(), id)
	if err != nil {
		if err == models.ErrNotFound {
			http.Error(w, "Course not found", http.StatusNotFound)
		} else {
			log.Printf("Get course by ID error: %v", err)
			http.Error(w, "Server error while retrieving course", http.StatusInternalServerError)
		}
		return
	}

	// Check if user is the teacher of this course or an admin
	if course.TeacherID != user.ID && user.Role != "admin" {
		http.Error(w, "Not authorized to update this course", http.StatusForbidden)
		return
	}

	var req UpdateCourseRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// If fields are empty, use existing values
	if req.Title == "" {
		req.Title = course.Title
	}
	if req.Description == "" {
		req.Description = course.Description
	}
	if req.Category == "" {
		req.Category = course.Category
	}
	if req.Image == "" {
		req.Image = course.Image
	}
	if req.Duration == "" {
		req.Duration = course.Duration
	}

	// Update course
	updatedCourse, err := models.UpdateCourse(r.Context(), id, req.Title, req.Description, req.Category, req.Image, req.Duration, req.Featured)
	if err != nil {
		log.Printf("Update course error: %v", err)
		http.Error(w, "Server error during course update", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Data: map[string]interface{}{
			"course": updatedCourse,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// DeleteCourse deletes a course
func DeleteCourse(w http.ResponseWriter, r *http.Request) {
	// Get user from context (added by Protect middleware)
	user, ok := r.Context().Value(middleware.UserKey).(*models.User)
	if !ok {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Get course ID from URL
	vars := mux.Vars(r)
	id := vars["id"]

	// Get course
	course, err := models.GetCourseByID(r.Context(), id)
	if err != nil {
		if err == models.ErrNotFound {
			http.Error(w, "Course not found", http.StatusNotFound)
		} else {
			log.Printf("Get course by ID error: %v", err)
			http.Error(w, "Server error while retrieving course", http.StatusInternalServerError)
		}
		return
	}

	// Check if user is the teacher of this course or an admin
	if course.TeacherID != user.ID && user.Role != "admin" {
		http.Error(w, "Not authorized to delete this course", http.StatusForbidden)
		return
	}

	// Delete course
	err = models.DeleteCourse(r.Context(), id)
	if err != nil {
		log.Printf("Delete course error: %v", err)
		http.Error(w, "Server error during course deletion", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Message: "Course deleted successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// SearchCourses searches for courses by term
func SearchCourses(w http.ResponseWriter, r *http.Request) {
	// Get search term from query
	term := r.URL.Query().Get("term")
	if term == "" {
		http.Error(w, "Search term is required", http.StatusBadRequest)
		return
	}

	// Search courses
	courses, err := models.SearchCourses(r.Context(), term)
	if err != nil {
		log.Printf("Search courses error: %v", err)
		http.Error(w, "Server error during course search", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Data: map[string]interface{}{
			"count":   len(courses),
			"courses": courses,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetTeacherCourses returns all courses taught by the authenticated teacher
func GetTeacherCourses(w http.ResponseWriter, r *http.Request) {
	// Get user from context (added by Protect middleware)
	user, ok := r.Context().Value(middleware.UserKey).(*models.User)
	if !ok {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Check if user is a teacher
	if user.Role != "teacher" && user.Role != "admin" {
		http.Error(w, "Only teachers can access their courses", http.StatusForbidden)
		return
	}

	// Get teacher's courses
	courses, err := models.GetCoursesByTeacher(r.Context(), user.ID)
	if err != nil {
		log.Printf("Get teacher courses error: %v", err)
		http.Error(w, "Server error while retrieving teacher courses", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Data: map[string]interface{}{
			"count":   len(courses),
			"courses": courses,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// CreateLesson creates a new lesson for a course
func CreateLesson(w http.ResponseWriter, r *http.Request) {
	// Get user from context (added by Protect middleware)
	user, ok := r.Context().Value(middleware.UserKey).(*models.User)
	if !ok {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Get course ID from URL
	vars := mux.Vars(r)
	courseId := vars["id"]

	// Get course to check ownership
	course, err := models.GetCourseByID(r.Context(), courseId)
	if err != nil {
		if err == models.ErrNotFound {
			http.Error(w, "Course not found", http.StatusNotFound)
		} else {
			log.Printf("Get course by ID error: %v", err)
			http.Error(w, "Server error while retrieving course", http.StatusInternalServerError)
		}
		return
	}

	// Check if user is the teacher of this course or an admin
	if course.TeacherID != user.ID && user.Role != "admin" {
		http.Error(w, "Not authorized to add lessons to this course", http.StatusForbidden)
		return
	}

	// Parse request body
	var req LessonRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Title == "" {
		http.Error(w, "Lesson title is required", http.StatusBadRequest)
		return
	}

	// Create lesson
	lesson, err := models.CreateLesson(r.Context(), courseId, req.Title, req.Description, req.Content, req.VideoURL, req.OrderIndex)
	if err != nil {
		log.Printf("Create lesson error: %v", err)
		http.Error(w, "Server error during lesson creation", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Data:    lesson,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// UpdateLesson updates an existing lesson
func UpdateLesson(w http.ResponseWriter, r *http.Request) {
	// Get user from context (added by Protect middleware)
	user, ok := r.Context().Value(middleware.UserKey).(*models.User)
	if !ok {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Get course ID and lesson ID from URL
	vars := mux.Vars(r)
	courseId := vars["id"]
	lessonId := vars["lessonId"]

	// Get course to check ownership
	course, err := models.GetCourseByID(r.Context(), courseId)
	if err != nil {
		if err == models.ErrNotFound {
			http.Error(w, "Course not found", http.StatusNotFound)
		} else {
			log.Printf("Get course by ID error: %v", err)
			http.Error(w, "Server error while retrieving course", http.StatusInternalServerError)
		}
		return
	}

	// Check if user is the teacher of this course or an admin
	if course.TeacherID != user.ID && user.Role != "admin" {
		http.Error(w, "Not authorized to update lessons for this course", http.StatusForbidden)
		return
	}

	// Parse request body
	var req LessonRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Title == "" {
		http.Error(w, "Lesson title is required", http.StatusBadRequest)
		return
	}

	// Update lesson
	lesson, err := models.UpdateLesson(r.Context(), courseId, lessonId, req.Title, req.Description, req.Content, req.VideoURL, req.OrderIndex)
	if err != nil {
		log.Printf("Update lesson error: %v", err)
		http.Error(w, "Server error during lesson update", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Data:    lesson,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// DeleteLesson deletes a lesson
func DeleteLesson(w http.ResponseWriter, r *http.Request) {
	// Get user from context (added by Protect middleware)
	user, ok := r.Context().Value(middleware.UserKey).(*models.User)
	if !ok {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Get course ID and lesson ID from URL
	vars := mux.Vars(r)
	courseId := vars["id"]
	lessonId := vars["lessonId"]

	// Get course to check ownership
	course, err := models.GetCourseByID(r.Context(), courseId)
	if err != nil {
		if err == models.ErrNotFound {
			http.Error(w, "Course not found", http.StatusNotFound)
		} else {
			log.Printf("Get course by ID error: %v", err)
			http.Error(w, "Server error while retrieving course", http.StatusInternalServerError)
		}
		return
	}

	// Check if user is the teacher of this course or an admin
	if course.TeacherID != user.ID && user.Role != "admin" {
		http.Error(w, "Not authorized to delete lessons for this course", http.StatusForbidden)
		return
	}

	// Delete lesson
	err = models.DeleteLesson(r.Context(), courseId, lessonId)
	if err != nil {
		log.Printf("Delete lesson error: %v", err)
		http.Error(w, "Server error during lesson deletion", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := Response{
		Success: true,
		Message: "Lesson deleted successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
