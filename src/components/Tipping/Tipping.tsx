import './style.css';
import QRCode from "react-qr-code";
import { useEffect, useState } from 'react';
import { Config } from '../helpers';


const API_URL = Config.apiHost
const query = window.location.search;
const params = new URLSearchParams(query);
const accessToken = params.get("access_token")

const Tipping: React.FC = () => {

    const [ lnurl, setLnurl ] = useState<string>("");
	useEffect(
		() => {
			fetch(API_URL+'/user/value4value', { method: 'get' , headers: {'Authorization': accessToken!}})
            .then(res => res.json())
            .then(data => {
                
                setLnurl(data.lightning_address);
            })
            .catch(e => console.log(e));
		}, []
	);

    return (
        <div className="tipping">
            <div className="title">Tip with Alby</div>
            {lnurl && 
            <QRCode value={'lightning:' + lnurl} size={200} />}
        </div>
    );
}

export default Tipping;