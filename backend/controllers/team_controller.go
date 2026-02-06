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
)

// 1. CREATE (Tambah Ahli)
func CreateTeamMember(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var team models.TeamMember
	if err := c.BindJSON(&team); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	team.ID = primitive.NewObjectID()
	team.CreatedAt = time.Now()
	team.UpdatedAt = time.Now()

	collection := config.GetCollection("teams")
	result, err := collection.InsertOne(ctx, team)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data tim"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "data": result})
}

// 2. GET ALL (List Semua Ahli)
func GetAllTeamMembers(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var teams []models.TeamMember
	collection := config.GetCollection("teams")

    // Urutkan berdasarkan created_at desc (Terbaru diatas)
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data"})
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var member models.TeamMember
		if err := cursor.Decode(&member); err != nil {
			continue
		}
		teams = append(teams, member)
	}

	if teams == nil {
		teams = []models.TeamMember{}
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": teams})
}

// 3. GET BY ID
func GetTeamMemberById(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	idParam := c.Param("id")
	objId, _ := primitive.ObjectIDFromHex(idParam)

	var member models.TeamMember
	collection := config.GetCollection("teams")

	err := collection.FindOne(ctx, bson.M{"_id": objId}).Decode(&member)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Anggota tim tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": member})
}

// 4. UPDATE (Edit Profil) - SUDAH DISESUAIKAN FIELD LINKEDIN
func UpdateTeamMember(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	idParam := c.Param("id")
	objId, _ := primitive.ObjectIDFromHex(idParam)

	var input models.TeamMember
	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := config.GetCollection("teams")
	
	update := bson.M{
		"$set": bson.M{
			"name":       input.Name,
			"role":       input.Role,
			"bio":        input.Bio,
			"photo_url":  input.PhotoURL, // Akan menerima string Base64 panjang
			"linkedin":   input.Linkedin, // Field baru (Social -> Linkedin)
			"expertise":  input.Expertise,
			"updated_at": time.Now(),
		},
	}

	_, err := collection.UpdateOne(ctx, bson.M{"_id": objId}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal update data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Data berhasil diperbarui"})
}

// 5. DELETE (Hapus Ahli)
func DeleteTeamMember(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	idParam := c.Param("id")
	objId, _ := primitive.ObjectIDFromHex(idParam)

	collection := config.GetCollection("teams")
	res, err := collection.DeleteOne(ctx, bson.M{"_id": objId})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus data"})
		return
	}

	if res.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Berhasil dihapus"})
}