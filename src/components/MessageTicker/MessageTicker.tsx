import React, {useEffect, useState} from "react";
import { Transfer} from "../helpers";
import './style.css';
import Ticker from "react-ticker";
import {useInterval} from "../../helpers";
import TickerMessage from "./TickerMessage/TickerMessage";

interface Props {
    title: string;
    transfers: Transfer[] ;
}

const CHECK_INTERVAL = 2000;

const MessageTicker: React.FC<Props> = ({ title, transfers }) => {
    const [ oldTransfersCount, setOldTransfersCount ] = useState(0);
    const [ newTransfers, setNewTransfers ] = useState<any>([]);
    const [ currentPopup, setCurrentPopup ] = useState<any>();

    //on transfers update
    useEffect(() => {
        console.log("NEW TRANSFER!");
       if (transfers.length > oldTransfersCount) {
           setNewTransfers([ ...newTransfers, transfers.slice(oldTransfersCount) ]);
           setOldTransfersCount(transfers.length);
       }
    }, [ transfers ]);
    const rotate = () => {
        console.log("ROTATE!");
        if (newTransfers.length) {
            setCurrentPopup(newTransfers[0]);
            setNewTransfers(newTransfers.slice(1));
        } else {
            setCurrentPopup(null);
        }
    }
    useInterval(rotate, CHECK_INTERVAL);

    const hasTransfers = transfers && transfers.length;
    return (
        <div className="ticker">
            {
                currentPopup &&
                    <TickerMessage transaction={currentPopup} target="@dvoroneca" />
            }
            <div className="tickerTitle"><span style={{ backgroundColor: "white" }}>{title}</span></div>
            {
                hasTransfers ? (
                    <div style={{ position: 'absolute', left: '183px', bottom: 0, width: '100%' }}>
                        <Ticker offset="run-in" height={60}>
                            {({ index}) => transfers.length < index
                                    ? <TickerMessage transaction={transfers[index]} target="@dvoroneca" />
                                    : null

                            }
                        </Ticker>
                    </div>
                ) : null
            }
        </div>
    );
}

export default MessageTicker;