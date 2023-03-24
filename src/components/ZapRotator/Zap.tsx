import { Transfer } from "../helpers";
import "./style.css";
import Marquee from "react-fast-marquee";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import useTimeout from "../../helpers/timeoutHook";

interface Props {
  transaction: Transfer;
  onEnd: () => void;
  lnAddress: string;
}

const Zap: React.FC<Props> = ({ transaction, onEnd, lnAddress }) => {
  const [content, setContent] = useState(
    <motion.div
      key="zap"
      initial={{ translateY: 50 }}
      animate={{ translateY: 0 }}
      exit={{ translateY: -50 }}
      transition={{ duration: 4, ease: "backInOut" }}
      className="bg-[#fdc422] h-6 text-[#1c1c1c]"
    >
      incoming zap
    </motion.div>
  );

  useTimeout(() => {
    setContent(getMotionDiv(
      <div key="sats" className="text-[#fdc422]">
        <span>{transaction.amount}</span> sats
      </div>
    ));
  }, 6000);

  useTimeout(() => {
    if (transaction.comment) {
      setContent(
        getMotionDiv(
          <div key="comment">
            <Marquee gradient={false} speed={10}>
              {/* repeat the comment to avoid empty spaces for short texts */}
              {transaction.comment}&nbsp;{transaction.comment}&nbsp;{transaction.comment}&nbsp;
              {transaction.comment}&nbsp;{transaction.comment}&nbsp;{transaction.comment}&nbsp;
              {transaction.comment}&nbsp;{transaction.comment}&nbsp;{transaction.comment}&nbsp;
            </Marquee>
          </div>
        )
      );
    }
  }, 13000);

  useTimeout(
    () => {
      setContent(getMotionDiv(<div key="address">{lnAddress.split("@")[0]}@<span className="text-[#fdc422]">getalby.com</span></div>));
    },
    transaction.comment ? 22000 : 13000
  );

  useTimeout(
    () => {
      onEnd();
    },
    transaction.comment ? 32000 : 21000
  );

  function getMotionDiv(content: JSX.Element): JSX.Element {
    return (
      <motion.div
        key={content.key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 100 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 4, delay: 0.5 }}
        className="px-1"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        key={transaction.identifier}
        className="zap text-white text-center uppercase w-48 text-sm h-6 position-absolute overflow-hidden bg-black/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 100 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 3 }}
      >
        <AnimatePresence exitBeforeEnter>
          {content}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Zap;
