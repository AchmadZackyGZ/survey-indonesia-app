package main

import (
	"context"
	"fmt"
	"log"

	"github.com/AchmadZackyGZ/survey-backend/config"
	"github.com/AchmadZackyGZ/survey-backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// 1. Konek Database (Load .env harus jalan di backend/ root context)
	// Pastikan menjalankan script ini dari folder backend/
	config.ConnectDB() 

	// 2. Data Admin yang mau dibuat
	adminEmail := "superadmin@smrc.com"
	adminPassword := "superadmin" // Ganti password sesuka hati disini

	collection := config.GetCollection("users")

	// 3. Cek apakah admin sudah ada?
	var existingUser models.User
	err := collection.FindOne(context.Background(), bson.M{"email": adminEmail}).Decode(&existingUser)
	if err == nil {
		fmt.Println("⚠️ Admin sudah ada, tidak perlu dibuat lagi.")
		return
	}

	// 4. Hash Password
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(adminPassword), bcrypt.DefaultCost)

	// 5. Buat Object Admin
	newAdmin := models.User{
		ID:       primitive.NewObjectID(),
		Email:    adminEmail,
		Password: string(hashedPassword),
		Role:     "admin",
	}

	// 6. Simpan ke Database
	_, err = collection.InsertOne(context.Background(), newAdmin)
	if err != nil {
		log.Fatal("Gagal seeding admin:", err)
	}

	fmt.Println("✅ SUKSES! Admin berhasil ditanam ke database.")
	fmt.Println("Email:", adminEmail)
	fmt.Println("Password:", adminPassword)
}