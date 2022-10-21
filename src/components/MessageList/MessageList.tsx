import ListMessage from "./ListMessage/ListMessage";
import React, { useState } from "react";
import { BuySellTransaction, Transfer, TYPE_TRANSFER } from "../helpers";
import "./style.css";
import { useInterval } from "../../helpers";
import { Config } from "../helpers";

interface Props {
  title: string;
  transfers: Transfer[] | BuySellTransaction[];
}

const CELLS_MAX_COUNT = 10;
const API_URL = Config.apiHost;
const query = window.location.search;
const params = new URLSearchParams(query);
const accessToken = params.get("access_token");

// Parameters for displaying
const POLLING_INTERVAL = 3000;

const MessageList: React.FC<Props> = ({}) => {
  const [transfers, setTransfers] = useState<any>([]);
  const [lastId, setLastId] = useState(new Date().toISOString());

  useInterval(() => {
    fetch(API_URL + "/invoices/incoming", {
      method: "get",
      headers: { Authorization: accessToken! },
    })
      .then((res) => res.json())
      .then((data) => {
        // filter only new transactions for target user
        const newUserTransactions = data
          .filter((transaction: Transfer) => transaction.settled_at > lastId)
          .map((transaction: Transfer) => ({
            ...transaction,
            type: TYPE_TRANSFER,
          }))
          .map((transaction: Transfer) => ({
            ...transaction,
            payer_name:
              transaction.payer_name == null
                ? "anonymous"
                : transaction.payer_name,
          }));
        if (newUserTransactions.length) {
          setTransfers((prevTransfers: any) => [
            ...newUserTransactions,
            ...prevTransfers,
          ]);
          setLastId(newUserTransactions[0].settled_at);
        }
      })
      .catch((e) => console.log(e));
  }, POLLING_INTERVAL);

  return (
    <div className="messageList marquee">
      <div className="messageListContent">
        {transfers &&
          transfers.slice(0, CELLS_MAX_COUNT).map((transaction: any) => {
            return <ListMessage transaction={transaction} />;
          })}
      </div>
    </div>
  );
};

export default MessageList;
