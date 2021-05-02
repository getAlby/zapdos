import React, {useState} from 'react';
import './App.css';
import {useInterval} from "./helpers";

const REQUEST_DATA = { "last_id": -1 };
//const API_URL = 'http://185.20.226.75:5050';
const API_URL = 'https://lljsiwnnhg.execute-api.eu-central-1.amazonaws.com';

// Parameters for displaying
const TARGET_PK = 'BC1YLg7BTSVWu4UUVZUrpGjUQgecTmeZVcbCTZs1FX1mWipSbZKyJ2j'; //todo from page params if possible in obs
const POLLING_INTERVAL = 3000;
const TITLE = '@alisher';
// var EXCHANGE_RATE = 168;

const TYPE_TRANSFER = "transfer";
const TYPE_BUYSELL = "buysell";

//Transaction interface
interface Transfer {
    id: number,
    amount: number,
    from_pk: string,
    from_username: string,
    to_pk: string,
    to_username: string,
    coin: string,
}

type BuySellKey = 'buy' | 'sell'

interface BuySellTransaction {
    id: number,
    amount: number,
    action: BuySellKey,
    actor_pk: string,
    actor: string,
    target_pk: string
}

function hasKey<O>(obj: O, key: keyof any): key is keyof O {
    return key in obj
}
const buy_sell_actions = {
    buy: 'bought coins on',
    sell: 'sold coins on'
};

const App = () => {
    const [ transfers, setTransfers ] = useState<any>([]);
    const [ lastId, setLastId ] = useState(-1);
    const [ coinsLastId, setCoinsLastId] = useState(-1);

    useInterval(() => {
        fetch(API_URL+'/mempool/transfer/get', { method: 'post', body: JSON.stringify(REQUEST_DATA) })
            .then(res => res.json())
            .then(data => {
                // filter only new transactions for target user
                const newUserTransactions = data.transactions
                    .filter((transaction: Transfer) => transaction.to_pk === TARGET_PK && transaction.id > lastId)
                    .map((transaction: Transfer) => ({ ...transaction, type: TYPE_TRANSFER }));
                if (newUserTransactions.length) {
                    setTransfers([ ...transfers, ...newUserTransactions ]);
                    setLastId(newUserTransactions[newUserTransactions.length - 1].id);
                }
            })
            .catch(e => console.log(e));
        fetch(API_URL+'/mempool/coins/get', { method: 'post', body: JSON.stringify(REQUEST_DATA) })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                // filter only new transactions for target user
                const newUserTransactions = data.transactions
                    .filter((transaction: BuySellTransaction) => transaction.target_pk === TARGET_PK && transaction.id > coinsLastId)
                    .map((transaction: Transfer) => ({ ...transaction, type: TYPE_BUYSELL }))
                if (newUserTransactions.length) {
                    setTransfers([ ...transfers, ...newUserTransactions ]);
                    setCoinsLastId(newUserTransactions[newUserTransactions.length - 1].id);
                }
            })
            .catch(e => console.log(e));
    }, POLLING_INTERVAL);

    const renderTransfer = (transaction: Transfer) => {
        return (
            <div className="message">
                <span className="messageActor">@{transaction.from_username}</span>
                <div className="action">
                    <span> sent</span>
                    {
                        transaction.coin
                            ? <span> {transaction.amount} {transaction.coin}</span>
                            : <span> ${transaction.amount} USD</span>
                    }
                </div>
            </div>
        )
    };

    const renderCoinAction = (transaction: BuySellTransaction) => {
        return (
            <div className="message">
                <span className="messageActor">@{transaction.actor}</span>
                <div className="action">
                    <span> {hasKey(buy_sell_actions, transaction.action) ? buy_sell_actions[transaction.action] : "---"}</span>
                    <span> ${transaction.amount} USD</span>
                </div>
            </div>
        )
    };

    return (
        <div className="App">
            <div className="title">{TITLE}</div>
            {
                transfers &&
                transfers.slice(0).reverse().map((transaction: any) => {
                    if (transaction.type === TYPE_BUYSELL && transaction.action === 'buy') {
                        return renderCoinAction(transaction);
                    }
                    else if (transaction.type === TYPE_TRANSFER) {
                        return renderTransfer(transaction);
                    }
                    return null;
                })
            }
        </div>
    );
}

export default App;