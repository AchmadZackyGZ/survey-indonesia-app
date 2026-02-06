package controllers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/AchmadZackyGZ/survey-backend/config"
	"github.com/AchmadZackyGZ/survey-backend/models"
	"github.com/gin-gonic/gin" // Tambahan untuk GetAll
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	// Tambahan untuk GetAll
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

func GetAllContacts(c *gin.Context){
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var contacts []models.Contact
	collection := config.GetCollection("contacts")

	// urutkan dari yang terbaru 
	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})

	cursor, err := collection.Find(ctx, bson.M{}, opts)
	if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data pesan"})
        return
    }
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
        var contact models.Contact
        if err := cursor.Decode(&contact); err != nil {
			fmt.Println("❌ ERROR DECODE DATA:", err)
            continue
        }
        contacts = append(contacts, contact)
    }

	if contacts == nil {
        contacts = []models.Contact{}
    }

	c.JSON(http.StatusOK, gin.H{
        "status": "success",
        "data":   contacts,
    })
}

// --- TAMBAHAN BARU: DELETE CONTACT ---
func DeleteContact(c *gin.Context) {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    contactId := c.Param("id")
    objId, _ := primitive.ObjectIDFromHex(contactId)

    collection := config.GetCollection("contacts")
    res, err := collection.DeleteOne(ctx, bson.M{"_id": objId})

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus pesan"})
        return
    }

    if res.DeletedCount == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Pesan tidak ditemukan"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Pesan berhasil dihapus"})
}