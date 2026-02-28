package models

import "time"

type Blog struct {
	Title       string    `firestore:"title" json:"title"`
	BlogContent string    `firestore:"blog_content" json:"blog_content"`
	AuthorID    string    `firestore:"author_id" json:"author_id"`
	CreatedAt   time.Time `firestore:"created_at" json:"created_at"`
	UpdatedAt   time.Time `firestore:"updated_at" json:"updated_at"`
	Tags        []string  `firestore:"tags" json:"tags"`
	BlogImage   string    `firestore:"blog_image" json:"blog_image"`
	Category    string    `firestore:"category" json:"category"`
	Views       int       `firestore:"views" json:"views"`
	Likes       int       `firestore:"likes" json:"likes"`
	Comments    int       `firestore:"comments" json:"comments"`
	Featured    bool      `firestore:"featured" json:"featured"`
	Trending    bool      `firestore:"trending" json:"trending"`
}
