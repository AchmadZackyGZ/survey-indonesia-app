package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Publication struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title"`
	Slug        string             `bson:"slug" json:"slug"` // url-friendly: hasil-quick-count
	Type        string             `bson:"type" json:"type"` // "berita", "opini", "rilis_pers"
	Content     string             `bson:"content" json:"content"` // Isi artikel (bisa HTML panjang)
	Author      string             `bson:"author" json:"author"`
	ImageURL    string             `bson:"image_url" json:"image_url"`
	PublishedAt time.Time          `bson:"published_at" json:"published_at"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updated_at"`
}