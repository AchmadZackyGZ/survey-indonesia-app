package routes

import (
	"github.com/AchmadZackyGZ/survey-backend/controllers"
	"github.com/gin-gonic/gin"
)

func SurveyRoutes(router *gin.Engine) {
	// Kita grupkan dengan prefix "/api" agar rapi
	api := router.Group("/api")
	{
		// Method POST untuk membuat data
		api.POST("/surveys", controllers.CreateSurvey)
		
		api.GET("/surveys", controllers.GetAllSurveys)
		
		api.GET("/surveys/:slug", controllers.GetSurveyBySlug)
	}
}