import React from 'react';
import {Link} from 'react-router-dom';


function EntryBtn(props) {

	return (
		<div className='EntryBtn'>

			<Link className='CircleLink' to='/new'>
				<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
					<path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' fill='#ffffff'/>
					<path d='M0 0h24v24H0z' fill='none'/>
				</svg>
				<span className='CircleSpan'> CREATE</span>
			</Link>

		</div>
	);
}

export default EntryBtn;
