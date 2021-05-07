import React, {useState} from 'react';
import './App.css';
import {useInterval} from "./helpers";
import {BuySellTransaction, Transfer, TYPE_BUYSELL, TYPE_TRANSFER} from "./components/helpers";
import MessageList from "./components/messageList/MessageList";

const REQUEST_DATA = { "last_id": -1 };
//const API_URL = 'http://185.20.226.75:5050';
const API_URL = 'https://lljsiwnnhg.execute-api.eu-central-1.amazonaws.com';

// Parameters for displaying
const TARGET_PK = 'BC1YLg7BTSVWu4UUVZUrpGjUQgecTmeZVcbCTZs1FX1mWipSbZKyJ2j'; //todo from page params if possible in obs
const POLLING_INTERVAL = 3000;
const TITLE = '@alisher';
// var EXCHANGE_RATE = 168;


const MESSAGES_TYPE_LIST = 'list';
// const MESSAGES_TYPE_POPUP = 'popup';

const messagesType = MESSAGES_TYPE_LIST;

const App = () => {
    const [ transfers, setTransfers ] = useState<any>([]);
    // const [ newTransfersQueue, setNewTransfersQueue ] = useState([]);
    const [ lastId, setLastId ] = useState(-1);
    const [ coinsLastId, setCoinsLastId] = useState(-1);

    useInterval(() => {
        fetch(API_URL+'/mempool/transfer/get', { method: 'post', body: JSON.stringify(REQUEST_DATA) })
            .then(res => res.json())
            .then(data => {
                // filter only new transactions for target user
                const newUserTransactions = data.transactions
                    .filter((transaction: Transfer) =>  transaction.to_pk === TARGET_PK && transaction.id > lastId)
                    .map((transaction: Transfer) => ({ ...transaction, type: TYPE_TRANSFER }));
                if (newUserTransactions.length) {
                    setTransfers((prevTransfers: any) => [
                        ...newUserTransactions,
                        ...prevTransfers
                    ]);
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
                    .filter((transaction: BuySellTransaction) =>  transaction.target_pk === TARGET_PK && transaction.id > coinsLastId)
                    .map((transaction: Transfer) => ({ ...transaction, type: TYPE_BUYSELL }))
                if (newUserTransactions.length) {
                    setTransfers((prevTransfers: any) => [
                        ...newUserTransactions,
                        ...prevTransfers
                    ]);
                    setCoinsLastId(newUserTransactions[newUserTransactions.length - 1].id);
                }
            })
            .catch(e => console.log(e));
    }, POLLING_INTERVAL);

    return (
        <div className="App">
            {
                messagesType === MESSAGES_TYPE_LIST &&
                    <MessageList title={TITLE} transfers={transfers}/>
            }
        </div>
    );
}

export default App;