import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import AdminTable from 'components/AdminTable';
import { AuthContext } from 'helpers/AuthContext';

export const AdminPanel = () => {
    const { authState } = useContext(AuthContext);

    return(
        (!authState.isAdmin && 
            <h1>
                <FormattedMessage id="adminpanel.error" />
            </h1>
        ) || 
        (authState.isAdmin &&
            <AdminTable />
        )
    )
}
