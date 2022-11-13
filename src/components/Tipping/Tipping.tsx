import "./style.css";
import QRCode from "react-qr-code";
import { bech32 } from "bech32";
import { useEffect, useState } from "react";
import { Config } from "../helpers";

const API_URL = Config.apiHost;
const query = window.location.search;
const params = new URLSearchParams(query);
const accessToken = params.get("access_token");
const minDonationAmount = params.get("min_amount");

const Tipping: React.FC = () => {
  const [lnurl, setLnurl] = useState<string>("");
  const [lnAddress, setLnAddress] = useState<string>("");
  useEffect(() => {
    fetch(API_URL + "/user/value4value", {
      method: "get",
      headers: { Authorization: accessToken! },
    })
      .then((res) => res.json())
      .then((data) => {
          let parts = data.lightning_address.split("@")
          let utf8Encode = new TextEncoder();
        	let words = bech32.toWords(utf8Encode.encode(`https://${parts[1]}/.well-known/lnurlp/${parts[0]}`));
	        let lnurl =  bech32.encode("lnurl", words, 1023);
          setLnurl(lnurl);
          setLnAddress(data.lightning_address)
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      {lnurl && (
        <div className="tipping">
          <div className="mb-2">⚡{lnAddress}</div>
          <QRCode value={"lightning:" + lnurl} size={200} />
          <div className="mt-2">
            Minimum tip amount: <br />
            {minDonationAmount} sats
          </div>
        </div>
      )}
    </>
  );
};

export default Tipping;
