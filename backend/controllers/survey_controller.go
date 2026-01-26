package controllers

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/AchmadZackyGZ/survey-backend/config"
	"github.com/AchmadZackyGZ/survey-backend/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
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

// GetAllSurveys: Mengambil semua data survei (Dengan Filter Terbaru & Limit)
func GetAllSurveys(c *gin.Context) {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    var surveys []models.Survey
    collection := config.GetCollection("surveys")

    // 1. VALIDASI PARAMETER PAGE
    pageStr := c.DefaultQuery("page", "1")
    page, err := strconv.Atoi(pageStr)
    if err != nil || page < 1 {
        // Jika bukan angka ATAU angkanya di bawah 1 (misal 0 atau -5)
        c.JSON(http.StatusBadRequest, gin.H{
            "status": "error", 
            "message": "Parameter 'page' harus berupa angka positif (min 1)",
        })
        return
    }

    // 2. VALIDASI PARAMETER LIMIT
    limitStr := c.DefaultQuery("limit", "10")
    limit, err := strconv.Atoi(limitStr)
    if err != nil || limit < 1 {
        c.JSON(http.StatusBadRequest, gin.H{
            "status": "error", 
            "message": "Parameter 'limit' harus berupa angka positif",
        })
        return
    }

    // 3. LOGIC PAGINATION (Aman karena page & limit sudah pasti valid)
    skip := (page - 1) * limit

    findOptions := options.Find()
    findOptions.SetSort(bson.D{{Key: "created_at", Value: -1}})
    findOptions.SetLimit(int64(limit))
    findOptions.SetSkip(int64(skip))

    cursor, err := collection.Find(ctx, bson.M{}, findOptions)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data"})
        return
    }
    defer cursor.Close(ctx)

    for cursor.Next(ctx) {
        var survey models.Survey
        if err := cursor.Decode(&survey); err != nil {
            continue
        }
        surveys = append(surveys, survey)
    }

    // Handle jika data kosong (agar return array kosong [], bukan null)
    if surveys == nil {
        surveys = []models.Survey{}
    }

    c.JSON(http.StatusOK, gin.H{
        "status": "success",
        "data":   surveys,
        "meta": gin.H{
            "page":  page,
            "limit": limit,
        },
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