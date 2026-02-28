package models

import "time"

type User struct {
	FullName   string    `json:"fullName"`
	Username   string    `json:"username"`
	Email      string    `json:"email" binding:"required,email"`
	Password   string    `json:"password" binding:"required"`
	CreatedAt  time.Time `json:"created_at"`
	NoOfBlogs  int       `json:"no_of_blogs"`
	Followers  int       `json:"followers"`
	Followings int       `json:"followings"`
}

type FollowUser struct {
	FullName string `json:"fullName"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

type Followers struct {
	FollowersList []FollowUser `json:"followers_list"`
	FollowingList []FollowUser `json:"following_list"`
}
