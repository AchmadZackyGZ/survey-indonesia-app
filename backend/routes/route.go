package routes

import (
	"github.com/AchmadZackyGZ/survey-backend/controllers"
	"github.com/AchmadZackyGZ/survey-backend/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		// === AUTH ROUTES (Public) ===
		api.POST("/login", controllers.Login)

		// === PUBLIC ROUTES (GET - Semua orang bisa baca) ===
		api.GET("/surveys", controllers.GetAllSurveys)
		api.GET("/surveys/:slug", controllers.GetSurveyBySlug)
		api.GET("/publications", controllers.GetAllPublications)
		api.GET("/publications/:slug", controllers.GetPublicationBySlug)
		api.GET("/teams", controllers.GetAllTeamMembers)
		api.POST("/contact", controllers.CreateContactMessage) // User umum boleh kirim pesan

		// === PROTECTED ROUTES (Hanya Admin yang punya Token) ===
		// Kita pasang middleware di Group ini
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware()) 
		{
			// CRUD Survey (Create)
			protected.POST("/surveys", controllers.CreateSurvey)
			
			// CRUD Publication (Create)
			protected.POST("/publications", controllers.CreatePublication)

			// CRUD Team (Create)
			protected.POST("/teams", controllers.CreateTeamMember)
			
			// Inbox Admin (Read)
			protected.GET("/contact", controllers.GetAllMessages)
		}
	}
}