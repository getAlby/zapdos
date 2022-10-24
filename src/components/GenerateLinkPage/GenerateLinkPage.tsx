import "./style.css";
import React, { useState } from "react";
import { useEffect } from "react";
import { Config } from "../helpers";

const GenerateLinkPage = () => {
  const [link, setLink] = useState("");
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
  useEffect(() => {
    fetch(apiHost + "/oauth/token", { method: "post", body: data })
      .then((res) => res.json())
      .then((data) => {
        setLink(
          `https://${Config.hostName}?access_token=${data.access_token}&refresh_token=${data.refresh_token}`
        );
      });
  }, []);

  return (
    <div className="generateLinkPage">
      <p>Add this link as a browser overlay:</p>
      <a className="" href={link} target="_blank">
        {link}
      </a>
    </div>
  );
};

export default GenerateLinkPage;
