package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/prachin77/insight-hub/db"
	"github.com/prachin77/insight-hub/handlers"
	"github.com/prachin77/insight-hub/middleware"
	"github.com/prachin77/insight-hub/models"
	"github.com/prachin77/insight-hub/utils"
)

func main() {
	// Load application configuration from .env
	config, err := utils.LoadConfig()
	if err != nil {
		log.Fatalf("❌ Failed to load configuration: %v", err)
	}

	// Initialize Firestore database
	if err := db.Init(); err != nil {
		log.Fatalf("❌ Failed to initialize Firestore: %v", err)
	}
	defer db.Close()

	// Create Gin server (simple, explicit setup)
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()

	// Basic middlewares
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(middleware.RequestLogger())
	r.Use(middleware.CORSMiddleware())

	// Basic health check route
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, models.NewSuccessResponse("health ok", gin.H{
			"status": "ok",
		}))
	})

	// Auth routes
	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)
	r.POST("/logout", handlers.Logout)

	addr := fmt.Sprintf(":%d", config.ServerPort)
	log.Printf("🚀 Web server starting on port %d", config.ServerPort)
	log.Printf("🔗 Visit: http://localhost:%d", config.ServerPort)

	if err := r.Run(addr); err != nil {
		log.Fatalf("❌ Server failed to start: %v", err)
	}
}
