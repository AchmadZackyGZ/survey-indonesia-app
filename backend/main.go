package main

import (
	"log"
	"time"

	"github.com/AchmadZackyGZ/survey-backend/config"
	"github.com/AchmadZackyGZ/survey-backend/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Connect Database
	config.ConnectDB()

	// 2. Init Router
	router := gin.Default()

	// 3. === PASANG CORS DISINI (PENTING!) ===
	// Ini mengizinkan Frontend (localhost:3000) untuk mengakses Backend
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // URL Frontend Next.js
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 4. Setup Routes
	routes.SetupRoutes(router)

	// 5. Jalankan Server
	log.Println("Server running on port 8080")
	router.Run(":8080")
}