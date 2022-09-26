import React from "react";
import {Transfer} from "../../helpers";
import './style.css';

interface Props {
    transaction: Transfer ;
}

const ListMessage: React.FC<Props> = ({ transaction }) => {
    return (
        <div className="message">
            <span className="name">{transaction.payer_name}</span>
            <span className="amount"> {transaction.amount} SATS</span>
            {transaction.comment != null && 
                <span className="comment"> {transaction.comment}</span>}
        </div>
    );
}

export default ListMessage;