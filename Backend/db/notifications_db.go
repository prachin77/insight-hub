package db

import (
	"context"
	"errors"
	"sort"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/prachin77/insight-hub/models"
	"google.golang.org/api/iterator"
)

const notificationsCollection = "notifications"

func CreateNotification(ctx context.Context, notif *models.Notification) error {
	if FirestoreClient == nil {
		return errors.New("firestore client is not initialized")
	}

	notif.CreatedAt = time.Now()
	notif.IsRead = false
	docRef := FirestoreClient.Collection(notificationsCollection).NewDoc()
	notif.ID = docRef.ID

	_, err := docRef.Set(ctx, notif)
	return err
}

func GetNotifications(ctx context.Context, userID string) ([]models.Notification, error) {
	if FirestoreClient == nil {
		return nil, errors.New("firestore client is not initialized")
	}

	var notifications []models.Notification
	iter := FirestoreClient.Collection(notificationsCollection).
		Where("recipient", "==", userID).
		Documents(ctx)

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		var n models.Notification
		if err := doc.DataTo(&n); err != nil {
			continue
		}
		n.ID = doc.Ref.ID
		notifications = append(notifications, n)
	}

	// Sort in memory by CreatedAt descending
	sort.Slice(notifications, func(i, j int) bool {
		return notifications[i].CreatedAt.After(notifications[j].CreatedAt)
	})

	return notifications, nil
}

func MarkNotificationRead(ctx context.Context, id string) error {
	if FirestoreClient == nil {
		return errors.New("firestore client is not initialized")
	}

	_, err := FirestoreClient.Collection(notificationsCollection).Doc(id).Update(ctx, []firestore.Update{
		{Path: "is_read", Value: true},
	})
	return err
}

func MarkAllNotificationsRead(ctx context.Context, userID string) error {
	if FirestoreClient == nil {
		return errors.New("firestore client is not initialized")
	}

	iter := FirestoreClient.Collection(notificationsCollection).
		Where("recipient", "==", userID).
		Where("is_read", "==", false).
		Documents(ctx)

	batch := FirestoreClient.Batch()
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return err
		}
		batch.Update(doc.Ref, []firestore.Update{{Path: "is_read", Value: true}})
	}

	_, err := batch.Commit(ctx)
	return err
}

func GetUnreadCount(ctx context.Context, userID string) (int, error) {
	if FirestoreClient == nil {
		return 0, errors.New("firestore client is not initialized")
	}

	// Firestore doesn't support Count() natively in the Go SDK without using a separate query or aggregation
	// For simplicity, we'll just fetch unread ones and count them, or use a better way if available.
	iter := FirestoreClient.Collection(notificationsCollection).
		Where("recipient", "==", userID).
		Where("is_read", "==", false).
		Select(). // Only fetch minimal data
		Documents(ctx)

	count := 0
	for {
		_, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return 0, err
		}
		count++
	}
	return count, nil
}
