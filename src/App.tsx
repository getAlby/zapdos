import React, {useState} from 'react';
import './App.css';
import {useInterval} from "./helpers";
import { Transfer, TYPE_TRANSFER} from "./components/helpers";
import MessageList from "./components/MessageList/MessageList";
import MessageRotator from "./components/MessageRotator/MessageRotator";
import MessageTicker from "./components/MessageTicker/MessageTicker";

//const API_URL = 'http://185.20.226.75:5050';
const API_URL = 'https://app.regtest.getalby.com/api';
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcyLCJpc1JlZnJlc2giOmZhbHNlLCJleHAiOjE2NjQxMDIwNzN9.8KLzSlTkO7_4eBeK_ZIYaT0hUtV76TF5YJpI4n-TnQ8'

// Parameters for displaying
const POLLING_INTERVAL = 3000;
const TITLE = 'Lightning Donations';
// var EXCHANGE_RATE = 168;


const MESSAGES_TYPE_LIST = 'list';
const MESSAGES_TYPE_ROTATOR = 'rotator';
const MESSAGES_TYPE_TICKER = 'MessageTicker';

let messagesType = MESSAGES_TYPE_LIST;

const App = () => {
    const [ transfers, setTransfers ] = useState<any>([]);
    const [ lastId, setLastId ] = useState(new Date().toISOString());

    useInterval(() => {
        fetch(API_URL+'/invoices/incoming', { method: 'get' , headers: {'Authorization': authToken}})
            .then(res => res.json())
            .then(data => {
                console.log(lastId)
                // filter only new transactions for target user
                const newUserTransactions = data
                    .filter((transaction: Transfer) => transaction.settled_at > lastId)
                    .map((transaction: Transfer) => ({ ...transaction, type: TYPE_TRANSFER }))
                    .map((transaction: Transfer) => ({ ...transaction, payer_name: transaction.payer_name == null ? 'anonymous': transaction.payer_name}));
                if (newUserTransactions.length) {
                    setTransfers((prevTransfers: any) => [
                        ...newUserTransactions,
                        ...prevTransfers
                    ]);
                    setLastId(newUserTransactions[0].settled_at);
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
            {
                messagesType === MESSAGES_TYPE_ROTATOR &&
                    <MessageRotator title={TITLE} transfers={transfers} />
            }
            {
                messagesType === MESSAGES_TYPE_TICKER &&
                    <MessageTicker title={TITLE} transfers={transfers} />
            }
        </div>
    );
}

export default App;