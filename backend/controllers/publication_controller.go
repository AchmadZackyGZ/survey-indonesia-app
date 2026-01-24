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

// CreatePublication: Tambah berita baru
func CreatePublication(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var pub models.Publication
	if err := c.BindJSON(&pub); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pub.ID = primitive.NewObjectID()
	pub.PublishedAt = time.Now()
	pub.CreatedAt = time.Now()

	collection := config.GetCollection("publications")
	result, err := collection.InsertOne(ctx, pub)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan berita"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "data": result})
}

// GetAllPublications: Ambil semua berita
func GetAllPublications(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var pubs []models.Publication
	collection := config.GetCollection("publications")

	cursor, err := collection.Find(ctx, map[string]interface{}{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data"})
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var pub models.Publication
		cursor.Decode(&pub)
		pubs = append(pubs, pub)
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": pubs})
}

// GetPublicationBySlug: Baca satu berita detail
func GetPublicationBySlug(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	slug := c.Param("slug")
	var pub models.Publication
	collection := config.GetCollection("publications")

	err := collection.FindOne(ctx, map[string]interface{}{"slug": slug}).Decode(&pub)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Berita tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": pub})
}