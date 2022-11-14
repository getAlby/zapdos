import React, { useEffect, useState } from "react";
import { Config } from "../helpers";

const Dashboard: React.FC = () => {
const query = window.location.search;
const params = new URLSearchParams(query);
const code = params.get("code");
const apiHost = Config.apiHost;
const data = new FormData();
data.append("code", code!);
data.append("client_id", Config.clientId);
data.append("client_secret", Config.clientSecret);
data.append("grant_type", "authorization_code");
data.append("redirect_uri", Config.redirectUri);
const code_verifier = window.localStorage.getItem("code_verifier");
data.append("code_verifier", code_verifier!);

  // Now minus one hour
  const startDate = new Date();
  startDate.setTime(startDate.getTime() - 100 * 60 * 60 * 1000);

  const [minDonationAmount, setMinDonationAmount] = useState(1000);
  const [msgTimeoutSeconds, setMsgTimeoutSeconds] = useState(20);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const linkTemplate = () => `http://${Config.hostName}/overlay?access_token=${accessToken}&refresh_token=${refreshToken}&timeout=${msgTimeoutSeconds}&min_amount=${minDonationAmount}`

  useEffect(() => {
    fetch(apiHost + "/oauth/token", { method: "post", body: data })
      .then((res) => res.json())
      .then((data) => {
        setAccessToken(data.access_token)
        setRefreshToken(data.refresh_token)
      });
  }, []);

  return (
    <div className="container mx-auto">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-column baseline my-4">
          <div>
            <label>Minimum donation amount (sats) </label>
            <input type="text" value={minDonationAmount} onChange={event => {
              setMinDonationAmount(Number(event.target.value))
            }}>
            </input>
          <div className="flex flex-column baseline my-4">
            <label>Message timeout (seconds) </label>
            <input type="text" value={msgTimeoutSeconds} onChange={event => setMsgTimeoutSeconds(Number(event.target.value))}>
            </input>
          </div>
          <div className="flex flex-column baseline my-4">
            <label>Filter bad words</label>
            <input type="checkbox" disabled={true} defaultChecked={true}>
            </input>
          </div>
          <div className="flex flex-column baseline my-4">
            <label>Filter repeated messages</label>
            <input type="checkbox" disabled={true} defaultChecked={true}>
            </input>
          </div>
          </div>
        </div>
        { accessToken !== "" &&
          <div>
           <button onClick={() => {navigator.clipboard.writeText(linkTemplate())}} className="text-white hover:text-grey-500 px-3 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600" aria-current="page">
          📋 {linkTemplate()}
          </button>
          </div>
        }
        {
          accessToken === "" &&
           <div>Fetching token...</div> 
        }
      </div>

    </div>
  );
}

export default Dashboard;