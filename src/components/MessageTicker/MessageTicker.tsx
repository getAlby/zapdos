import React from "react";
import {BuySellTransaction, Transfer} from "../helpers";
import './style.css';
import ListMessage from "../MessageList/ListMessage/ListMessage";
import Ticker from "react-ticker";
import TickerContent from "./TickerContent/TickerContent";

interface Props {
    title: string;
    transfers: Transfer[] | BuySellTransaction[];
}

const MessageTicker: React.FC<Props> = ({ title, transfers }) => {
    const hasTransfers = transfers && transfers.length;
    return (
        <div className="ticker">
            <div className="tickerTitle"><span style={{ backgroundColor: "white" }}>{title}</span></div>
            {
                hasTransfers ? (
                    <div style={{ position: 'absolute', left: '183px', bottom: 0, width: '100%' }}>
                        <Ticker offset="run-in" height={60}>
                            {() => <TickerContent transfers={transfers} />}
                        </Ticker>
                    </div>
                ) : null
            }
        </div>
    );
}

export default MessageTicker;