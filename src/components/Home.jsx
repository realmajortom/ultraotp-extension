import React from 'react';
import {Link, Redirect} from 'react-router-dom';



function Home() {
	const Jwt = localStorage.getItem('JWT');
	const cryptoKey = localStorage.getItem('cryptoKey');

	if (Jwt && cryptoKey) {
		return (<Redirect to='/list'/>);
	} else {
		return (
			<div>

				<div className='homeHeader'>

					<div className='homeTitles'>
						<h1>Ultra OTP</h1>
					</div>

					<nav className='homeLinksWrapper'>
						<Link to='/login' className='primaryBtn alertBtn'>Sign In</Link>
					</nav>

				</div>

                <div>
                    <p style={{fontSize: '16px'}}>Thank you for installing the Ultra OTP browser extension! To sign up for an account, please visit <a
                        href='https://ultraotp.com'
                        target='_blank'
                        rel='noopener'>ultraotp.com</a>.</p>
                </div>

			</div>
		);
	}
}

export default Home;