import React from 'react';
import {  Transfer } from "../../helpers";
import TickerMessage from "../TickerMessage/TickerMessage";

interface Props {
    transfers: Transfer[]
}

const TickerContent: React.FC<Props> = ({ transfers }) => {
    console.log('render ticker: ' + transfers);
    return (transfers && transfers.length) ? (
            <>
                {
                    transfers.map((el:  Transfer) => {
                        return <TickerMessage transaction={el} target={"test"} />
                    })
                }
            </>
        ) :
        null
}

export default TickerContent;