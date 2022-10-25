import "./App.css";
import MessageList from "./components/MessageList/MessageList";
import Login from "./components/Login";
import GenerateLinkPage from "./components/GenerateLinkPage/GenerateLinkPage";
import Tipping from "./components/Tipping/Tipping";
import { Config } from "./components/helpers";
import { useEffect } from "react";
import Dashboard from "./components/Dashboard/Dashboard";

const exchangeCode = function(code: string) {    
    const apiHost = Config.apiHost;
    const data = new FormData();
    data.append("code", code!);
    data.append("client_id", Config.clientId);
    data.append("client_secret", Config.clientSecret);
    data.append("grant_type", "authorization_code");
    data.append("redirect_uri", Config.redirectUri);
    const code_verifier = window.localStorage.getItem("code_verifier");
    data.append("code_verifier", code_verifier!);

    fetch(apiHost + "/oauth/token", { method: "post", body: data })
      .then((res) => res.json())
      .then((data) => {
          if(data.access_token && data.refresh_token) {
            window.localStorage.setItem("access_token", data.access_token);
            window.localStorage.setItem("refresh_token", data.refresh_token);
            window.location.href = '/dashboard';
          }
      })
      .catch(() => window.location.href = '/');
}

const App = () => {
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const code = params.get("code");
  const page = window.location.pathname;

  return (
    <div className="App">
      {page != '/overlay' && 
      <nav className="bg-gray-800">
        <div className="mx-auto px-8 max-w-7xl">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <a className="font-bold text-lg" href="/">🔥 Zapdos</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      }

      {code == null && page == "/" && <Login></Login>}
      {page == "/login" && code && exchangeCode(code)}
      {page == '/dashboard' && 
        <Dashboard></Dashboard>
      }
      {page == '/overlay' && (
        <div>
          <Tipping />
          <MessageList title={""} transfers={[]}></MessageList>
        </div>
      )}
    </div>
  );
};

export default App;
