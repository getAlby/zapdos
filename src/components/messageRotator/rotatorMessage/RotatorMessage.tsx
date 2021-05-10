import React from "react";
import { BuySellTransaction, Transfer } from "../../helpers";
import './style.css';

interface Props {
    transaction: Transfer | BuySellTransaction;
    target: string;
}

function hasKey<O>(obj: O, key: keyof any): key is keyof O {
    return key in obj
}
const buy_sell_actions = {
    buy: 'bought',
    sell: 'sold'
};

const RotatorMessage: React.FC<Props> = ({ transaction, target }) => {
    if (transaction.type === 'transfer') {
        return (
            <div className="rotatorMessage">
                <span className="rotatorMessageActor">@{transaction.from_username}</span>
                <span> tipped</span>
                {
                    transaction.coin
                        ? <span> {transaction.amount} {transaction.coin}</span>
                        : (
                            <>
                                <span> ${transaction.amount} USD to </span>
                                <span className="rotatorMessageActor">{target}</span>
                            </>
                        )
                }
            </div>
        );
    }

    if (transaction.type === 'buysell' && transaction.action === 'buy') {
        return (
            <div className="rotatorMessage">
                <span className="rotatorMessageActor">@{transaction.actor}</span>
                <span> {hasKey(buy_sell_actions, transaction.action) ? buy_sell_actions[transaction.action] : "---"}</span>
                <span> ${transaction.amount} USD of </span>
                <span className="rotatorMessageActor">{target}</span>
            </div>
        )
    }

    return null;
}

export default RotatorMessage;
