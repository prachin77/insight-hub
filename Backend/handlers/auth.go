package handlers

import (
	"net/http"
	"unicode"

	"github.com/gin-gonic/gin"
	"github.com/prachin77/insight-hub/db"
	"github.com/prachin77/insight-hub/models"
	"github.com/prachin77/insight-hub/utils"
)


func Register(c *gin.Context) {
	var req models.User
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error(), nil))
		return
	}

	// Backend validation: username length and password strength
	if len(req.Username) < 3 || len(req.Username) > 20 {
		c.JSON(http.StatusBadRequest, models.NewErrorResponse("username must be between 3 and 20 characters", nil))
		return
	}
	if !isStrongPassword(req.Password) {
		c.JSON(http.StatusBadRequest, models.NewErrorResponse("password must be at least 8 characters and include one uppercase letter and one special character", nil))
		return
	}

	if err := db.CreateUser(c.Request.Context(), &req); err != nil {
		c.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error(), nil))
		return
	}

	// Set auth cookie valid for 10 minutes
	cookie := utils.NewAuthCookie(req.Email)
	http.SetCookie(c.Writer, &cookie)

	c.JSON(http.StatusOK, models.NewSuccessResponse("registration successful", gin.H{
		"fullName": req.FullName,
		"email":    req.Email,
		"username": req.Username,
	}))
}


func Login(c *gin.Context) {
	var req models.User
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error(), nil))
		return
	}

	if err := db.ValidateUser(c.Request.Context(), req.Email, req.Password); err != nil {
		c.JSON(http.StatusUnauthorized, models.NewErrorResponse(err.Error(), nil))
		return
	}

	// Set auth cookie valid for 10 minutes
	cookie := utils.NewAuthCookie(req.Email)
	http.SetCookie(c.Writer, &cookie)

	c.JSON(http.StatusOK, models.NewSuccessResponse("login successful", gin.H{
		"email":    req.Email,
		"username": req.Username,
	}))
}

func isStrongPassword(pw string) bool {
	if len(pw) < 8 {
		return false
	}
	var hasUpper, hasSpecial bool
	for _, ch := range pw {
		switch {
		case unicode.IsUpper(ch):
			hasUpper = true
		case unicode.IsPunct(ch) || unicode.IsSymbol(ch):
			hasSpecial = true
		}
	}
	return hasUpper && hasSpecial
}

