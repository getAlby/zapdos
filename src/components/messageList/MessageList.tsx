import ListMessage from "./listMessage/ListMessage";
import React from "react";
import {BuySellTransaction, Transfer} from "../helpers";
import './style.css';

interface Props {
    title: string;
    transfers: Transfer[] | BuySellTransaction[];
}

const CELLS_MAX_COUNT = 30;

const MessageList: React.FC<Props> = ({ title, transfers }) => {
    return (
        <div className="messageList">
            <div className = "title" >{title}</div>
            {
                transfers &&
                transfers.slice(0, CELLS_MAX_COUNT).map((transaction: any) => {
                    return <ListMessage transaction={transaction} />;
                })
            }
        </div>
    );
}

export default MessageList;