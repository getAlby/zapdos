import ListMessage from "./ListMessage/ListMessage";
import React, { useState } from "react";
import { BuySellTransaction, Transfer, TYPE_TRANSFER } from "../helpers";
import "./style.css";
import { useInterval } from "../../helpers";
import { Config } from "../helpers";

interface Props {
  title: string;
  lastTransfer?: Transfer;
}

const CELLS_MAX_COUNT = 10;
const API_URL = Config.apiHost;
const query = window.location.search;
const params = new URLSearchParams(query);
const accessToken = params.get("access_token");
const minDonationAmount = Number(params.get("min_amount")) || 0;

// Parameters for displaying
const POLLING_INTERVAL = 3000
const SHOW_INTERVAL = Number(params.get("timeout")) * 1000  || 20000;

const hiddenTransactionFilter = function(transaction: any) {
  //var hidden = window.localStorage.getItem('hiddenTransactions');
  //if(hidden) {
  //  var hiddenTransactions = JSON.parse(hidden);
  //  if(hiddenTransactions.includes(transaction.identifier)) {
  //    return false;
  //  }
  //}
  let hiddenTransactions: string[] = [];
  return !hiddenTransactions.includes(transaction.identifier);
}

const MessageList: React.FC<Props> = ({}) => {
  const [lastTransfer, setLastTransfer] = useState<Transfer>({
    identifier: "",
    amount: 0,
    payer_name: "",
    type: "",
    comment: "",
    settled_at: "",
    hidden: false
  });
  const [showMessage, setShowMessage] = useState<boolean>(false);
  //const [lastId, setLastId] = useState(new Date().toISOString());

  useInterval(() => {
    console.log("hello")
    fetch(API_URL + "/invoices/incoming", {
      method: "get",
      headers: { Authorization: accessToken! },
    })
      .then((res) => res.json())
      .then((data) => {
        const newUserTransactions = data
          .map((transaction: Transfer) => ({
            ...transaction,
            type: TYPE_TRANSFER,
            payer_name:
              transaction.payer_name == null
                ? "anonymous"
                : transaction.payer_name,
          }));
        if (lastTransfer && newUserTransactions.length && newUserTransactions[0].comment !== lastTransfer.comment && newUserTransactions[0].amount > minDonationAmount){ 
          console.log(newUserTransactions[0].comment)
          setLastTransfer(newUserTransactions[0])
          setShowMessage(true)
          setTimeout(() => {
            setShowMessage(false) 
          }, SHOW_INTERVAL);
        }
      })
      .catch((e) => console.log(e));
  }, POLLING_INTERVAL);

  return (
    <div>
    {showMessage && <ListMessage transaction={lastTransfer!}></ListMessage>}
    </div>
  );
};

export default MessageList;
