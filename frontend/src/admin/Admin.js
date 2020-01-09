import React from "react";
import {AuthContext} from "../App";

export const Admin = () => {
    const {dispatch} = React.useContext(AuthContext);
    return (
        <h1>Admin logged in!</h1>
    );
};
export default Admin;