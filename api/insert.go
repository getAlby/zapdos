package handler

import (
	"encoding/json"
	"net/http"
)

type BlockListItem struct {
	PaymentID string `json:"payment_id"`
	UserID    string `json:"user_id,omitempty"`
}

func InsertHandler(w http.ResponseWriter, r *http.Request) {
	userToken := r.Header.Get("Authorization")
	paymentId := r.URL.Query().Get("payment_id")
	supaClient.DB.From(tableName).Insert(&BlockListItem{
		PaymentID: paymentId,
		UserID:    userToken,
	}).Execute(nil)
	json.NewEncoder(w).Encode(&BlockListItem{
		PaymentID: paymentId,
	})
}
