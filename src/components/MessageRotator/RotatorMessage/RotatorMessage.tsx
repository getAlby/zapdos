import React from "react";
import { Transfer } from "../../helpers";
import './style.css';

interface Props {
    transaction: Transfer ;
    target: string;
}
const RotatorMessage: React.FC<Props> = ({ transaction, target }) => {
    return (
        <div className="rotatorMessage">
            <span className="rotatorMessageActor">{transaction.payer_name}</span>
            <span> tipped</span>
            <span> {transaction.amount} SAT</span>
            {
                transaction.comment != null
                ? <span>: "{transaction.comment}"</span>
                : <div></div>
            }
        </div>
    );

}

export default RotatorMessage;
