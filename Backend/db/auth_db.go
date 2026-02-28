package db

import (
	"context"
	"errors"
	"time"

	"github.com/prachin77/insight-hub/models"
	"golang.org/x/crypto/bcrypt"
)

const usersCollection = "users"

// CreateUser stores a new user in Firestore after basic checks and returns the document ID.
func CreateUser(ctx context.Context, user *models.User) (string, error) {
	if FirestoreClient == nil {
		return "", errors.New("firestore client is not initialized")
	}

	// Check if a user with the same email already exists
	exists, err := userExists(ctx, user.Email)
	if err != nil {
		return "", err
	}
	if exists {
		return "", errors.New("user with this email already exists")
	}

	// Hash the password before storing
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	user.Password = string(hashedPassword)
	user.CreatedAt = time.Now()

	docRef, _, err := FirestoreClient.Collection(usersCollection).Add(ctx, user)
	if err != nil {
		return "", err
	}
	return docRef.ID, nil
}

// ValidateUser checks user credentials and returns the document ID.
func ValidateUser(ctx context.Context, email, password string) (string, error) {
	if FirestoreClient == nil {
		return "", errors.New("firestore client is not initialized")
	}

	doc, err := FirestoreClient.Collection(usersCollection).Where("Email", "==", email).Limit(1).Documents(ctx).Next()
	if err != nil {
		return "", errors.New("invalid email or password")
	}

	var stored models.User
	if err := doc.DataTo(&stored); err != nil {
		return "", errors.New("invalid user data")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(stored.Password), []byte(password)); err != nil {
		return "", errors.New("invalid email or password")
	}

	return doc.Ref.ID, nil
}

// GetUserID retrieves the document ID for a given email.
func GetUserID(ctx context.Context, email string) (string, error) {
	if FirestoreClient == nil {
		return "", errors.New("firestore client is not initialized")
	}

	doc, err := FirestoreClient.Collection(usersCollection).Where("Email", "==", email).Limit(1).Documents(ctx).Next()
	if err != nil {
		return "", errors.New("user not found")
	}

	return doc.Ref.ID, nil
}

func userExists(ctx context.Context, email string) (bool, error) {
	if FirestoreClient == nil {
		return false, errors.New("firestore client is not initialized")
	}

	iter := FirestoreClient.Collection(usersCollection).Where("Email", "==", email).Limit(1).Documents(ctx)
	_, err := iter.Next()
	if err != nil {
		return false, nil
	}
	return true, nil
}
