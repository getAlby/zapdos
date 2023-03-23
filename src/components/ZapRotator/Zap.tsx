import { Transfer } from "../helpers";
import "./style.css";
import Marquee from "react-fast-marquee";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import useTimeout from "../../helpers/timeoutHook";

interface Props {
  transaction: Transfer;
  onEnd: () => void;
}

const Zap: React.FC<Props> = ({ transaction, onEnd }) => {
  const [content, setContent] = useState(<div key="zap">Incoming zap</div>);

  useTimeout(() => {
    setContent(
      <div key="sats">
        <span className="text-white">{transaction.amount}</span> sats
      </div>
    );
  }, 3000);

  useTimeout(() => {
    if (transaction.comment) {
      setContent(
        <div key="comment">
          <Marquee gradientColor={[251, 191, 36]} gradientWidth={10} speed={50}>
            {transaction.comment}
          </Marquee>
        </div>
      );
    }
  }, 6000);

  useTimeout(
    () => {
      setContent(<div key="address">nogood@getalby.com</div>);
    },
    transaction.comment ? 13000 : 6000
  );

  useTimeout(() => {
    onEnd();
  }, transaction.comment ? 17000 : 10000);

  function getMotionDiv(content: JSX.Element): JSX.Element {
    console.log(content, content.key);
    return (
      <motion.div
        key={content.key}
        initial={{ translateY: 30 }}
        animate={{ translateY: 0 }}
        exit={{ translateY: -30 }}
        transition={{ ease: "backInOut", duration: 1 }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        key={transaction.identifier}
        className="zap bg-amber-400 text-black m-5 p-1 text-center uppercase w-64 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="h-5 position-absolute overflow-hidden">
          <AnimatePresence exitBeforeEnter>{getMotionDiv(content)}</AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default Zap;
