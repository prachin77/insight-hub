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

// using entire "User" struct in type which
// will expose more data than required making
// operations slow , but to ease things up i'm doin now

type Followers struct {
	FollowersList []User `json:"followers_list"`
	FollowingList []User `json:"following_list"`
}
