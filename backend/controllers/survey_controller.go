package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/AchmadZackyGZ/survey-backend/config"
	"github.com/AchmadZackyGZ/survey-backend/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CreateSurvey: Menyimpan data survei baru ke MongoDB
func CreateSurvey(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var survey models.Survey

	// 1. Validasi JSON yang dikirim user
	if err := c.BindJSON(&survey); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 2. Lengkapi data otomatis (ID, Tanggal Dibuat)
	newSurvey := models.Survey{
		ID:          primitive.NewObjectID(),
		Title:       survey.Title,
		Slug:        survey.Slug,
		Category:    survey.Category,
		Description: survey.Description,
		Chart:       survey.Chart, // Data grafik nested struct
		CoverImage:  survey.CoverImage,
		PublishedAt: time.Now(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// 3. Simpan ke Collection "surveys"
	collection := config.GetCollection("surveys")
	result, err := collection.InsertOne(ctx, newSurvey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data ke database"})
		return
	}

	// 4. Berikan respon sukses
	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Data survei berhasil dibuat!",
		"data":    result,
	})
}

// GetAllSurveys: Mengambil semua data survei
func GetAllSurveys(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var surveys []models.Survey
	collection := config.GetCollection("surveys")

	// Find tanpa filter (bson.M{}) artinya ambil semua
	cursor, err := collection.Find(ctx, map[string]interface{}{}) 
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data"})
		return
	}
	defer cursor.Close(ctx)

	// Loop cursor untuk decode data ke slice surveys
	for cursor.Next(ctx) {
		var survey models.Survey
		if err := cursor.Decode(&survey); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding data"})
			return
		}
		surveys = append(surveys, survey)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   surveys,
	})
}

// GetSurveyBySlug: Mengambil satu survei detail berdasarkan slug URL
func GetSurveyBySlug(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	slug := c.Param("slug") // Ambil parameter dari URL
	var survey models.Survey
	collection := config.GetCollection("surveys")

	// Cari data dimana field "slug" sama dengan parameter URL
	err := collection.FindOne(ctx, map[string]interface{}{"slug": slug}).Decode(&survey)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Survei tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   survey,
	})
}