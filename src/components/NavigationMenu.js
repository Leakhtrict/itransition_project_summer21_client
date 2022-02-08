import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Menu, Close } from '@material-ui/icons';
import { Button, IconButton } from '@material-ui/core';
import OutsideClickHandler from 'react-outside-click-handler';

export const NavigationMenu = ({ authState }) => {
    let history = useHistory();
    const [menuOpen, setMenuOpen] = useState(false);

    const homeClick = () => {
        history.push("/");
        setMenuOpen(!menuOpen);
    };

    const loginClick = () => {
        history.push("/login");
        setMenuOpen(!menuOpen);
    };

    const registerClick = () => {
        history.push("/register");
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <IconButton onClick={() => setMenuOpen(!menuOpen)} style={{ color: "white" }}>
                {menuOpen ?
                    <Close /> :
                    <Menu />
                }
            </IconButton>
            {menuOpen &&
                <OutsideClickHandler onOutsideClick={() => setMenuOpen(!menuOpen)}>
                    <div className="navMenuList">
                        <Button onClick={homeClick} style={{ color: "white", borderRadius: 0 }}>
                            <FormattedMessage id="home-page.main" />
                        </Button>
                        {!authState.status &&
                            <>
                                <Button onClick={loginClick} style={{ color: "white", borderRadius: 0 }}>
                                    <FormattedMessage id="user.login" />
                                </Button>
                                <Button onClick={registerClick} style={{ color: "white", borderRadius: 0 }}>
                                    <FormattedMessage id="user.register" />
                                </Button>
                            </>
                        }
                    </div>
                </OutsideClickHandler>
            }
        </>
    )
}
