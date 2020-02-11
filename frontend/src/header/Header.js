import React from "react";
import {AuthContext, PageContext} from "../App";

/*const changePage = useCallback(page =>{
    const role = JSON.parse(localStorage.getItem('role') || null);
    if(role === 'admin') {
        if (page === 'prints' || page === 'fPrints' || page === 'info')
            console.log("can't do this with current role");
        else {
            for (let key in newPageContext)
                newPageContext[key] = key === page;
        }
    }
    else if(role === 'employee') {
        if(page === 'prints' || page === 'fPrints' || page === 'info') {
            for (let key in newPageContext)
                newPageContext[key] = key === page;
        }
        else
            console.log("can't do this with current role");
    }
    else
        console.log('this role is not allowed here');
},[newPageContext]);*/
export const Header = () => {
    const {state, dispatch} = React.useContext(AuthContext);
    const {page, setPage} = React.useContext(PageContext);
    return (
        <PageContext.Provider value={{page, setPage}}>
        <nav id="navigation">
            <h1 className="logo">
                Empress
            </h1>
            {state.isAuthenticated && state.role === "admin" &&
            <div>
                <button
                    onClick={() => setPage('ADD_STORE')}>
                    <h1 className="logo"> Add stores</h1>
                </button>
                <button
                    onClick={() => setPage('VIEW_STORE')}>
                    <h1 className="logo"> View stores</h1>
                </button>
            </div>
            }
            {state.isAuthenticated && state.role === "employee" &&
            <div>
                <button
                    onClick={() => setPage('PRINTS')}>
                    <h1 className="logo">Impressões pendentes</h1>
                </button>
                <button
                    onClick={() => setPage('F_PRINTS')}>
                    <h1 className="logo">Impressões feitas</h1>
                </button>
                <button
                    onClick={() => setPage('INFO')}>
                    <h1 className="logo">Estatísticas</h1>
                </button>
            </div>
            }
            <button
                onClick={() =>
                    dispatch({
                        type: "LOGOUT"
                    })}>
                {state.isAuthenticated && (
                    <h1>Hi {state.role} (LOGOUT)</h1>
                )}
            </button>
        </nav>
        </PageContext.Provider>
    );
};

export default Header;