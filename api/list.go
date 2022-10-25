package handler

import (
	"encoding/json"
	"net/http"
	"os"

	supa "github.com/nedpals/supabase-go"
)

var supaClient *supa.Client

func ListHandler(w http.ResponseWriter, r *http.Request) {
	var result map[string]interface{}
	supaClient.DB.From("zapdos").Select("*").Single().Execute(&result)
	json.NewEncoder(w).Encode(result)
}

func init() {
	supabaseUrl := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_KEY")
	supaClient = supa.CreateClient(supabaseUrl, supabaseKey)
}
