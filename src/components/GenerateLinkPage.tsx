import React, { useState } from "react";
import { useEffect } from "react";

const GenerateLinkPage = () => {

	const [ link, setLink ] = useState("");
	const query = window.location.search;
    const params = new URLSearchParams(query);
	const host = "ln-donations-plugin-yw4i.vercel.app"
    const code = params.get("code")
	const data = new FormData();
	data.append('code', code!)
	data.append('client_id', 'test_client')
	data.append('client_secret', 'test_secret')
	data.append('grant_type', 'authorization_code')
	data.append('redirect_uri', 'http://localhost:8080')
	useEffect(
		() => {
			fetch(
					'https://api.regtest.getalby.com/oauth/token', {method: 'post', body: data}
				)
					.then(res => res.json())
			        .then(data => {
						setLink(`https://${host}?access_token=${data.access_token}&refresh_token=${data.refresh_token}`)
					}
				)
		}, []
	)
	
	return (
		<div>
			Use this link: {link}
		</div>
	)
}

export default GenerateLinkPage;