package controllers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/AchmadZackyGZ/survey-backend/config"
	"github.com/AchmadZackyGZ/survey-backend/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CreatePublication: Tambah berita baru
func CreatePublication(c *gin.Context) {
	var newPub models.Publication

	// 1. BINDING JSON (SOLUSI UTAMA)
	// Kita wajib pakai ShouldBindJSON karena Frontend mengirim raw JSON body,
	// bukan FormData.
	if err := c.ShouldBindJSON(&newPub); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data JSON tidak valid: " + err.Error()})
		return
	}

	// 2. AUTO-GENERATE DATA SYSTEM
	newPub.ID = primitive.NewObjectID()
	newPub.CreatedAt = time.Now()
	newPub.UpdatedAt = time.Now()

	// 3. GENERATE SLUG
	// Mengubah "Judul Berita Kita" menjadi "judul-berita-kita-xa21..."
	slugBase := strings.ToLower(newPub.Title)
	slugBase = strings.ReplaceAll(slugBase, " ", "-")
	// Kita tambahkan sedikit ID unik di belakang slug agar tidak bentrok jika judul sama
	newPub.Slug = slugBase + "-" + newPub.ID.Hex()[20:]

	// 4. HANDLE GAMBAR (THUMBNAIL)
	// Frontend mengirim gambar sebagai String Base64 ke field 'Thumbnail'.
	// Kita simpan string tersebut langsung ke database.
	// Jika user tidak upload gambar, kita kasih gambar default placeholder.
	if newPub.Thumbnail == "" {
		newPub.Thumbnail = "https://placehold.co/600x400?text=No+Image"
	}

	// 5. SIMPAN KE DATABASE
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := config.GetCollection("publications")
	_, err := collection.InsertOne(ctx, newPub)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan ke database"})
		return
	}

	// 6. SUKSES
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Publikasi berhasil diterbitkan",
		"data":    newPub,
	})
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

// DeletePublication: Hapus berita
func DeletePublication(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	publicationId := c.Param("id")
	objId, _ := primitive.ObjectIDFromHex(publicationId)

	publicationCollection := config.GetCollection("publications")

	// Lakukan penghapusan data
	result, err := publicationCollection.DeleteOne(ctx, bson.M{"_id": objId})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus data"})
		return
	}

	if result.DeletedCount < 1 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Artikel tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Artikel berhasil dihapus",
	})
}


// 1. GET BY ID (Untuk mengisi form Edit)
func GetPublicationById(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	idParam := c.Param("id")
	objId, _ := primitive.ObjectIDFromHex(idParam)

	var publication models.Publication
	collection := config.GetCollection("publications")

	err := collection.FindOne(ctx, bson.M{"_id": objId}).Decode(&publication)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Artikel tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": publication})
}

// 2. UPDATE (Untuk menyimpan perubahan Edit)
func UpdatePublication(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	idParam := c.Param("id")
	objId, _ := primitive.ObjectIDFromHex(idParam)

	var input models.Publication
	// Kita pakai ShouldBindJSON agar konsisten dengan Create
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := config.GetCollection("publications")

	// Data yang akan diupdate
	updateData := bson.M{
		"title":      input.Title,
		"content":    input.Content,
		"category":   input.Category,
		"author":     input.Author,
		"thumbnail":  input.Thumbnail, // Base64 baru atau URL lama
		"updated_at": time.Now(),
	}

	// Update ke Database
	result, err := collection.UpdateOne(ctx, bson.M{"_id": objId}, bson.M{"$set": updateData})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengupdate data"})
		return
	}

	if result.MatchedCount < 1 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Artikel tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Artikel berhasil diperbarui",
	})
}