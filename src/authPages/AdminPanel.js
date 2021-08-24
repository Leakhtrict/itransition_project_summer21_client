import React, { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { FormattedMessage } from "react-intl";
import AdminTable from "../components/AdminTable";

function AdminPanel() {
    const { authState } = useContext(AuthContext);

    return(
        (!authState.isAdmin && 
            <h1>
                <FormattedMessage id="adminpanel.error" />
            </h1>
        ) || 
        (authState.isAdmin &&
            <div>
                <AdminTable />
            </div>
        )
    )
}

export default AdminPanel;