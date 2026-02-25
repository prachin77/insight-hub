package db

import (
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
)

var (
	FirestoreClient *firestore.Client
)

const (
	UsersCollection = "users"
)

func Init() error {
	credentialsPath := "db/Firebase_Credentials.json"

	// Initialize Firestore
	if err := InitFirestore(credentialsPath); err != nil {
		return fmt.Errorf("❌ Firestore initialization failed: %v", err)
	}

	log.Println("✅ Firestore initialized successfully")
	return nil
}

func InitFirestore(credentialsPath string) error {
	ctx := context.Background()

	client, err := firestore.NewClient(ctx, "blog-web-d79ed", option.WithCredentialsFile(credentialsPath))
	if err != nil {
		return err
	}

	FirestoreClient = client
	log.Println("✅ Firestore client initialized")
	return nil
}

func Close() {
	if FirestoreClient != nil {
		err := FirestoreClient.Close()
		if err != nil {
			log.Printf("⚠️ Error closing Firestore: %v", err)
		} else {
			log.Println("✅ Firestore client closed")
		}
	}
}
