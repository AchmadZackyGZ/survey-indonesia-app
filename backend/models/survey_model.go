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
	Series []float64 `bson:"series" json:"series"` // Sumbu Y (Data Angka)
}

type Survey struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title"`
	Slug        string             `bson:"slug" json:"slug"` // URL friendly: survei-pilpres-2024
	Category    string             `bson:"category" json:"category"` // Politik, Ekonomi
	Description string             `bson:"description" json:"description"` // Ringkasan pendek
	
	// Ini bagian kompleks: Data grafik disimpan sebagai Struct di dalam Struct
	Chart ChartData `bson:"chart_data" json:"chart_data"` 

	CoverImage  string    `bson:"cover_image" json:"cover_image"` // URL Gambar
	PublishedAt time.Time `bson:"published_at" json:"published_at"`
	CreatedAt   time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time `bson:"updated_at" json:"updated_at"`
}