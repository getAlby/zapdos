import Message from "../message/Message";
import React from "react";
import {BuySellTransaction, Transfer} from "../helpers";

interface Props {
    title: string;
    transfers: Transfer[] | BuySellTransaction[];
}

const CELLS_MAX_COUNT = 30;

const MessageList: React.FC<Props> = ({ title, transfers }) => {
    return (
        <>
            <div className = "title" >{title}</div>
            {
                transfers &&
                transfers.slice(0, CELLS_MAX_COUNT).map((transaction: any) => {
                    return <Message transaction = {transaction} />;
                })
            }
        </>
    );
}

export default MessageList;