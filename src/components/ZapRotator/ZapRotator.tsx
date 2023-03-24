import React, { useEffect, useState } from "react";
import { Transfer, TYPE_TRANSFER } from "../helpers";
import "./style.css";
import { useInterval } from "../../helpers";
import { Config } from "../helpers";
import Zap from "./Zap";
import { BadWordFilter } from "../../helpers/badwordfilter";
import { AnimatePresence } from "framer-motion";

interface Props {
  lastTransfer?: Transfer;
}

const API_URL = Config.apiHost;
const query = window.location.search;
const params = new URLSearchParams(query);
const minDonationAmount = Number(params.get("min_amount")) || 0;

// Parameters for displaying
const POLLING_INTERVAL = 3000;
const REFRESH_INTERVAL = 3600 * 1000;

const filter = new BadWordFilter();

const ZapRotator: React.FC<Props> = () => {
  const [lastTransfer, setLastTransfer] = useState<Transfer>({
    identifier: "",
    amount: 0,
    payer_name: "",
    type: "",
    comment: "",
    settled_at: "",
    hidden: false,
  });
  const [transactions, setTransactions] = useState<Transfer[]>();
  const [accessToken, setAccessToken] = useState(params.get("access_token"));
  const [refreshToken, setRefreshToken] = useState(params.get("refresh_token"));
  const [lnAddress, setLnAddress] = useState<string>();

  useEffect(() => {
    fetch(API_URL + "/user/value4value", {
      method: "get",
      headers: { Authorization: accessToken! },
    })
      .then((res) => res.json())
      .then((data) => {
        setLnAddress(data.lightning_address)          
      })
      .catch((e) => console.log(e));
  }, []);

  useInterval(() => {
    fetch(
      API_URL +
        "/invoices/incoming?items=20" +
        (lastTransfer.identifier ? "&q[since]=" + lastTransfer.identifier : ""),
      {
        method: "get",
        headers: { Authorization: accessToken! },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const newUserTransactions = data.map((transaction: Transfer) => ({
          ...transaction,
          comment: transaction.comment && transaction.comment !== ""
            ? filter.cleanUtf8(transaction.comment)
            : null,
          type: TYPE_TRANSFER,
          payer_name:
            transaction.payer_name == null
              ? "anonymous"
              : transaction.payer_name,
        }));

        if (!newUserTransactions.length) return;

        setLastTransfer(newUserTransactions[0]);

        // Reverse them so the newest ones appear on top
        newUserTransactions.reverse();

        // Filter them for minimum transaction amounts
        const filtered = newUserTransactions.filter(
          (x: { amount: number }) => x.amount >= minDonationAmount
        );

        setTransactions([...(transactions ?? []), ...filtered]);
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
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
      });
  }, REFRESH_INTERVAL);

  function onEnd() {
    setTransactions(transactions?.slice(1));
  }

  return (
    <>
      {transactions && transactions.length > 0 && lnAddress && (
        <div className="m-5 h-8 overflow-hidden text-base">
          <AnimatePresence exitBeforeEnter>
            <Zap key={transactions[0].identifier} transaction={transactions[0]} onEnd={onEnd} lnAddress={lnAddress}></Zap>
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default ZapRotator;
