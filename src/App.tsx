import './App.css';
import MessageList from "./components/MessageList/MessageList";
import Login from "./components/Login";
import GenerateLinkPage from './components/GenerateLinkPage';
import { Transfer } from './components/helpers';
import Tipping from './components/Tipping/Tipping';

const App = () => {
    const query = window.location.search;
    const params = new URLSearchParams(query);
    const code = params.get("code")
    const accessToken = params.get("access_token")
    const refreshToken = params.get("refresh_token")
    return (
        <div className="App">
            {
                code == null && accessToken == null && <Login></Login>
            }
            {
                code != null && <GenerateLinkPage></GenerateLinkPage>
            }
            {
                accessToken != null && refreshToken != null && <div><Tipping /><MessageList title={''} transfers={[]}></MessageList></div>
            }
        </div>
    );
}

export default App;