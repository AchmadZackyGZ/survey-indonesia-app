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
		api.POST("/contacts", controllers.CreateContact)

		// --- TEAMS PUBLIC ---
		api.GET("/teams", controllers.GetAllTeamMembers)      // List di halaman Tentang Kami
		api.GET("/teams/:id", controllers.GetTeamMemberById)  // 🔥 BARU: Untuk halaman Detail Ahli
		

		// === PROTECTED ROUTES (Hanya Admin yang punya Token) ===
		// Kita pasang middleware di Group ini
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware()) 
		{
			// Dashboard Stats
			protected.GET("/dashboard/stats", controllers.GetDashboardStats)

			// CRUD Survey (Create)
			protected.POST("/surveys", controllers.CreateSurvey)
			
			// CRUD Publication (Create)
			protected.POST("/publications", controllers.CreatePublication)
			
			// delete surveys
			protected.DELETE("/surveys/:id", controllers.DeleteSurvey)

			protected.GET("/surveys/id/:id", controllers.GetSurveyById) // Ambil 1 data by ID

    		protected.PUT("/surveys/:id", controllers.UpdateSurvey)  // Update data

			// delete publications
			protected.DELETE("/publications/:id", controllers.DeletePublication)
			
			protected.GET("/publications/id/:id", controllers.GetPublicationById) // Khusus Admin ambil by ID
			
			protected.PUT("/publications/:id", controllers.UpdatePublication)     // Update

			// 🔥 INI DIA: ADMIN INBOX (HARUS DI SINI) 🔥
			// Agar hanya admin yang login yang bisa baca & hapus pesan
			protected.GET("/contacts", controllers.GetAllContacts)       // Baca Inbox
			protected.DELETE("/contacts/:id", controllers.DeleteContact) // Hapus Pesan

			// --- 🔥 CRUD TEAM MEMBER (ADMIN) 🔥 ---
			protected.POST("/teams", controllers.CreateTeamMember)
			protected.PUT("/teams/:id", controllers.UpdateTeamMember)    // Edit
			protected.DELETE("/teams/:id", controllers.DeleteTeamMember) // Hapus
		}
	}
}