import React from "react";
import {AuthContext} from "../App";

export const Store = () => {
    const {dispatch} = React.useContext(AuthContext);
    return (
        <h1>Employee logged in!</h1>
    );
};
export default Store;