import React from "react";
import {Transfer} from "../../helpers";
import './style.css';

interface Props {
    transaction: Transfer ;
}

const ListMessage: React.FC<Props> = ({ transaction }) => {
    return (
        <div className="message">
            <span className="messageActor">{transaction.payer_name}</span>
            <div className="action">
                <span> sent</span>
                <span> {transaction.amount} SATs</span>
            </div>
            {
                transaction.comment != null
                ? <span>{transaction.comment}</span>
                : <div></div>
            }
        </div>
    );
}

export default ListMessage;