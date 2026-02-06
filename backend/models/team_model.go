package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TeamMember struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name      string             `bson:"name" json:"name"`
	Role      string             `bson:"role" json:"role"`           
	Bio       string             `bson:"bio" json:"bio"`             
	PhotoURL  string             `bson:"photo_url" json:"photo_url"` // Nanti diisi Base64 String dari Frontend
	Linkedin  string             `bson:"linkedin" json:"linkedin"`   // Opsional (Boleh kosong)
	Expertise []string           `bson:"expertise" json:"expertise"` 
	
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}