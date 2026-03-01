package db

import (
	"context"
	"errors"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/prachin77/insight-hub/models"
	"google.golang.org/api/iterator"
)

const blogsCollection = "blogs"

// CreateBlog stores a new blog post in Firestore and returns the document ID.
func CreateBlog(ctx context.Context, blog *models.Blog) (string, error) {
	if FirestoreClient == nil {
		return "", errors.New("firestore client is not initialized")
	}

	blog.CreatedAt = time.Now()
	blog.UpdatedAt = time.Now()
	blog.Likes = 0
	blog.Comments = 0
	blog.Views = 0

	docRef, _, err := FirestoreClient.Collection(blogsCollection).Add(ctx, blog)
	if err != nil {
		return "", err
	}

	// Increment user's blog count
	if blog.AuthorID != "" {
		_, err = FirestoreClient.Collection("users").Doc(blog.AuthorID).Update(ctx, []firestore.Update{
			{Path: "NoOfBlogs", Value: firestore.Increment(1)},
		})
		if err != nil {
			// Log error but don't fail blog creation if increment fails
			// Optional: you might want to return this error instead
		}
	}

	return docRef.ID, nil
}

// GetBlogID retrieves the document ID for a given title.
func GetBlogID(ctx context.Context, title string) (string, error) {
	if FirestoreClient == nil {
		return "", errors.New("firestore client is not initialized")
	}

	doc, err := FirestoreClient.Collection(blogsCollection).Where("title", "==", title).Limit(1).Documents(ctx).Next()
	if err != nil {
		return "", errors.New("blog not found")
	}

	return doc.Ref.ID, nil
}

// GetAllBlogs fetches all blogs from Firestore.
func GetAllBlogs(ctx context.Context) ([]models.Blog, error) {
	if FirestoreClient == nil {
		return nil, errors.New("firestore client is not initialized")
	}

	var blogs []models.Blog
	iter := FirestoreClient.Collection(blogsCollection).OrderBy("created_at", firestore.Desc).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		var b models.Blog
		if err := doc.DataTo(&b); err != nil {
			continue
		}
		b.ID = doc.Ref.ID

		// Fetch author details
		userDoc, err := FirestoreClient.Collection("users").Doc(b.AuthorID).Get(ctx)
		if err == nil {
			var u models.User
			if err := userDoc.DataTo(&u); err == nil {
				b.AuthorName = u.FullName
				b.AuthorUsername = u.Username
			}
		} else {
			b.AuthorName = "Unknown Author"
			b.AuthorUsername = "unknown"
		}

		blogs = append(blogs, b)
	}
	return blogs, nil
}

// TitleExists checks if a blog with the same title already exists.
func TitleExists(ctx context.Context, title string) (bool, error) {
	if FirestoreClient == nil {
		return false, errors.New("firestore client is not initialized")
	}

	iter := FirestoreClient.Collection(blogsCollection).Where("title", "==", title).Limit(1).Documents(ctx)
	_, err := iter.Next()
	if err != nil {
		return false, nil
	}
	return true, nil
}

// IncrementViews increases the view count for a blog with the given title.
func IncrementViews(ctx context.Context, title string) error {
	if FirestoreClient == nil {
		return errors.New("firestore client is not initialized")
	}

	doc, err := FirestoreClient.Collection(blogsCollection).Where("title", "==", title).Limit(1).Documents(ctx).Next()
	if err != nil {
		return errors.New("blog not found")
	}

	_, err = doc.Ref.Update(ctx, []firestore.Update{
		{Path: "views", Value: firestore.Increment(1)},
	})
	return err
}
