package controllers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/nnn20040/shabytdiplomwork/src/backend/models"
	"github.com/nnn20040/shabytdiplomwork/src/backend/repository"

	"github.com/gorilla/mux"
)

func CreateCourse(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(models.UserContextKey).(string)

	user, err := repository.GetUserByID(r.Context(), userID)
	if err != nil {
		http.Error(w, "user doesnt exists", http.StatusInternalServerError)
		return
	}

	if user.Role != "teacher" && user.Role != "admin" {
		http.Error(w, "Only teachers can create courses", http.StatusForbidden)
		return
	}

	var req models.CreateCourseRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	if req.Title == "" || req.Description == "" || req.Category == "" {
		http.Error(w, "Please provide all required fields", http.StatusBadRequest)
		return
	}

	course, err := repository.CreateCourse(r.Context(), user.ID, req)
	if err != nil {
		log.Printf("Create course error: %v", err)
		http.Error(w, "Server error during course creation", http.StatusInternalServerError)
		return
	}

	response := models.Response{
		Success: true,
		Data:    course,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func GetAllCourses(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")

	featuredStr := r.URL.Query().Get("featured")
	featured := false
	featuredSpecified := false
	if featuredStr != "" {
		featured = featuredStr == "true"
		featuredSpecified = true
	}

	teacherID := r.URL.Query().Get("teacher_id")

	courses, err := repository.GetAllCourses(r.Context(), category, teacherID, featured, featuredSpecified)
	if err != nil {
		log.Printf("Get all courses error: %v", err)
		http.Error(w, "Server error while retrieving courses", http.StatusInternalServerError)
		return
	}

	response := models.Response{
		Success: true,
		Data: map[string]interface{}{
			"count":   len(courses),
			"courses": courses,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetCourseByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	course, err := repository.GetCourseByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, models.ErrNotFound) {
			http.Error(w, "Course not found", http.StatusNotFound)
		} else {
			log.Printf("Get course by ID error: %v", err)
			http.Error(w, "Server error while retrieving course", http.StatusInternalServerError)
		}
		return
	}

	response := models.Response{
		Success: true,
		Data: map[string]interface{}{
			"course": course,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func UpdateCourse(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(models.UserContextKey).(string)

	user, err := repository.GetUserByID(r.Context(), userID)
	if err != nil {
		http.Error(w, "user doesnt exists", http.StatusInternalServerError)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]

	course, err := repository.GetCourseByID(r.Context(), id)
	if err != nil {
		if err == models.ErrNotFound {
			http.Error(w, "Course not found", http.StatusNotFound)
		} else {
			log.Printf("Get course by ID error: %v", err)
			http.Error(w, "Server error while retrieving course", http.StatusInternalServerError)
		}
		return
	}

	if course.TeacherID != user.ID && user.Role != "admin" {
		http.Error(w, "Not authorized to update this course", http.StatusForbidden)
		return
	}

	var req models.UpdateCourseRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

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

	updatedCourse, err := repository.UpdateCourse(r.Context(), id, req)
	if err != nil {
		log.Printf("Update course error: %v", err)
		http.Error(w, "Server error during course update", http.StatusInternalServerError)
		return
	}

	response := models.Response{
		Success: true,
		Data: map[string]interface{}{
			"course": updatedCourse,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func DeleteCourse(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(models.UserContextKey).(string)

	user, err := repository.GetUserByID(r.Context(), userID)
	if err != nil {
		http.Error(w, "user doesnt exists", http.StatusInternalServerError)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]

	course, err := repository.GetCourseByID(r.Context(), id)
	if err != nil {
		if err == models.ErrNotFound {
			http.Error(w, "Course not found", http.StatusNotFound)
		} else {
			log.Printf("Get course by ID error: %v", err)
			http.Error(w, "Server error while retrieving course", http.StatusInternalServerError)
		}
		return
	}

	if course.TeacherID != user.ID && user.Role != "admin" {
		http.Error(w, "Not authorized to delete this course", http.StatusForbidden)
		return
	}

	err = repository.DeleteCourse(r.Context(), id)
	if err != nil {
		log.Printf("Delete course error: %v", err)
		http.Error(w, "Server error during course deletion", http.StatusInternalServerError)
		return
	}

	response := models.Response{
		Success: true,
		Message: "Course deleted successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func SearchCourses(w http.ResponseWriter, r *http.Request) {
	term := r.URL.Query().Get("term")
	if term == "" {
		http.Error(w, "Search term is required", http.StatusBadRequest)
		return
	}

	courses, err := repository.SearchCourses(r.Context(), term)
	if err != nil {
		log.Printf("Search courses error: %v", err)
		http.Error(w, "Server error during course search", http.StatusInternalServerError)
		return
	}

	response := models.Response{
		Success: true,
		Data: map[string]interface{}{
			"count":   len(courses),
			"courses": courses,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetTeacherCourses(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(models.UserContextKey).(string)

	user, err := repository.GetUserByID(r.Context(), userID)
	if err != nil {
		http.Error(w, "user doesnt exists", http.StatusInternalServerError)
		return
	}

	if user.Role != "teacher" && user.Role != "admin" {
		http.Error(w, "Only teachers can access their courses", http.StatusForbidden)
		return
	}

	courses, err := repository.GetCoursesByTeacher(r.Context(), user.ID)
	if err != nil {
		log.Printf("Get teacher courses error: %v", err)
		http.Error(w, "Server error while retrieving teacher courses", http.StatusInternalServerError)
		return
	}

	response := models.Response{
		Success: true,
		Data: map[string]interface{}{
			"count":   len(courses),
			"courses": courses,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
