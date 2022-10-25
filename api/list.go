package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	supa "github.com/nedpals/supabase-go"
)

var supaClient *supa.Client

const tableName = "zapdos"

func ListHandler(w http.ResponseWriter, r *http.Request) {
	user_token := r.Header.Get("Authorization")
	var result []map[string]interface{}
	err := supaClient.DB.From(tableName).Select("*").Eq("user_id", user_token).Execute(&result)
	if err != nil {
		fmt.Printf("something went wrong: %s \n", err.Error())
	}
	err = json.NewEncoder(w).Encode(result)
	if err != nil {
		fmt.Printf("something went wrong: %s \n", err.Error())
	}
}

func init() {
	supabaseUrl := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_KEY")
	supaClient = supa.CreateClient(supabaseUrl, supabaseKey)
}
