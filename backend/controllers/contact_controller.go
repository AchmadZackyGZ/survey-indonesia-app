package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/AchmadZackyGZ/survey-backend/config"
	"github.com/AchmadZackyGZ/survey-backend/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson" // Tambahan untuk GetAll
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options" // Tambahan untuk GetAll
)

func CreateContact(c *gin.Context) {
	var input models.Contact

	// 1. Validasi Input JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 2. Lengkapi Data
	input.ID = primitive.NewObjectID()
	input.CreatedAt = time.Now()

	// 3. Simpan ke MongoDB
	collection := config.GetCollection("contacts")
	_, err := collection.InsertOne(context.Background(), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengirim pesan"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Pesan Anda telah terkirim!",
		"data":    input,
	})
}

// ---------------------------------------------
// 2. FUNGSI GET ALL (Untuk Admin Panel Nanti)
// ---------------------------------------------
func GetAllMessages(c *gin.Context) {
    collection := config.GetCollection("contacts")

    // Urutkan dari yang terbaru (descending by created_at)
    findOptions := options.Find()
    findOptions.SetSort(bson.D{{Key: "created_at", Value: -1}})

    cursor, err := collection.Find(context.Background(), bson.M{}, findOptions)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data pesan"})
        return
    }
    defer cursor.Close(context.Background())

    // PERBAIKAN DISINI JUGA: Gunakan 'models.Contact'
    var messages []models.Contact
    
    if err = cursor.All(context.Background(), &messages); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal parsing data"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "status": "success",
        "data":   messages,
    })
}