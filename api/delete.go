package handler

import (
	"encoding/json"
	"net/http"
)

func DeleteHandler(w http.ResponseWriter, r *http.Request) {
	userToken := r.Header.Get("Authorization")
	paymentId := r.URL.Query().Get("payment_id")
	supaClient.DB.From(tableName).Delete().Eq("user_id", userToken).Eq("payment_id", paymentId).Execute(nil)
	json.NewEncoder(w).Encode(&BlockListItem{
		PaymentID: paymentId,
	})
}
