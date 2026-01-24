package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Variabel global untuk menampung koneksi agar bisa dipakai di file lain
var DB *mongo.Client

// ConnectDB: Fungsi inisialisasi koneksi
func ConnectDB() *mongo.Client {
	// 1. Load file .env agar Go bisa baca MONGO_URI
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI tidak ditemukan di .env")
	}

	// 2. Konfigurasi Client
	clientOptions := options.Client().ApplyURI(mongoURI)
	
	// 3. Coba Connect
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Gagal membuat client MongoDB:", err)
	}

	// 4. Cek Ping (Memastikan database benar-benar hidup)
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Gagal ping ke MongoDB (Cek apakah MongoDB sudah jalan?):", err)
	}

	fmt.Println("✅ Berhasil terkoneksi ke MongoDB!")
	
	// Simpan ke variabel global
	DB = client
	return client
}

// GetCollection: Helper agar Controller gampang ambil tabel (collection)
func GetCollection(collectionName string) *mongo.Collection {
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "survey_db" // Default fallback
	}
	return DB.Database(dbName).Collection(collectionName)
}