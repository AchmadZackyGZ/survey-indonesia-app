package controllers

import (
	"context"
	"net/http"

	"github.com/AchmadZackyGZ/survey-backend/config"
	"github.com/AchmadZackyGZ/survey-backend/models"
	"github.com/AchmadZackyGZ/survey-backend/utils" // <--- 1. WAJIB IMPORT INI
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

// 2. KITA BUAT STRUCT INPUT DISINI SAJA (Biar tidak error 'undefined')
type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var input LoginInput // Gunakan struct LoginInput yang baru kita buat di atas
	var user models.User

	// 1. Cek Format JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak valid"})
		return
	}

	// 2. Cari User berdasarkan Email
	collection := config.GetCollection("users")
	err := collection.FindOne(context.Background(), bson.M{"email": input.Email}).Decode(&user)
	
	if err != nil {
		// Gunakan 401 (Unauthorized) agar Frontend tahu ini salah password/email
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau password salah"})
		return
	}

	// 3. Cek Password (Verify)
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau password salah"})
		return
	}

	// 4. Generate JWT Token
	// Pastikan function GenerateToken ada di folder utils Anda
	token, err := utils.GenerateToken(user.ID.Hex(), user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat token"})
		return
	}

	// 5. Login Sukses -> Kirim Token
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "Login berhasil",
		"data": gin.H{
			"token": token,
			"name": user.Name, 
			"role": user.Role,
		},
	})
}