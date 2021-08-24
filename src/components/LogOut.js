import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";

export default function LogOut({
    authState,
    setAuthState
}) {
    let history = useHistory();

    const logOut = () => {
        localStorage.removeItem("accessToken");
        setAuthState({
            username: "",
            id: 0,
            isAdmin: false,
            status: false,
          });
        history.push("/");
      };

    return(
        <button onClick={logOut}>
            <FormattedMessage id="user.logout" />
        </button>
    )
}