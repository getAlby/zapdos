import React from "react";
import { Transfer } from "../../helpers";
import './style.css';

interface Props {
    transaction: Transfer;
    target: string;
}

const TickerMessage: React.FC<Props> = ({ transaction, target }) => {
    return (
        <div className="tickerMessage">
            <span className="tickerMessageActor">{transaction.payer_name}</span>
            <span> tipped</span>
            <span> {transaction.amount} SAT</span>
                    
        </div>
    );

}

export default TickerMessage;
