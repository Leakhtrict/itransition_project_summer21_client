import { MenuItem, Select } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

export default function LangChanger ({
    currentLang,
    setCurrentLang
}) {

    return (
        <>
            <hr />
            <Select
                value={currentLang}
                onChange={(e) => {
                    localStorage.setItem("app.lang", e.target.value);
                    setCurrentLang(e.target.value);
                }}
            >
                <MenuItem value="en">
                    <FormattedMessage id="lang-changer.english" />
                </MenuItem>
                <MenuItem value="ru">
                    <FormattedMessage id="lang-changer.russian" />
                </MenuItem>

            </Select>
        </>
        
    )
}