import React, { useEffect, useState } from "react";
import { useInterval } from "../../helpers";
import GenerateLinkPage from "../GenerateLinkPage/GenerateLinkPage";
import { Config, Transfer, TYPE_TRANSFER } from "../helpers";

const API_URL = Config.apiHost;
const accessToken = window.localStorage.getItem("access_token");

// Parameters for displaying
const POLLING_INTERVAL = 3000;

const Dashboard: React.FC = () => {

  // Now minus one hour
  const startDate = new Date();
  startDate.setTime(startDate.getTime() - 100 * 60 * 60 * 1000);

  const [transfers, setTransfers] = useState<any>([]);
  const [lastId, setLastId] = useState(startDate.toISOString());

  let loadedHiddenTransactions: string[] = [];
  fetch("https://zapdos-albylabs.vercel.app/api/list", {
    method: "get",
    headers: {
      Authorization: accessToken!
    }
  }).then(
    (res) => res.json()
  ).then(
    (data) => {
      loadedHiddenTransactions = data
    }
  )
  //var hiddenStorage = window.localStorage.getItem('hiddenTransactions');
  //if(hiddenStorage) {
  //  loadedHiddenTransactions = JSON.parse(hiddenStorage);
  //}
  const [hiddenTransactions, setHiddenTransactions] = useState(loadedHiddenTransactions);

  useEffect(() => {

  });

  useInterval(() => {
    fetch(API_URL + "/invoices/incoming", {
      method: "get",
      headers: { Authorization: accessToken! },
    })
      .then((res) => res.json())
      .then((data) => {
        const newUserTransactions = data
          .filter((transaction: Transfer) => transaction.settled_at > lastId)
          .map((transaction: Transfer) => ({
            ...transaction,
            type: TYPE_TRANSFER,
            hidden: isHidden(transaction.identifier),
            payer_name:
              transaction.payer_name == null
                ? "anonymous"
                : transaction.payer_name,
          }))
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

  function toggleTransaction(e: any, transaction: Transfer) {
    e.preventDefault();

    transaction.hidden = !transaction.hidden;
    const endpoint = transaction.hidden? "/api/insert?payment_id=" + transaction.identifier : "/api/delete?payment_id=" + transaction.identifier

    let hiddenTransactions: string[] = [];
    fetch("https://zapdos-albylabs.vercel.app/api/list", {
      method: "get",
      headers: {
        Authorization: accessToken!
      }
    }).then(
      (res) => res.json()
    ).then(
      (data) => {
        hiddenTransactions = data
      }
    )
    //var hiddenStorage = window.localStorage.getItem('hiddenTransactions');
    //if(hiddenStorage) {
    //  hiddenTransactions = JSON.parse(hiddenStorage);
    //}
    if(!hiddenTransactions.includes(transaction.identifier)) {
      hiddenTransactions.push(transaction.identifier);
    }

    setHiddenTransactions(hiddenTransactions);
    //window.localStorage.setItem('hiddenTransactions', JSON.stringify(hiddenTransactions));
    fetch("https://zapdos-albylabs.vercel.app" + endpoint, {
      method: "post",
      headers: {
        Authorization: accessToken!
      }
    })
  }

  function isHidden(id: string) {
    let hiddenTransactions = [];
    var hiddenStorage = window.localStorage.getItem('hiddenTransactions');
    if(hiddenStorage) {
      hiddenTransactions = JSON.parse(hiddenStorage);
    }

    return hiddenTransactions.includes(id);
  }

  console.log(hiddenTransactions);
  return (
    <div className="container mx-auto">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-column baseline my-4">
          <h2 className="grow text-xl">Dashboard</h2>
          <a href="/overlay" target="_blank" className="text-white hover:text-grey-500 px-3 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600" aria-current="page">
            📤 Open overlay
          </a>
        </div>
        <div className="w-50 bg-white shadow rounded-lg p-4 sm:p-6 h-full">
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200">
              {transfers.length == 0 && <li className="py-3 sm:py-4">No transactions found.</li>}
              {transfers.map((transfer: any) => {
                return (
                  <li key={transfer.identifier} className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img className="h-8 w-8 rounded-full" src="https://ui-avatars.com/api/?background=cccccc&amp;name=" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {transfer.comment}
                        </p>
                        <p className="text-sm font-medium text-gray-600" title="test">
                          {transfer.payer_name}
                        </p>
                      </div>
                      <div className="flex-0 text-right">
                        <p className="text-sm text-base font-semibold text-gray-900">
                          {transfer.amount} sats
                        </p>
                        <p className="text-sm text-gray-600">
                          {transfer.settled_at}
                        </p>
                      </div>
                      <div className="flex-0 text-right">
                        <p className="text-sm text-base">
                          <a href="" onClick={(e) => toggleTransaction(e, transfer)}>
                            {!transfer.hidden && <span>👀</span>} 
                            {transfer.hidden && <span>🙈</span>} 
                          </a>
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}

            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;