import React from "react";
import { Transfer } from "../../helpers";
import "./style.css";
import Filter from "bad-words";
const filter = new Filter();

interface Props {
  transaction: Transfer;
  showMessage?: boolean;
}

const ListMessage: React.FC<Props> = ({ transaction, showMessage }) => {
  return (
    <div className={"message " + (showMessage ? "" : "hide")}>
      <div className="name">
        <div>
          {transaction.payer_name} paid {transaction.amount} sats
        </div>
        <div>
          {transaction &&
            transaction.comment !== null &&
            transaction.comment !== "" && (
              <span className="comment">
                {" "}
                {filter.clean(transaction.comment)}
              </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default ListMessage;
