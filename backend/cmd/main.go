package main

import (
	"github.com/AchmadZackyGZ/survey-backend/config" // GANTI 'username' dengan folder asli Anda di go.mod
	"github.com/AchmadZackyGZ/survey-backend/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Inisialisasi Database (Panggil fungsi yang kita buat di langkah 2)
	config.ConnectDB()

	// 2. Setup Gin Router
	r := gin.Default()

	// setup RRoute
	routes.SurveyRoutes(r)

	// 3. Test Endpoint Sederhana (Ping)
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
			"status":  "Database Connected",
		})
	})

	// 4. Jalankan Server
	r.Run(":8080") 
}