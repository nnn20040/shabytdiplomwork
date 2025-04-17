
package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"backend/config"
	"backend/middleware"

	"github.com/gorilla/mux"
)

// Response представляет общую структуру ответа API
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

// LessonRequest представляет запрос на создание или обновление урока
type LessonRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Content     string `json:"content"`
	VideoURL    string `json:"video_url"`
	OrderIndex  int    `json:"order_index"`
}

// Lesson представляет структуру урока
type Lesson struct {
	ID          int       `json:"id"`
	CourseID    int       `json:"course_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Content     string    `json:"content"`
	VideoURL    string    `json:"video_url"`
	OrderIndex  int       `json:"order_index"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateLesson создает новый урок
func CreateLesson(w http.ResponseWriter, r *http.Request) {
	// Получаем ID курса из URL
	params := mux.Vars(r)
	courseID := params["courseId"]

	// Получаем пользователя из контекста (добавленного middleware.Protect)
	user, ok := r.Context().Value(middleware.UserKey).(map[string]interface{})
	if !ok {
		http.Error(w, "Пользователь не найден", http.StatusUnauthorized)
		return
	}

	// Проверяем, что пользователь - преподаватель
	role, ok := user["Role"].(string)
	if !ok || (role != "teacher" && role != "admin") {
		http.Error(w, "Только преподаватели могут создавать уроки", http.StatusForbidden)
		return
	}

	// Декодируем тело запроса
	var req LessonRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Неверный формат данных", http.StatusBadRequest)
		return
	}

	// Проверяем обязательные поля
	if req.Title == "" {
		http.Error(w, "Название урока обязательно", http.StatusBadRequest)
		return
	}

	// Преобразуем courseID в int
	courseIDInt, err := strconv.Atoi(courseID)
	if err != nil {
		http.Error(w, "Неверный ID курса", http.StatusBadRequest)
		return
	}

	// Проверяем существование курса
	ctx := r.Context()
	var count int
	err = config.DB.QueryRowContext(
		ctx,
		"SELECT COUNT(*) FROM courses WHERE id = $1",
		courseIDInt,
	).Scan(&count)

	if err != nil {
		log.Printf("Ошибка при проверке существования курса: %v", err)
		http.Error(w, "Ошибка сервера при создании урока", http.StatusInternalServerError)
		return
	}

	if count == 0 {
		http.Error(w, "Курс не найден", http.StatusNotFound)
		return
	}

	// Создаем урок в базе данных
	var lesson Lesson
	err = config.DB.QueryRowContext(
		ctx,
		`INSERT INTO lessons (course_id, title, description, content, video_url, order_index, created_at, updated_at) 
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
		RETURNING id, course_id, title, description, content, video_url, order_index, created_at, updated_at`,
		courseIDInt, req.Title, req.Description, req.Content, req.VideoURL, req.OrderIndex,
	).Scan(
		&lesson.ID, &lesson.CourseID, &lesson.Title, &lesson.Description, 
		&lesson.Content, &lesson.VideoURL, &lesson.OrderIndex, &lesson.CreatedAt, &lesson.UpdatedAt,
	)

	if err != nil {
		log.Printf("Ошибка при создании урока: %v", err)
		http.Error(w, "Ошибка сервера при создании урока", http.StatusInternalServerError)
		return
	}

	// Возвращаем успешный ответ
	response := Response{
		Success: true,
		Message: "Урок успешно создан",
		Data:    lesson,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// UpdateLesson обновляет существующий урок
func UpdateLesson(w http.ResponseWriter, r *http.Request) {
	// Получаем ID курса и урока из URL
	params := mux.Vars(r)
	courseID := params["courseId"]
	lessonID := params["lessonId"]

	// Получаем пользователя из контекста
	user, ok := r.Context().Value(middleware.UserKey).(map[string]interface{})
	if !ok {
		http.Error(w, "Пользователь не найден", http.StatusUnauthorized)
		return
	}

	// Проверяем, что пользователь - преподаватель
	role, ok := user["Role"].(string)
	if !ok || (role != "teacher" && role != "admin") {
		http.Error(w, "Только преподаватели могут обновлять уроки", http.StatusForbidden)
		return
	}

	// Декодируем тело запроса
	var req LessonRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Неверный формат данных", http.StatusBadRequest)
		return
	}

	// Преобразуем ID в int
	courseIDInt, err := strconv.Atoi(courseID)
	if err != nil {
		http.Error(w, "Неверный ID курса", http.StatusBadRequest)
		return
	}

	lessonIDInt, err := strconv.Atoi(lessonID)
	if err != nil {
		http.Error(w, "Неверный ID урока", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	// Проверяем, что урок существует и принадлежит этому курсу
	var count int
	err = config.DB.QueryRowContext(
		ctx,
		"SELECT COUNT(*) FROM lessons WHERE id = $1 AND course_id = $2",
		lessonIDInt, courseIDInt,
	).Scan(&count)

	if err != nil {
		log.Printf("Ошибка при проверке существования урока: %v", err)
		http.Error(w, "Ошибка сервера при обновлении урока", http.StatusInternalServerError)
		return
	}

	if count == 0 {
		http.Error(w, "Урок не найден или не принадлежит указанному курсу", http.StatusNotFound)
		return
	}

	// Обновляем урок
	var lesson Lesson
	err = config.DB.QueryRowContext(
		ctx,
		`UPDATE lessons 
		SET title = $1, description = $2, content = $3, video_url = $4, order_index = $5, updated_at = NOW() 
		WHERE id = $6 AND course_id = $7 
		RETURNING id, course_id, title, description, content, video_url, order_index, created_at, updated_at`,
		req.Title, req.Description, req.Content, req.VideoURL, req.OrderIndex, lessonIDInt, courseIDInt,
	).Scan(
		&lesson.ID, &lesson.CourseID, &lesson.Title, &lesson.Description, 
		&lesson.Content, &lesson.VideoURL, &lesson.OrderIndex, &lesson.CreatedAt, &lesson.UpdatedAt,
	)

	if err != nil {
		log.Printf("Ошибка при обновлении урока: %v", err)
		http.Error(w, "Ошибка сервера при обновлении урока", http.StatusInternalServerError)
		return
	}

	// Возвращаем успешный ответ
	response := Response{
		Success: true,
		Message: "Урок успешно обновлен",
		Data:    lesson,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// DeleteLesson удаляет урок
func DeleteLesson(w http.ResponseWriter, r *http.Request) {
	// Получаем ID курса и урока из URL
	params := mux.Vars(r)
	courseID := params["courseId"]
	lessonID := params["lessonId"]

	// Получаем пользователя из контекста
	user, ok := r.Context().Value(middleware.UserKey).(map[string]interface{})
	if !ok {
		http.Error(w, "Пользователь не найден", http.StatusUnauthorized)
		return
	}

	// Проверяем, что пользователь - преподаватель
	role, ok := user["Role"].(string)
	if !ok || (role != "teacher" && role != "admin") {
		http.Error(w, "Только преподаватели могут удалять уроки", http.StatusForbidden)
		return
	}

	// Преобразуем ID в int
	courseIDInt, err := strconv.Atoi(courseID)
	if err != nil {
		http.Error(w, "Неверный ID курса", http.StatusBadRequest)
		return
	}

	lessonIDInt, err := strconv.Atoi(lessonID)
	if err != nil {
		http.Error(w, "Неверный ID урока", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	// Проверяем, что урок существует и принадлежит этому курсу
	var count int
	err = config.DB.QueryRowContext(
		ctx,
		"SELECT COUNT(*) FROM lessons WHERE id = $1 AND course_id = $2",
		lessonIDInt, courseIDInt,
	).Scan(&count)

	if err != nil {
		log.Printf("Ошибка при проверке существования урока: %v", err)
		http.Error(w, "Ошибка сервера при удалении урока", http.StatusInternalServerError)
		return
	}

	if count == 0 {
		http.Error(w, "Урок не найден или не принадлежит указанному курсу", http.StatusNotFound)
		return
	}

	// Удаляем урок
	_, err = config.DB.ExecContext(
		ctx,
		"DELETE FROM lessons WHERE id = $1 AND course_id = $2",
		lessonIDInt, courseIDInt,
	)

	if err != nil {
		log.Printf("Ошибка при удалении урока: %v", err)
		http.Error(w, "Ошибка сервера при удалении урока", http.StatusInternalServerError)
		return
	}

	// Возвращаем успешный ответ
	response := Response{
		Success: true,
		Message: "Урок успешно удален",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetLessons получает все уроки курса
func GetLessons(w http.ResponseWriter, r *http.Request) {
	// Получаем ID курса из URL
	params := mux.Vars(r)
	courseID := params["courseId"]

	// Преобразуем courseID в int
	courseIDInt, err := strconv.Atoi(courseID)
	if err != nil {
		http.Error(w, "Неверный ID курса", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	// Проверяем существование курса
	var count int
	err = config.DB.QueryRowContext(
		ctx,
		"SELECT COUNT(*) FROM courses WHERE id = $1",
		courseIDInt,
	).Scan(&count)

	if err != nil {
		log.Printf("Ошибка при проверке существования курса: %v", err)
		http.Error(w, "Ошибка сервера при получении уроков", http.StatusInternalServerError)
		return
	}

	if count == 0 {
		http.Error(w, "Курс не найден", http.StatusNotFound)
		return
	}

	// Получаем уроки из базы данных
	rows, err := config.DB.QueryContext(
		ctx,
		`SELECT id, course_id, title, description, content, video_url, order_index, created_at, updated_at 
		FROM lessons 
		WHERE course_id = $1 
		ORDER BY order_index ASC`,
		courseIDInt,
	)

	if err != nil {
		log.Printf("Ошибка при получении уроков: %v", err)
		http.Error(w, "Ошибка сервера при получении уроков", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Собираем уроки в массив
	var lessons []Lesson
	for rows.Next() {
		var lesson Lesson
		err := rows.Scan(
			&lesson.ID, &lesson.CourseID, &lesson.Title, &lesson.Description, 
			&lesson.Content, &lesson.VideoURL, &lesson.OrderIndex, &lesson.CreatedAt, &lesson.UpdatedAt,
		)
		if err != nil {
			log.Printf("Ошибка при сканировании урока: %v", err)
			http.Error(w, "Ошибка сервера при получении уроков", http.StatusInternalServerError)
			return
		}
		lessons = append(lessons, lesson)
	}

	// Проверяем ошибки после цикла
	if err = rows.Err(); err != nil {
		log.Printf("Ошибка при итерации по урокам: %v", err)
		http.Error(w, "Ошибка сервера при получении уроков", http.StatusInternalServerError)
		return
	}

	// Возвращаем успешный ответ
	response := Response{
		Success: true,
		Data:    lessons,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetLesson получает конкретный урок
func GetLesson(w http.ResponseWriter, r *http.Request) {
	// Получаем ID курса и урока из URL
	params := mux.Vars(r)
	courseID := params["courseId"]
	lessonID := params["lessonId"]

	// Преобразуем ID в int
	courseIDInt, err := strconv.Atoi(courseID)
	if err != nil {
		http.Error(w, "Неверный ID курса", http.StatusBadRequest)
		return
	}

	lessonIDInt, err := strconv.Atoi(lessonID)
	if err != nil {
		http.Error(w, "Неверный ID урока", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	// Получаем урок из базы данных
	var lesson Lesson
	err = config.DB.QueryRowContext(
		ctx,
		`SELECT id, course_id, title, description, content, video_url, order_index, created_at, updated_at 
		FROM lessons 
		WHERE id = $1 AND course_id = $2`,
		lessonIDInt, courseIDInt,
	).Scan(
		&lesson.ID, &lesson.CourseID, &lesson.Title, &lesson.Description, 
		&lesson.Content, &lesson.VideoURL, &lesson.OrderIndex, &lesson.CreatedAt, &lesson.UpdatedAt,
	)

	if err != nil {
		log.Printf("Ошибка при получении урока: %v", err)
		http.Error(w, "Урок не найден", http.StatusNotFound)
		return
	}

	// Возвращаем успешный ответ
	response := Response{
		Success: true,
		Data:    lesson,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
