# 1. Gunakan Base Image Golang versi terbaru
FROM golang:1.23-alpine

# 2. Set folder kerja di dalam container
WORKDIR /app

# 3. Copy file dependency dulu (agar cache efisien)
COPY go.mod go.sum ./

# 4. Download semua library yang dibutuhkan
RUN go mod download

# 5. Copy semua source code backend ke dalam container
COPY . .

# 6. Build aplikasi menjadi file binary bernama 'main'
RUN go build -o main .

# 7. Expose port 8080 (Pintu akses)
EXPOSE 8080

# 8. Jalankan aplikasi saat container nyala
CMD ["./main"]