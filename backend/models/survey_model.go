package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ChartData menyimpan struktur grafik.
// Contoh: Labels = ["Ganjar", "Prabowo", "Anies"], Series = [30, 40, 25]
type ChartData struct {
	Type   string    `bson:"type" json:"type"`     // "bar", "pie", "line"
	Labels []string  `bson:"labels" json:"labels"` // Sumbu X
	Series []Series `bson:"series" json:"series"` // Sumbu Y (Data Angka)
}

type Series struct {
	Name string    `bson:"name" json:"name"`
	Data []float64 `bson:"data" json:"data"` // float64 = Support Desimal/Double
}

type Survey struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title"`
	Slug        string             `bson:"slug" json:"slug"` // URL friendly: survei-pilpres-2024
	Category    string             `bson:"category" json:"category"` // Politik, Ekonomi
	Description string             `bson:"description" json:"description"` // Ringkasan pendek

	// --- TAMBAHAN BARU (METODOLOGI) ---
	Methodology string `bson:"methodology" json:"methodology"` // Contoh: Multistage Random Sampling
	Respondents string `bson:"respondents" json:"respondents"` // Contoh: 1.200 Responden
	MarginError string `bson:"margin_error" json:"margin_error"` // Contoh: +/- 2.5%
	Region      string `bson:"region" json:"region"`           // Contoh: 34 Provinsi
	Thumbnail   string             `bson:"thumbnail" json:"thumbnail"`
	
	// Ini bagian kompleks: Data grafik disimpan sebagai Struct di dalam Struct
	ChartData   ChartData          `bson:"chart_data" json:"chart_data"` 

	CoverImage  string    `bson:"cover_image" json:"cover_image"` // URL Gambar
	PublishedAt time.Time `bson:"published_at" json:"published_at"`
	CreatedAt   time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time `bson:"updated_at" json:"updated_at"`
}