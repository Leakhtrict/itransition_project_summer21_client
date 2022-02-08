import React from 'react';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { AccountBox } from '@material-ui/icons';

export const ProfileLink = ({ authState }) => {
    let history = useHistory();

    return (
        <IconButton edge="end" onClick={() => {history.push(`/user/${authState.id}`)}} style={{ color: "white", margin: "4px" }}>
            <AccountBox/>
        </IconButton>
    )
}
