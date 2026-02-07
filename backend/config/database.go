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

// Variabel global
var DB *mongo.Client

// ConnectDB: Fungsi inisialisasi koneksi
func ConnectDB() *mongo.Client {
	// 1. Coba Load .env (TAPI JANGAN MATI KALAU GAGAL)
	// Kita ubah log.Fatal menjadi log.Println
	if err := godotenv.Load(); err != nil {
		log.Println("Info: File .env tidak ditemukan, menggunakan variable environment sistem (Railway)")
	}

	// 2. Ambil MONGO_URI
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		// Nah, kalau variable-nya kosong (baik dari file maupun sistem), baru kita matikan.
		log.Fatal("Fatal: MONGO_URI tidak ditemukan di environment!")
	}

	// 3. Konfigurasi Client
	// ServerAPI opsional, tapi bagus untuk kestabilan di Atlas
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	clientOptions := options.Client().ApplyURI(mongoURI).SetServerAPIOptions(serverAPI)

	// 4. Coba Connect
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Gagal membuat client MongoDB:", err)
	}

	// 5. Cek Ping (Pastikan koneksi hidup)
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Gagal ping ke MongoDB (Cek IP Whitelist / Password Salah?):", err)
	}

	fmt.Println("✅ Berhasil terkoneksi ke MongoDB!")

	// Simpan ke variabel global
	DB = client
	return client
}

// GetCollection: Helper ambil tabel
func GetCollection(collectionName string) *mongo.Collection {
	// Cek apakah ada nama DB di env, kalau tidak pakai default
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "survey_db" // Pastikan nama ini sesuai
	}
	return DB.Database(dbName).Collection(collectionName)
}