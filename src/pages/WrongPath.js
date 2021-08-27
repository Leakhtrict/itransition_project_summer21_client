import React from "react";
import { FormattedMessage } from "react-intl";

function WrongPath () {
    return(
        <div>
            <h2><FormattedMessage id="error-page.error" /></h2>
            <h3><a href="/"><FormattedMessage id="error-page.redirect" /></a></h3>
        </div>
    );
}

export default WrongPath;