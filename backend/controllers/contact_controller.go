package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/AchmadZackyGZ/survey-backend/config"
	"github.com/AchmadZackyGZ/survey-backend/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// CreateContactMessage: Terima pesan dari form Frontend
func CreateContactMessage(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var msg models.ContactMessage
	// Validasi input (wajib ada email, nama, pesan)
	if err := c.BindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	msg.ID = primitive.NewObjectID()
	msg.IsRead = false
	msg.CreatedAt = time.Now()

	collection := config.GetCollection("contacts")
	result, err := collection.InsertOne(ctx, msg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengirim pesan"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "message": "Pesan Anda telah terkirim!", "data": result})
}

// (Opsional) GetAllMessages: Untuk Admin Panel membaca pesan masuk
func GetAllMessages(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var msgs []models.ContactMessage
	collection := config.GetCollection("contacts")

	// admin panel mungkin ingin menampilkan pesan terbaru dulu
	findOptions := options.Find()
	findOptions.SetSort(bson.D{{Key: "created_at", Value: -1}})
	findOptions.SetLimit(20)
	

	cursor, err := collection.Find(ctx, bson.M{}, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil pesan"})
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var msg models.ContactMessage
		cursor.Decode(&msg)
		msgs = append(msgs, msg)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": msgs})
}