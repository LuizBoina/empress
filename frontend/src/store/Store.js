import React from 'react'
import {AuthContext} from "../App";
const initialState = {
    storeId: null,
};
export const Store = () => {
    const {state, dispatch} = React.useContext(AuthContext);
    return (
        /*{state.role === "admin" &&*/ (
        <table>
            <thead>
            <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {props.stores.length > 0 ? (
                props.stores.map(store => (
                    <tr key={store.id}>
                        <td>{store.code}</td>
                        <td>{store.storeAdmin.name}</td>
                        <td>
                            <button className="button muted-button">Edit</button>
                            <button className="button muted-button">Delete</button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={3}>No users</td>
                </tr>
            )}
            </tbody>
        </table>
    )/*}*/
    );
};

export default Store;