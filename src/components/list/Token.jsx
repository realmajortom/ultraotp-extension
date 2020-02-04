import React, {useEffect, useState} from 'react';
import LineContainer from './LineContainer';
import decrypt from '../../crypto/decrypt';
import genOtp from '../../helpers/gen-otp';



function TokenTile(props) {
	const delay = (props.index * .075);

	return (
		<div className='Token fade-in' onClick={() => props.copy(props.code)} style={{animationDelay: `${delay}s`}}>

			<div className='tokenInfo'>
				<p className='tIssuer'>{props.issuer}</p>
				<p className='tLabel'>{props.name}</p>
			</div>

			<div className='tokenCode'>
				<h2>{props.code}</h2>
				{props.timeRemaining >= 0 && <LineContainer num={props.timeRemaining} den={props.period} />}
			</div>

		</div>
	)
}

function getTimeRemaining(epoch, step) {
	return step - (Math.floor(epoch / 1000) % step);
}


function Token(props) {
	const t = props.token;
	const seconds = t.type === 'totp' ? props.seconds : null;
	const [name, setName] = useState(null);
	const [code, setCode] = useState(null);
	const [secret, setSecret] = useState(null);
	const [issuer, setIssuer] = useState(null);
	const [timeRemaining, setTimeRemaining] = useState(null);


	useEffect(() => {
		const cryptoKey = JSON.parse(localStorage.getItem('cryptoKey'));

		async function setEncryptedItems() {
			const decSecret = await decrypt(cryptoKey, t.secret.text, t.secret.iv);
			const decIssuer = await decrypt(cryptoKey, t.issuer.text, t.issuer.iv);
			const decName = await decrypt(cryptoKey, t.name.text, t.name.iv);
			setCode(genOtp(t, decSecret));
			setSecret(decSecret);
			setIssuer(decIssuer);
			setName(decName);
		}

		if (t.type === 'totp') {
			setTimeRemaining(getTimeRemaining(Date.now(), t.period));
		}

		setEncryptedItems();
	},[t]);


	useEffect(() => {
		if (seconds) {
			setTimeRemaining(c => c - 1);
		}
	}, [seconds]);


	useEffect(() => {
		if (secret && timeRemaining <= 1) {
			let newCode = genOtp(t, secret);

			if (newCode !== code) {
				setCode(newCode);
				setTimeRemaining(t.period);
			}

        }
    }, [timeRemaining, t, secret, code]);


    const copy = (code) => {
        navigator.clipboard.writeText(code).then(() => props.complete());
    };


    if (secret && issuer && name) {
        return (
            <div>
					<TokenTile copy={copy}
                               issuer={issuer}
                               name={name}
                               period={t.period}
                               code={code}
                               timeRemaining={timeRemaining}
                               index={props.index}/>
				</div>
        );
		} else {
		return <div></div>
	}
}

export default Token;
