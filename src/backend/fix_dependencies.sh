
#!/bin/bash

cd src/backend

# Initialize the module if needed
go mod tidy

# Download and verify specific dependencies
go get github.com/lib/pq
go get golang.org/x/crypto/bcrypt
go get github.com/dgrijalva/jwt-go
go get github.com/gorilla/mux
go get gopkg.in/gomail.v2
go get github.com/joho/godotenv
go get github.com/rs/cors

# Verify all modules are properly downloaded
go mod verify

echo "Dependencies have been downloaded successfully!"
