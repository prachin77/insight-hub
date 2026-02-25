package utils

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	ServerPort int
}

func LoadConfig() (*AppConfig, error) {
	if err := godotenv.Load(); err != nil {
		return nil, fmt.Errorf("error loading .env file : %v", err)
	}

	ServerPortStr := os.Getenv("SERVER_PORT")
	ServerPort , err := strconv.Atoi(ServerPortStr)
	if err != nil || ServerPort <= 0 {
		return nil , fmt.Errorf("invalid or missing SERVER_PORT in environment")
	}

	return &AppConfig{
		ServerPort : ServerPort,
	} , nil
}

// NewAuthCookie creates an HTTP cookie for auth with a 10-minute expiry.
func NewAuthCookie(value string) http.Cookie {
	return http.Cookie{
		Name:     "auth_token",
		Value:    value,
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(10 * time.Minute),
	}
}
