
package routes

import (
	"github.com/nnn20040/shabytdiplomwork/src/backend/controllers"
	"github.com/nnn20040/shabytdiplomwork/src/backend/middleware"

	"github.com/gorilla/mux"
)

func RegisterCourseRoutes(router *mux.Router) {
	courseRouter := router.PathPrefix("/courses").Subrouter()

	courseRouter.HandleFunc("/search", controllers.SearchCourses).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/featured", controllers.GetFeaturedCourses).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{id}/enroll", middleware.RequireAuth(controllers.EnrollCourse)).Methods("POST", "OPTIONS")
	courseRouter.HandleFunc("/{id}/analytics", controllers.GetCourseAnalytics).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/teacher/my-courses", middleware.RequireAuth(controllers.GetTeacherCourses)).Methods("GET", "OPTIONS")

	//course routes
	courseRouter.HandleFunc("", controllers.GetAllCourses).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("", middleware.RequireAuth(middleware.TeacherOnly(controllers.CreateCourse))).Methods("POST", "OPTIONS")
	courseRouter.HandleFunc("/{id}", controllers.GetCourseByID).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{id}", middleware.RequireAuth(controllers.UpdateCourse)).Methods("PUT", "OPTIONS")
	courseRouter.HandleFunc("/{id}", middleware.RequireAuth(controllers.DeleteCourse)).Methods("DELETE", "OPTIONS")

	//lesson routes
	courseRouter.HandleFunc("/{courseId}/lessons", controllers.GetLessons).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/lessons", middleware.RequireAuth(middleware.TeacherOnly(controllers.CreateLesson))).Methods("POST", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/lessons/{lessonId}", controllers.GetLesson).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/lessons/{lessonId}", middleware.RequireAuth(middleware.TeacherOnly(controllers.UpdateLesson))).Methods("PUT", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/lessons/{lessonId}", middleware.RequireAuth(middleware.TeacherOnly(controllers.DeleteLesson))).Methods("DELETE", "OPTIONS")

	//test routes
	courseRouter.HandleFunc("/{courseId}/tests", middleware.RequireAuth(middleware.TeacherOnly(controllers.CreateTest))).Methods("POST", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/tests/{testId}", controllers.GetTest).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/tests/{testId}", middleware.RequireAuth(middleware.TeacherOnly(controllers.UpdateTest))).Methods("PUT", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/tests/{testId}", middleware.RequireAuth(middleware.TeacherOnly(controllers.DeleteTest))).Methods("DELETE", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/tests/{testId}/submit", middleware.RequireAuth(controllers.SubmitTest)).Methods("POST", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/tests/{testId}/results", middleware.RequireAuth(controllers.GetTestResults)).Methods("GET", "OPTIONS")

	//discussion routes
	courseRouter.HandleFunc("/{courseId}/discussions", controllers.GetDiscussions).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/discussions", middleware.RequireAuth(controllers.CreateDiscussion)).Methods("POST", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/discussions/{discussionId}", controllers.GetDiscussion).Methods("GET", "OPTIONS")
	courseRouter.HandleFunc("/{courseId}/discussions/{discussionId}/replies", middleware.RequireAuth(controllers.ReplyToDiscussion)).Methods("POST", "OPTIONS")
}
