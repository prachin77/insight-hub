package middleware

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// RequestLogger provides simple structured logging for each HTTP request.
func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// Process request
		c.Next()

		status := c.Writer.Status()
		method := c.Request.Method
		path := c.Request.URL.Path
		latency := time.Since(start)
		clientIP := c.ClientIP()

		// Skip logging for certain paths
		if path == "/health" || path == "/favicon.ico" {
			return
		}

		logMessage := fmt.Sprintf("%-15s | %-6s | %3d | %-30s | %v",
			clientIP,
			method,
			status,
			path,
			latency,
		)

		fmt.Println(logMessage)
	}
}

// CORSMiddleware handles Cross-Origin Resource Sharing between frontend and backend.
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// In dev, allow the frontend origin explicitly (e.g., http://localhost:8080)
		if origin == "http://localhost:8080" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400") // 24 hours

		// Handle preflight OPTIONS request
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

