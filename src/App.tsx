import React, {useState} from 'react';
import './App.css';
import {useInterval} from "./helpers";
import { Transfer, TYPE_TRANSFER} from "./components/helpers";
import MessageList from "./components/MessageList/MessageList";
import Login from "./components/Login";
import GenerateLinkPage from './components/GenerateLinkPage';

//const API_URL = 'http://185.20.226.75:5050';
const API_URL = 'https://app.regtest.getalby.com/api';
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcyLCJpc1JlZnJlc2giOmZhbHNlLCJleHAiOjE2NjQxMDIwNzN9.8KLzSlTkO7_4eBeK_ZIYaT0hUtV76TF5YJpI4n-TnQ8'

// Parameters for displaying
const POLLING_INTERVAL = 3000;
const TITLE = 'Lightning Donations';
// var EXCHANGE_RATE = 168;


const App = () => {
    const [ transfers, setTransfers ] = useState<any>([]);
    const [ lastId, setLastId ] = useState(new Date().toISOString());
    const query = window.location.search;
    const params = new URLSearchParams(query);
    const code = params.get("code")
    const accessToken = params.get("access_token")
    const refreshToken = params.get("refresh_token")


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
                code == null && <Login></Login>
            }
            {
                code != null && <GenerateLinkPage></GenerateLinkPage>
            }
            {
                accessToken != null && refreshToken != null && <MessageList title={''} transfers={[]}></MessageList>
            }
        </div>
    );
}

export default App;