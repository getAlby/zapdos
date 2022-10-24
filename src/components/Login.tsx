import pkceChallenge from "pkce-challenge";
import { Config } from "./helpers";
const Login = () => {
  const challenge = pkceChallenge();
  window.sessionStorage.setItem("code_verifier", challenge.code_verifier);

  return (
    <div>
      <h2>🔥Zapdos</h2>
      <p>Lightning-powered overlays for your video streams.</p>
      <a
        className="btn"
        href={
          Config.appHost +
          "?client_id=" +
          Config.clientId +
          "&redirect_uri=" +
          Config.redirectUri +
          "&scope=" +
          Config.scope +
          "&code_challenge=" +
          challenge.code_challenge +
          "&code_challenge_method=S256"
        }
      >
        <span>Connect your Alby account</span>
      </a>
    </div>
  );
};

export default Login;
