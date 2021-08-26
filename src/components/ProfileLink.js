import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { IconButton } from "@material-ui/core";
import AccountBoxIcon from '@material-ui/icons/AccountBox';

export default function ProfileLink({
    authState
}) {
    let history = useHistory();

    return (
        <IconButton edge="end" onClick={() => {history.push(`/user/${authState.id}`)}} style={{ color: "white", margin: "4px" }}>
            <AccountBoxIcon />
        </IconButton>
    )
}