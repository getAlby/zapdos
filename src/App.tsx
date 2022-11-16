import "./App.css";
import MessageList from "./components/MessageList/MessageList";
import Login from "./components/Login";
import Tipping from "./components/Tipping/Tipping";
import Dashboard from "./components/Dashboard/Dashboard";

const App = () => {
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const code = params.get("code");
  const page = window.location.pathname;

  return (
    <div className="App">
      {page !== "/overlay" && (
        <nav className="bg-gray-800">
          <div className="mx-auto px-8 max-w-7xl">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <a className="font-bold text-lg" href="/">
                    🔥 Zapdos
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      {code === null && page === "/" && <Login></Login>}
      {page === "/dashboard" && <Dashboard></Dashboard>}
      {page === "/overlay" && (
        <div className="overlay">
            <Tipping />
            <MessageList title={""}></MessageList>
         </div>
      )}
    </div>
  );
};

export default App;
