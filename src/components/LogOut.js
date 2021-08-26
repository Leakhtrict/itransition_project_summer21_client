import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";

export default function LogOut({
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
        <Button onClick={logOut} style={{ color: "white" }}>
            <FormattedMessage id="user.logout" />
        </Button>
    )
}