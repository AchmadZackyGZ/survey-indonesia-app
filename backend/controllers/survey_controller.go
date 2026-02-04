package controllers

import (
	"context"
	"net/http"
	"strconv"
	"strings"
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

	// Gunakan satu variabel saja agar tidak bingung
	var input models.Survey

	// 1. Validasi & Bind JSON yang dikirim Frontend
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 2. GENERATE SLUG OTOMATIS (Wajib agar detail bisa dibuka)
	// Jika Slug kosong, kita buat dari Title
	if input.Slug == "" {
		slug := strings.ToLower(input.Title)
		slug = strings.ReplaceAll(slug, " ", "-")
		// (Opsional) Hapus karakter aneh jika perlu
		input.Slug = slug
	}

	// 4. Default Thumbnail jika kosong
    if input.Thumbnail == "" {
        // Optional: Set default image URL jika user tidak upload
        input.Thumbnail = "https://placehold.co/600x400/EEE/31343C?text=No+Image"
    }

	// 3. Lengkapi Data System (ID, Tanggal)
	input.ID = primitive.NewObjectID()
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()
	
	// Jika PublishedAt belum diisi user, isi dengan waktu sekarang
	if input.PublishedAt.IsZero() {
		input.PublishedAt = time.Now()
	}

	// 4. Simpan ke Database
	// Kita langsung simpan objek 'input' karena strukturnya sudah sesuai Model
	collection := config.GetCollection("surveys")
	_, err := collection.InsertOne(ctx, input)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data ke database"})
		return
	}

	// 5. Berikan respon sukses
	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Data survei berhasil dibuat!",
		"data":    input,
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

func DeleteSurvey(c *gin.Context) {
	surveyId := c.Param("id")
	objId, _ := primitive.ObjectIDFromHex(surveyId)

	collection := config.GetCollection("surveys")
	
    // Coba hapus document
    res, err := collection.DeleteOne(context.Background(), bson.M{"_id": objId})
	
    if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus data"})
		return
	}

    if res.DeletedCount == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Data tidak ditemukan"})
        return
    }

	c.JSON(http.StatusOK, gin.H{"message": "Survei berhasil dihapus"})
}

// 1. GET BY ID (Untuk persiapan Edit)
func GetSurveyById(c *gin.Context) {
	surveyId := c.Param("id")
	objId, _ := primitive.ObjectIDFromHex(surveyId)

	var survey models.Survey
	collection := config.GetCollection("surveys")

	err := collection.FindOne(context.Background(), bson.M{"_id": objId}).Decode(&survey)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": survey})
}

// 2. UPDATE SURVEY (Simpan Perubahan)
func UpdateSurvey(c *gin.Context) {
	surveyId := c.Param("id")
	objId, _ := primitive.ObjectIDFromHex(surveyId)

	var input models.Survey
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := config.GetCollection("surveys")
    
    // Kita update field yang penting saja
	update := bson.M{
		"$set": bson.M{
			"title":       input.Title,
			"category":    input.Category,
			"description": input.Description,
			"thumbnail":   input.Thumbnail,
            // Update Metodologi
            "methodology":  input.Methodology,
            "respondents":  input.Respondents,
            "margin_error": input.MarginError,
            "region":       input.Region,
            // Update Chart
			"chart_data":  input.ChartData,
			"updated_at":  time.Now(),
		},
	}

	_, err := collection.UpdateOne(context.Background(), bson.M{"_id": objId}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengupdate data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Data berhasil diperbarui!"})
}