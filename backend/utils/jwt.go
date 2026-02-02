package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5" // Kita pakai library JWT versi 5 (terbaru)
)

// Ambil Secret Key dari Environment Variable (file .env)
// Jika tidak ada di .env, pakai default "rahasia_super"
func getSecretKey() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return []byte("rahasia_super_lsi_backend_2026") 
	}
	return []byte(secret)
}

// Fungsi untuk Membuat Token (GenerateToken)
func GenerateToken(userId string, email string) (string, error) {
	// 1. Tentukan isi token (Claims)
	claims := jwt.MapClaims{
		"user_id": userId,
		"email":   email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Token berlaku 24 Jam
	}

	// 2. Buat token dengan algoritma HS256
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// 3. Tanda tangani token dengan Secret Key
	return token.SignedString(getSecretKey())
}