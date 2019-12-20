import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

import encrypt from '../../crypto/encrypt';
import Alert from '../generic/Alert';
import Form from './Form';


function EntryPage() {
	const [type, setType] = useState('totp');
	const [name, setName] = useState('');
	const [issuer, setIssuer] = useState('');
	const [algo, setAlgo] = useState('SHA1');
	const [digits, setDigits] = useState(6);
	const [period, setPeriod] = useState(30);
	const [secret, setSecret] = useState('');

	const [redirect, setRedirect] = useState(null);
	const [message, setMessage] = useState('');


	useEffect(() => {
		const Jwt = localStorage.getItem('JWT');
		const cryptoKey = localStorage.getItem('cryptoKey');

		if (!(Jwt && cryptoKey)) {
			localStorage.removeItem('JWT');
			localStorage.removeItem('cryptoKey');
			setRedirect('/');
		}

	}, []);


	async function submit(e) {
		e.preventDefault();
		if (!secret) {
			setMessage('No secret provided. Operation not performed.');
		} else if (!issuer) {
			setMessage('No issuer provided. Operate not performed.');
		} else if (!name) {
			setMessage('No label provided. Operation not performed.');
		} else {
			const key = JSON.parse(localStorage.getItem('cryptoKey'));
			const encSecret = await encrypt(key, secret);
			const encIssuer = await encrypt(key, issuer);
			const encName = await encrypt(key, name);

			axios.post('https://ultraotp.com/api/doc/new', {
					'issuer': {
						'text': encIssuer.text,
						'iv': encIssuer.iv
					},
					'name': {
						'text': encName.text,
						'iv': encName.iv
					},
					'secret': {
						'text': encSecret.text,
						'iv': encSecret.iv
					},
					'type': type,
					'algo': algo,
					'digits': digits,
					'period': period
				},
				{headers: {'Authorization': `JWT ${localStorage.getItem('JWT')}`}}).then(res => {
				if (res.data.success) {
					setRedirect('/list');
				} else {
					setMessage(res.data.message);
				}
			});
		}
	}


	if (redirect) {
		return <Redirect push to={`${redirect}`}/>;
	} else {

		return (
			<div>

				<Alert close={() => setMessage('')} message={message}/>


				<div className='homeHeader'>
					<h1>Add New Token</h1>
					<button className='primaryBtn redirectBtn alertBtn cancelBtn'
									onClick={() => setRedirect('list')}>Cancel
					</button>
				</div>


				<div className='otpFormWrapper' style={{display: 'block'}}>

					<Form
						algo={algo}
						digits={digits}
						issuer={issuer}
						name={name}
						period={period}
						secret={secret}
						type={type}
						submit={submit}
						setIssuer={setIssuer}
						setName={setName}
						setSecret={setSecret}
						setType={setType}
						setPeriod={setPeriod}
						setDigits={setDigits}
						setAlgo={setAlgo}
					/>

				</div>

			</div>
		);
	}
}

export default EntryPage;