import React from "react";
import { AuthContext } from "../../index";
import { navigate } from 'hookrouter';

import './auth.css';

export const Auth = () => {
	const { dispatch } = React.useContext(AuthContext);
	const initialState = {
		email: "",
		password: "",
		isSubmitting: false,
		errorMessage: null
	};
	const [data, setData] = React.useState(initialState);
	const handleInputChange = event => {
		setData({
			...data,
			[event.target.name]: event.target.value
		});
	};
	const handleFormSubmit = async event => {
		event.preventDefault();
		setData({
			...data,
			isSubmitting: true,
			errorMessage: null
		});
		if (data.password.trim().length === 0 || data.email.trim().length === 0) {
			setData({
				...data,
				isSubmitting: false,
				errorMessage: "Complete todos os campos"
			});
			return;
		}
		const requestBody = {
			query: `
        query Login($email: String!, $password: String!) {
          login(userName: $email, password: $password) {
            userId
            role
            token
          }
        }`,
			variables: {
				email: data.email,
				password: data.password
			},
		};
		const res = await (await fetch('http://localhost:8000/graphql', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json'
			}
		})).json();
		if (res.data) {
			dispatch({
				type: "LOGIN",
				payload: res
			});
			navigate('/home');
		}
		else
			setData({
				...data,
				isSubmitting: false,
				errorMessage: res.errors[0].message || res.statusText
			});
	};
	return (
		<div className="login-container">
			<div className="card">
				<div className="container">
					<form onSubmit={handleFormSubmit}>
						<h1>Login</h1>

						<label htmlFor="email">
							Email
                            <input
								type="text"
								value={data.email}
								onChange={handleInputChange}
								name="email"
								id="email"
							/>
						</label>

						<label htmlFor="password">
							Password
                            <input
								type="password"
								value={data.password}
								onChange={handleInputChange}
								name="password"
								id="password"
							/>
						</label>

						{data.errorMessage && (
							<span className="form-error">{data.errorMessage}</span>
						)}

						<button disabled={data.isSubmitting}>
							{data.isSubmitting ? (
								"Loading..."
							) : (
									"Login"
								)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
export default Auth;