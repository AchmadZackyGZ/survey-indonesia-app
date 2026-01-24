package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TeamMember struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name      string             `bson:"name" json:"name"`
	Role      string             `bson:"role" json:"role"` // Contoh: "Direktur Eksekutif"
	Bio       string             `bson:"bio" json:"bio"`   // Penjelasan singkat latar belakang
	PhotoURL  string             `bson:"photo_url" json:"photo_url"`
	Linkedin  string             `bson:"linkedin" json:"linkedin"`
	Expertise []string           `bson:"expertise" json:"expertise"` // ["Politik", "Statistik"]
}