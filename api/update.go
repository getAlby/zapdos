package handler

import (
	"encoding/json"
	"net/http"
)

func UpdateHandler(w http.ResponseWriter, r *http.Request) {
	//todo
	var result map[string]interface{}
	supaClient.DB.From("zapdos").Select("*").Single().Execute(&result)
	json.NewEncoder(w).Encode(result)
}
