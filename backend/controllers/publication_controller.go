package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/AchmadZackyGZ/survey-backend/config"
	"github.com/AchmadZackyGZ/survey-backend/models"
	"github.com/AchmadZackyGZ/survey-backend/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CreatePublication: Tambah berita baru
func CreatePublication(c *gin.Context) {
	// 1. Parsing Form Data (Karena ada file, tidak bisa pakai BindJSON)
	// Kita ambil text input manual
	title := c.PostForm("title")
	slug := c.PostForm("slug") // Nanti bisa dibikin auto-generate dari title
	contentType := c.PostForm("type") // Berita / Opini
	content := c.PostForm("content")
	author := c.PostForm("author")

	// 2. Ambil File Gambar dari form "image"
	file, _, err := c.Request.FormFile("image")
	
	var imageUrl string
	if err == nil {
		// Jika ada file gambar yang diupload user
		defer file.Close()
		
		// Upload ke Cloudinary
		imageUrl, err = utils.UploadToCloudinary(file, "publications")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal upload gambar ke Cloudinary"})
			return
		}
	} else {
		// Jika tidak ada gambar, pakai default atau kosong
		imageUrl = "https://placehold.co/600x400?text=No+Image"
	}

	// 3. Masukkan ke Database
	newPub := models.Publication{
		ID:          primitive.NewObjectID(),
		Title:       title,
		Slug:        slug,
		Type:        contentType,
		Content:     content,
		Author:      author,
		ImageURL:    imageUrl, // URL dari Cloudinary masuk sini
		PublishedAt: time.Now(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	collection := config.GetCollection("publications")
	_, err = collection.InsertOne(context.Background(), newPub)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Publikasi berhasil dibuat",
		"data":    newPub,
	})
	
	
	// kodingan lama tanpa upload gambar ke Cloudinary
	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// defer cancel()

	// var pub models.Publication
	// if err := c.BindJSON(&pub); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	// pub.ID = primitive.NewObjectID()
	// pub.PublishedAt = time.Now()
	// pub.CreatedAt = time.Now()

	// collection := config.GetCollection("publications")
	// result, err := collection.InsertOne(ctx, pub)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan berita"})
	// 	return
	// }

	// c.JSON(http.StatusCreated, gin.H{"status": "success", "data": result})
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