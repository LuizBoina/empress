import React from 'react';
import './App.css';
import Auth from './auth/Auth';
import Header from './header/Header';
import Admin from './admin/Admin';
import Store from './store/Store';

export const AuthContext = React.createContext();
const initialState = {
    isAuthenticated: false,
    userId: null,
    role: null,
    token: null,
};
const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('userId', JSON.stringify(action.payload.data.login.userId));
            localStorage.setItem('role', JSON.stringify(action.payload.data.login.role));
            localStorage.setItem('token', JSON.stringify(action.payload.data.login.token));
            return {
                ...state,
                isAuthenticated: true,
                userId: action.payload.data.login.userId,
                role: action.payload.data.login.role,
                token: action.payload.data.login.token
            };
        case 'LOGOUT':
            localStorage.clear();
            return {
                ...state,
                isAuthenticated: false,
                userId: null,
                storeId: null,
                role: null
            };
        default:
            return state;
    }
};

function App() {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    React.useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('userId') || null);
        const role = JSON.parse(localStorage.getItem('role') || null);
        const token = JSON.parse(localStorage.getItem('token') || null);
        if (userId && token && role) {
            dispatch({
                type: 'LOGIN',
                payload: {
                    data: {
                        login: {
                            userId: userId,
                            role: role,
                            token: token
                        }
                    }
                }
            });
        }
    }, []);
    return (
        <AuthContext.Provider
            value={{
                state,
                dispatch
            }}
        >
            <Header/>
            <div className='App'>{state.isAuthenticated ? state.role === 'admin' ? <Admin/> : <Store/> : <Auth/>}</div>
        </AuthContext.Provider>
    );
}

export default App;