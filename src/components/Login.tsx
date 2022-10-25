import pkceChallenge from "pkce-challenge";
import { Config } from "./helpers";
const Login = () => {
  const challenge = pkceChallenge();
  window.localStorage.setItem("code_verifier", challenge.code_verifier);

  return (
    <div className="max-w-7xl container mx-auto my-5">
      <p className="text-xl my-5">Lightning-powered overlays for your video streams.</p>
      <a
        className="text-black hover:text-grey-500 px-3 py-2 rounded-md text-sm font-medium bg-amber-300 hover:bg-amber-200 text-lg"
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
        🐝 Connect your Alby account
      </a>
    </div>
  );
};

export default Login;
