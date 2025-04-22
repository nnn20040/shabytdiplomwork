
package models

import (
	"time"
)

var UserContextKey = "user_id"
type User struct {
	ID                 string     `json:"id"`
	Email              string     `json:"email"`
	Password           string     `json:"-"`
	FirstName          string     `json:"first_name"`
	LastName           string     `json:"last_name"`
	Name               string     `json:"name"`
	Role               string     `json:"role"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
	LastLogin          *time.Time `json:"last_login,omitempty"`
	ProfileImageURL    *string    `json:"profile_image_url,omitempty"`
	IsActive           bool       `json:"is_active"`
	LanguagePreference string     `json:"language_preference"`
}

type UserResponse struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	Name      string `json:"name"`
	LastName  string `json:"last_name"`
	Role      string `json:"role"`
}
