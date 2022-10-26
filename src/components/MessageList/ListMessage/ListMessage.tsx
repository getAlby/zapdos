import React from "react";
import {Transfer} from "../../helpers";
import './style.css';

interface Props {
    transaction: Transfer ;
}

const ListMessage: React.FC<Props> = ({ transaction }) => {
    return (
        <div className="message">
        <div className="name">
            <div>
                {transaction.payer_name} paid  {transaction.amount} sats
            </div>
            <div>
            {transaction.comment != null && 
                <span className="comment"> {transaction.comment}</span>}
            </div>
        </div>
        </div>
    );
}

export default ListMessage;