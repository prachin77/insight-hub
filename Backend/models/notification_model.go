package models

import "time"

type NotificationType string

const (
	NotificationTypeLike    NotificationType = "like"
	NotificationTypeComment NotificationType = "comment"
	NotificationTypeFollow  NotificationType = "follow"
	NotificationTypeBlog    NotificationType = "blog"
)

type Notification struct {
	ID        string           `firestore:"id" json:"id"`
	Recipient string           `firestore:"recipient" json:"recipient"` // User ID of the notification receiver
	Sender    string           `firestore:"sender" json:"sender"`       // Username or ID of the person triggering it
	Type      NotificationType `firestore:"type" json:"type"`
	Message   string           `firestore:"message" json:"message"`
	BlogID    string           `firestore:"blog_id,omitempty" json:"blog_id,omitempty"`
	CreatedAt time.Time        `firestore:"created_at" json:"created_at"`
	IsRead    bool             `firestore:"is_read" json:"is_read"`
}
