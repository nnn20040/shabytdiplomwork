package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/nnn20040/shabytdiplomwork/src/backend/models"
	"github.com/nnn20040/shabytdiplomwork/src/backend/repository"

	"github.com/gorilla/mux"
)

func CreateLesson(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]

	userID := r.Context().Value(models.UserContextKey).(string)

	user, err := repository.GetUserByID(r.Context(), userID)
	if err != nil {
		http.Error(w, "user doesnt exists", http.StatusInternalServerError)
		return
	}

	if user.Role != "teacher" && user.Role != "admin" {
		http.Error(w, "Только преподаватели могут создавать уроки", http.StatusForbidden)
		return
	}

	var req models.LessonRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Неверный формат данных", http.StatusBadRequest)
		return
	}

	if req.Title == "" {
		http.Error(w, "Название урока обязательно", http.StatusBadRequest)
		return
	}

	count, err := repository.GetCourseCount(r.Context(), courseID)
	if err != nil {
		log.Printf("Ошибка при проверке существования курса: %v", err)
		http.Error(w, "Ошибка сервера при создании урока", http.StatusInternalServerError)
		return
	}

	if count == 0 {
		http.Error(w, "Курс не найден", http.StatusNotFound)
		return
	}

	lesson, err := repository.CreateLesson(r.Context(), courseID, req)
	if err != nil {
		log.Printf("Ошибка при создании урока: %v", err)
		http.Error(w, "Ошибка сервера при создании урока", http.StatusInternalServerError)
		return
	}

	response := models.LessonResponse{
		Success: true,
		Message: "Урок успешно создан",
		Data:    lesson,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func UpdateLesson(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]
	lessonID := params["lessonId"]

	userID := r.Context().Value(models.UserContextKey).(string)

	user, err := repository.GetUserByID(r.Context(), userID)
	if err != nil {
		http.Error(w, "user doesnt exists", http.StatusInternalServerError)
		return
	}

	if user.Role != "teacher" && user.Role != "admin" {
		http.Error(w, "Только преподаватели могут создавать уроки", http.StatusForbidden)
		return
	}

	var req models.LessonRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Неверный формат данных", http.StatusBadRequest)
		return
	}

	lessonIDInt, err := strconv.Atoi(lessonID)
	if err != nil {
		http.Error(w, "Неверный ID урока", http.StatusBadRequest)
		return
	}

	count, err := repository.IsLessonExist(r.Context(), courseID, lessonIDInt)
	if err != nil {
		log.Printf("Ошибка при проверке существования урока: %v", err)
		http.Error(w, "Ошибка сервера при обновлении урока", http.StatusInternalServerError)
		return
	}

	if count == 0 {
		http.Error(w, "Урок не найден или не принадлежит указанному курсу", http.StatusNotFound)
		return
	}

	lesson, err := repository.UpdateLesson(r.Context(), lessonIDInt, courseID, req)
	if err != nil {
		log.Printf("Ошибка при обновлении урока: %v", err)
		http.Error(w, "Ошибка сервера при обновлении урока", http.StatusInternalServerError)
		return
	}

	response := models.LessonResponse{
		Success: true,
		Message: "Урок успешно обновлен",
		Data:    lesson,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func DeleteLesson(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]
	lessonID := params["lessonId"]

	userID := r.Context().Value(models.UserContextKey).(string)

	user, err := repository.GetUserByID(r.Context(), userID)
	if err != nil {
		http.Error(w, "user doesnt exists", http.StatusInternalServerError)
		return
	}

	if user.Role != "teacher" && user.Role != "admin" {
		http.Error(w, "Только преподаватели могут создавать уроки", http.StatusForbidden)
		return
	}

	lessonIDInt, err := strconv.Atoi(lessonID)
	if err != nil {
		http.Error(w, "Неверный ID урока", http.StatusBadRequest)
		return
	}

	count, err := repository.IsLessonExist(r.Context(), courseID, lessonIDInt)
	if err != nil {
		log.Printf("Ошибка при проверке существования урока: %v", err)
		http.Error(w, "Ошибка сервера при удалении урока", http.StatusInternalServerError)
		return
	}
	if count == 0 {
		http.Error(w, "Урок не найден или не принадлежит указанному курсу", http.StatusNotFound)
		return
	}

	err = repository.DeleteLesson(r.Context(), courseID, lessonIDInt)
	if err != nil {
		log.Printf("Ошибка при удалении урока: %v", err)
		http.Error(w, "Ошибка сервера при удалении урока", http.StatusInternalServerError)
		return
	}

	response := models.LessonResponse{
		Success: true,
		Message: "Урок успешно удален",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetLessons(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]

	count, err := repository.GetCourseCount(r.Context(), courseID)
	if err != nil {
		log.Printf("Ошибка при проверке существования курса: %v", err)
		http.Error(w, "Ошибка сервера при получении уроков", http.StatusInternalServerError)
		return
	}

	if count == 0 {
		http.Error(w, "Курс не найден", http.StatusNotFound)
		return
	}

	lessons, err := repository.GetLessonsByCourseId(r.Context(), courseID)
	if err != nil {
		log.Printf("Ошибка получения уроков: %v", err)
		http.Error(w, "Ошибка сервера при получении уроков", http.StatusInternalServerError)
		return
	}

	response := models.LessonResponse{
		Success: true,
		Data:    lessons,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetLesson(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID := params["courseId"]
	lessonID := params["lessonId"]

	lessonIDInt, err := strconv.Atoi(lessonID)
	if err != nil {
		http.Error(w, "Неверный ID урока", http.StatusBadRequest)
		return
	}

	lesson, err := repository.GetLesson(r.Context(), courseID, lessonIDInt)
	if err != nil {
		log.Printf("Ошибка при получении урока: %v", err)
		http.Error(w, "Урок не найден", http.StatusNotFound)
		return
	}

	response := models.LessonResponse{
		Success: true,
		Data:    lesson,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
