import React from 'react';
import './App.css';
import Auth from './auth/Auth';
import Header from './header/Header';
import Initial from "./initial/Initial";
import CreateStore from "./store/CreateStore";
import Print from "./print/print";
import FPrint from "./print/fPrint";
import Store from "./store/Store";
import StoreInfo from "./store/StoreInfo";
export const AuthContext = React.createContext(null);
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
export const PageContext = React.createContext(null);
const initialPage = {
    addStore: false,
    viewStore: false,
    prints: false,
    fPrints: false,
    info: false,
};
const pageReducer = (state, action) => {
    const role = JSON.parse(localStorage.getItem('role') || null);
    switch (action) {
        case 'ADD_STORE':
            if (role === 'admin')
                return {
                    ...state,
                    addStore: true,
                    viewStore: false,
                    prints: false,
                    fPrints: false,
                    info: false,
                };
            else {
                console.log("can't do this with current role");
                return;
            }
        case 'VIEW_STORE':
            if (role === 'admin')
                return {
                    ...state,
                    addStore: false,
                    viewStore: true,
                    prints: false,
                    fPrints: false,
                    info: false,
                };
            else {
                console.log("can't do this with current role");
                return;
            }
        case 'PRINTS':
            if (role === 'admin')
                return {
                    ...state,
                    addStore: false,
                    viewStore: false,
                    prints: true,
                    fPrints: false,
                    info: false,
                };
            else {
                console.log("can't do this with current role");
                return;
            }
        case 'F_PRINTS':
            if (role === 'admin')
                return {
                    ...state,
                    addStore: false,
                    viewStore: false,
                    prints: false,
                    fPrints: true,
                    info: false,
                };
            else {
                console.log("can't do this with current role");
                return;
            }
        case 'INFO':
            if (role === 'admin')
                return {
                    ...state,
                    addStore: false,
                    viewStore: false,
                    prints: false,
                    fPrints: false,
                    info: true,
                };
            else {
                console.log("can't do this with current role");
                return;
            }
        default:
            return state;
    }
};
export const App = () => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const [page, setPage] = React.useReducer(pageReducer, initialPage);
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
            <PageContext.Provider value={{page, setPage}}>
                <Header/>
                <div className='App'>{state.isAuthenticated ? <Initial/> : <Auth/>}</div>
                <div className='App'>{page.addStore ? <CreateStore/> : page.viewStore ? <Store/> : page.prints ? <Print/> : page.fPrints ? <FPrint/> : page.info ? <StoreInfo/> : <Initial/>}</div>
            </PageContext.Provider>
        </AuthContext.Provider>

    );
};

export default App; 