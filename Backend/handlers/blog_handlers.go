package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/prachin77/insight-hub/db"
	"github.com/prachin77/insight-hub/models"
)

func CreateBlog(c *gin.Context) {
	var req models.Blog
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error(), nil))
		return
	}

	// Backend Validation
	title := strings.TrimSpace(req.Title)
	if len(title) < 5 || len(title) > 100 {
		c.JSON(http.StatusBadRequest, models.NewErrorResponse("title must be between 5 and 100 characters", nil))
		return
	}

	words := strings.Fields(req.BlogContent)
	wordCount := len(words)
	if wordCount < 1 || wordCount > 500 {
		c.JSON(http.StatusBadRequest, models.NewErrorResponse("content must be between 1 and 500 words", nil))
		return
	}

	// Unique Title Check
	exists, err := db.TitleExists(c.Request.Context(), title)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.NewErrorResponse("failed to check title uniqueness", nil))
		return
	}
	if exists {
		c.JSON(http.StatusConflict, models.NewErrorResponse("a blog with this title already exists", nil))
		return
	}

	// Validate author ID
	if req.AuthorID == "" || req.AuthorID == "anonymous" {
		c.JSON(http.StatusUnauthorized, models.NewErrorResponse("authenticated user required", nil))
		return
	}

	userID, err := db.GetUserID(c.Request.Context(), req.AuthorID)
	if err == nil {
		req.AuthorID = userID
	}

	blogID, err := db.CreateBlog(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error(), nil))
		return
	}

	c.JSON(http.StatusCreated, models.NewSuccessResponse("blog created successfully", gin.H{
		"id":   blogID,
		"blog": req,
	}))
}

func GetBlogs(c *gin.Context) {
	blogs, err := db.GetAllBlogs(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.NewErrorResponse("failed to fetch blogs", nil))
		return
	}

	c.JSON(http.StatusOK, models.NewSuccessResponse("blogs fetched successfully", blogs))
}
func IncrementViews(c *gin.Context) {
	var req struct {
		Title string `json:"title"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error(), nil))
		return
	}

	if err := db.IncrementViews(c.Request.Context(), req.Title); err != nil {
		c.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error(), nil))
		return
	}

	c.JSON(http.StatusOK, models.NewSuccessResponse("view count incremented", nil))
}

func ToggleLike(c *gin.Context) {
	var req struct {
		Title    string `json:"title"`
		Username string `json:"username"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error(), nil))
		return
	}

	isLiked, err := db.ToggleLike(c.Request.Context(), req.Username, req.Title)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error(), nil))
		return
	}

	c.JSON(http.StatusOK, models.NewSuccessResponse("like status toggled", gin.H{"liked": isLiked}))
}

func AddComment(c *gin.Context) {
	var req models.Comment
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error(), nil))
		return
	}

	if err := db.AddComment(c.Request.Context(), &req); err != nil {
		c.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error(), nil))
		return
	}

	c.JSON(http.StatusCreated, models.NewSuccessResponse("comment added successfully", req))
}

func GetComments(c *gin.Context) {
	blogID := c.Query("blog_id")
	if blogID == "" {
		c.JSON(http.StatusBadRequest, models.NewErrorResponse("blog_id is required", nil))
		return
	}

	comments, err := db.GetComments(c.Request.Context(), blogID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error(), nil))
		return
	}

	c.JSON(http.StatusOK, models.NewSuccessResponse("comments fetched successfully", comments))
}
