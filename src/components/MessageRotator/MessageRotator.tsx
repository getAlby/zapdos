import React, {useState} from "react";
import { BuySellTransaction, Transfer } from "../helpers";
import './style.css';
import RotatorMessage from "./RotatorMessage/RotatorMessage";
import { useInterval } from "../../helpers";

interface Props {
    title: string;
    transfers: Transfer[] | BuySellTransaction[];
}

const ROTATE_INTERVAL = 10000;
const MessageRotator: React.FC<Props> = ({ title, transfers}) => {
    const [ currentNewTransfer, setCurrentNewTransfer ] = useState(-1);
    const [ currentOldTransfer, setCurrentOldTransfer ] = useState(-1);
    const [ currentTransfer, setCurrentTransfer ] = useState(-1);

    const rotate = () => {
        if (!transfers || !transfers.length)
            return;

        if (currentNewTransfer < transfers.length - 1) {
            setCurrentNewTransfer(currentNewTransfer + 1);
            setCurrentTransfer(currentNewTransfer + 1);
            console.log('New transfer index: ' + (currentNewTransfer + 1));
        } else if (currentOldTransfer < transfers.length - 1) {
            setCurrentOldTransfer(currentOldTransfer + 1);
            setCurrentTransfer(currentOldTransfer + 1);
            console.log('Old transfer index: ' + (currentOldTransfer + 1));
        } else {
            setCurrentOldTransfer(0);
            setCurrentTransfer(0);
            console.log('Old transfer index reset: ' + 0);
        }
    }
    useInterval(rotate, ROTATE_INTERVAL);

    return (
        <div className="messageRotator">
            {
                currentTransfer >= 0
                    ? (
                        <RotatorMessage
                            transaction={transfers.slice(0).reverse()[currentTransfer]}
                            target={title}
                        />
                    )
                    : null
            }
        </div>
    );
}

export default MessageRotator;