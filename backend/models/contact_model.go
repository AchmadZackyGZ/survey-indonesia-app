package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ContactMessage struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name      string             `bson:"name" json:"name" binding:"required"`
	Email     string             `bson:"email" json:"email" binding:"required,email"`
	Subject   string             `bson:"subject" json:"subject" binding:"required"`
	Message   string             `bson:"message" json:"message" binding:"required"`
	IsRead    bool               `bson:"is_read" json:"is_read"` // Status apakah sudah dibaca admin
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}