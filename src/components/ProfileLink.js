import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export default function ProfileLink({
    authState
}) {
    let history = useHistory();

    return (
        <FormattedMessage id="profilelink.title">
            {(id) => 
                <div title={id} className="profileLink" onClick={() => {history.push(`/user/${authState.id}`)}}>{authState.username}</div>
            }
        </FormattedMessage>
    )
}