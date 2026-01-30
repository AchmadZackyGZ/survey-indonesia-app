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