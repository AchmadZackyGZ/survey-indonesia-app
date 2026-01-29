package utils

import (
	"context"
	"os"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func UploadToCloudinary(file interface{}, folderName string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 1. Inisialisasi Cloudinary pakai URL dari .env
	cld, err := cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
	if err != nil {
		return "", err
	}

	// 2. Upload File
	resp, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: "survey-indonesia-app/" + folderName, // Biar rapi di folder khusus
	})
	if err != nil {
		return "", err
	}

	// 3. Kembalikan URL gambar yang aman (HTTPS)
	return resp.SecureURL, nil
}