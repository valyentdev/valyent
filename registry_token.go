package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
)

func main() {
	authConfig := struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}{
		Username: "username",
		Password: "password",
	}
	encodedJSON, err := json.Marshal(authConfig)
	if err != nil {
		panic(err)
	}
	authStr := base64.URLEncoding.EncodeToString(encodedJSON)

	fmt.Println(authStr)
}
