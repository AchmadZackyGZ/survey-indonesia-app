package controllers

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/AchmadZackyGZ/survey-backend/config"
	"github.com/AchmadZackyGZ/survey-backend/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

// Kita HAPUS RegisterAdmin dari sini karena sudah via Seeder.
// Jika nanti butuh register user biasa (public), buat func RegisterUser disini.

// Login: Satu-satunya pintu masuk auth lewat API
func Login(c *gin.Context) {
	var input models.User
	var foundUser models.User

	// 1. Validasi Input
	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data salah"})
		return
	}

	// 2. Cari User di DB
	collection := config.GetCollection("users")
	err := collection.FindOne(context.Background(), bson.M{"email": input.Email}).Decode(&foundUser)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau password salah"})
		return
	}

	// 3. Cek Password
	err = bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau password salah"})
		return
	}

	// 4. Generate Token (Payload: ID & Role)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  foundUser.ID,
		"role": foundUser.Role, // Simpan role di token biar Frontend tau ini admin/bukan
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"token":  tokenString,
		"role":   foundUser.Role,
	})
}