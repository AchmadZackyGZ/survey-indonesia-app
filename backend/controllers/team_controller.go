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

// CreateTeamMember: Tambah profil ahli baru
func CreateTeamMember(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var team models.TeamMember
	if err := c.BindJSON(&team); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	team.ID = primitive.NewObjectID()

	collection := config.GetCollection("teams")
	result, err := collection.InsertOne(ctx, team)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data tim"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "data": result})
}

// GetAllTeamMembers: Tampilkan list semua ahli
func GetAllTeamMembers(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var teams []models.TeamMember
	collection := config.GetCollection("teams")

	cursor, err := collection.Find(ctx, map[string]interface{}{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data"})
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var member models.TeamMember
		cursor.Decode(&member)
		teams = append(teams, member)
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": teams})
}