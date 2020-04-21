import React from 'react';
import { A, navigate } from 'hookrouter';

import './header.css';
import AuthContext from '../index';

const Header = () => {
	const { state, dispatch } = React.useContext(AuthContext);
	const handleHeaderRole = {
		'admin': [
			{
				'route': '/create-store',
				'text': 'Criar nova loja'
			},
			{
				'route': '/stores',
				'text': 'Ver lojas'
			}
		],
		'employee': [
			{
				'route': '/prints',
				'text': 'Impressões pendentes'
			},
			{
				'route': '/finished-prints',
				'text': 'Impressões feitas'
			},
			{
				'route': '/info',
				'text': 'Estatísticas'
			}
		]
	};
	const header = handleHeaderRole[state.role];

	const handleLogout = () => {
		dispatch({
			type: "LOGOUT"
		});
		navigate('/auth');
	};

	return (
		<header>
			<div className='logo'>
				<h1>Empress</h1>
			</div>
			{
				state.role &&
				<>
					<div className='routes'>
						{
							header.map((tab, i) => (
								<A key={i} href={tab.route}>{tab.text}</A>
							))
						}
					</div>
					<div className='logout'>
						<button
							onClick={handleLogout}>
								<h1>Logout</h1>
						</button>
					</div>
				</>
			}
		</header>
	);
};

export default Header;