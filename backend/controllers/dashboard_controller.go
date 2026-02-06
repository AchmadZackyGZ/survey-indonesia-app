package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/AchmadZackyGZ/survey-backend/config"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func GetDashboardStats(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 1. Definisikan Collection
	surveyColl := config.GetCollection("surveys")
	pubColl := config.GetCollection("publications")
	contactColl := config.GetCollection("contacts")

	// 2. Hitung Jumlah Data
	totalSurveys, _ := surveyColl.CountDocuments(ctx, bson.M{})
	totalPubs, _ := pubColl.CountDocuments(ctx, bson.M{})
	totalContacts, _ := contactColl.CountDocuments(ctx, bson.M{})

	// 3. Kirim Response JSON
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": gin.H{
			"total_surveys":      totalSurveys,
			"total_publications": totalPubs,
			"total_contacts":     totalContacts, // <-- HARUS total_contacts (Bukan total_messages)
		},
	})
}
