import React from "react";

const GenerateLinkPage = () => {

	const link = '';
	const query = window.location.search;
    const params = new URLSearchParams(query);
    const code = params.get("code")
	const data = new FormData();
	data.append('code', code!)
	data.append('client_id', 'test_client')
	data.append('client_secret', 'test_secret')
	data.append('grant_type', 'authorization_code')
	data.append('redirect_uri', 'http://localhost:8080/callback')
	fetch(
		'https://api.regtest.getalby.com/oauth/token', {method: 'post', body: data}
	)
	return (
		<div>
			Use this link: {link}
		</div>
	)
}

export default GenerateLinkPage;