import React, { useState } from "react";
import { Transfer, TYPE_TRANSFER } from "../helpers";
import "./style.css";
import { useInterval } from "../../helpers";
import { Config } from "../helpers";
import toast from "react-hot-toast";
import Filter from "bad-words";
import { Toaster } from "react-hot-toast";

interface Props {
  title: string;
  lastTransfer?: Transfer;
}

const API_URL = Config.apiHost;
const query = window.location.search;
const params = new URLSearchParams(query);
const minDonationAmount = Number(params.get("min_amount")) || 0;

// Parameters for displaying
const POLLING_INTERVAL = 10000;
const REFRESH_INTERVAL = 3600 * 504;
const SHOW_INTERVAL = Number(params.get("timeout")) * 1000 || 20000;

// https://github.com/web-mech/badwords/issues/93
class FilterHacked extends Filter {
  cleanHacked(string: string) {
      try {
          return this.clean(string);
      } catch {
          const joinMatch = this.splitRegex.exec(string);
          const joinString = (joinMatch && joinMatch[0]) || '';
          return string.split(this.splitRegex).map((word) => {
            return this.isProfane(word) ? this.replaceWord(word) : word;
          }).join(joinString);
      }
    }
}

const filter = new FilterHacked();

const MessageList: React.FC<Props> = () => {
  const [lastTransfer, setLastTransfer] = useState<Transfer>({
    identifier: "",
    amount: 0,
    payer_name: "",
    type: "",
    comment: "",
    settled_at: "",
    hidden: false,
  });
  const [accessToken, setAccessToken] = useState(params.get("access_token"));
  const [refreshToken, setRefreshToken] = useState(params.get("refresh_token"));

  useInterval(() => {

    if(!accessToken)
      return;

    fetch(API_URL + "/invoices/incoming?items=20" + (lastTransfer.identifier ? "&q[since]=" + lastTransfer.identifier : ""), {
      method: "get",
      headers: { Authorization: accessToken! },
    })
      .then((res) => res.json())
      .then((data) => {
        const newUserTransactions = data.map((transaction: Transfer) => ({
          ...transaction,
          type: TYPE_TRANSFER,
          payer_name:
            transaction.payer_name == null
              ? "anonymous"
              : transaction.payer_name,
        }));

        if(!newUserTransactions.length)
          return;

        setLastTransfer(newUserTransactions[0]);
        
        // Reverse them so the newest ones appear on top
        newUserTransactions.reverse();

        newUserTransactions.forEach((element: Transfer) => {
          if(element.amount < minDonationAmount)
            return;

          toast(<div>
                  <b>{element.payer_name}</b> just sent  {element.amount} sats
                  {element.comment && <>: {filter.cleanHacked(element.comment)}</>}
              </div>, {
            duration: SHOW_INTERVAL,
            icon: "⚡",
            style: {
              maxWidth: 600,
              fontSize: 18,
              padding: 5,
            }
          } );
        });
      })
      .catch((e) => console.log(e));
  }, POLLING_INTERVAL);

  useInterval(() => {
    const data = new FormData();
    data.append("client_id", Config.clientId);
    data.append("client_secret", Config.clientSecret);
    data.append("refresh_token", refreshToken!);
    data.append("grant_type", "refresh_token");
    fetch(API_URL + "/oauth/token", { method: "post", body: data })
      .then((res) => res.json())
      .then((data) => {
        setAccessToken(data.access_token)
        setRefreshToken(data.refresh_token)
      });
  }, REFRESH_INTERVAL);

  return (
    <Toaster position = "top-left" containerStyle={{ position: 'relative', marginTop: -30, marginLeft: 14}}/>
  );
};

export default MessageList;
