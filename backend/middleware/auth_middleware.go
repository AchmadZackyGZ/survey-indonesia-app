package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Ambil Header Authorization
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token tidak ditemukan, akses ditolak!"})
			return
		}

		// Format header biasanya: "Bearer eyJhbGci..."
		tokenString := strings.Split(authHeader, "Bearer ")
		if len(tokenString) < 2 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Format token salah"})
			return
		}

		// 2. Validasi Token
		token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("metode signing salah")
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		// 3. Cek apakah token valid
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			// (Opsional) Simpan user_id ke context biar bisa dipake di controller
			c.Set("user_id", claims["sub"])
			c.Next() // LANJUT KE CONTROLLER UTAMA
		} else {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token invalid atau kadaluarsa", "details": err.Error()})
		}
	}
}