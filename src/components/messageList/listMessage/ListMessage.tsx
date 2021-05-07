import React from "react";
import {BuySellTransaction, Transfer} from "../../helpers";
import './style.css';

interface Props {
    transaction: Transfer | BuySellTransaction;
}

function hasKey<O>(obj: O, key: keyof any): key is keyof O {
    return key in obj
}
const buy_sell_actions = {
    buy: 'bought',
    sell: 'sold'
};

const ListMessage: React.FC<Props> = ({ transaction }) => {
    if (transaction.type === 'transfer') {
        return (
            <div className="message">
                <span className="messageActor">@{transaction.from_username}</span>
                <div className="action">
                    <span> sent</span>
                    {
                        transaction.coin
                            ? <span> {transaction.amount} {transaction.coin}</span>
                            : <span> {transaction.amount} USD</span>
                    }
                </div>
            </div>
        );
    }

    if (transaction.type === 'buysell' && transaction.action === 'buy') {
        return (
            <div className="message">
                <span className="messageActor">@{transaction.actor}</span>
                <div className="action">
                    <span> {hasKey(buy_sell_actions, transaction.action) ? buy_sell_actions[transaction.action] : "---"}</span>
                    <span> {transaction.amount} worth of coins</span>
                </div>
            </div>
        )
    }

    return null;
}

export default ListMessage;