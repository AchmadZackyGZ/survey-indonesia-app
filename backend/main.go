package main

import (
	"log"
	"os"
	"time"

	"github.com/AchmadZackyGZ/survey-backend/config"
	"github.com/AchmadZackyGZ/survey-backend/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 1. Load .env (PERBAIKAN 1: PENTING UNTUK RAILWAY)
	// Kita buat agar dia TIDAK MATI (Log Fatal) jika .env tidak ada
	if err := godotenv.Load(); err != nil {
		log.Println("Info: No .env file found, using system environment variables")
	}

	// 2. Connect Database
	config.ConnectDB()

	// 3. Init Router
	router := gin.Default()

	// 4. === SETUP CORS (PERBAIKAN 2: AGAR VERCEL BISA AKSES) ===
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000", // Untuk Localhost Laptop Anda
			"https://*",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 5. Setup Routes
	routes.SetupRoutes(router)

	// 6. Jalankan Server (PERBAIKAN 3: PORT DINAMIS)
	// Railway akan menyuntikkan port lewat variabel "PORT"
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default ke 8080 jika jalan di localhost
	}

	log.Println("Server running on port " + port)
	router.Run(":" + port)
}