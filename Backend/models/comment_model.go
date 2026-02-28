package models

import "time"

type Comment struct {
	CommentID string    `firestore:"comment_id" json:"comment_id"`
	BlogID    string    `firestore:"blog_id" json:"blog_id"`
	AuthorID  string    `firestore:"author_id" json:"author_id"`
	ParentID  string    `firestore:"parent_id" json:"parent_id"` // for nested/threaded comments
	Content   string    `firestore:"content" json:"content"`
	Likes     int       `firestore:"likes" json:"likes"`
	CreatedAt time.Time `firestore:"created_at" json:"created_at"`
}
