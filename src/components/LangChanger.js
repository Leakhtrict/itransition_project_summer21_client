import { MenuItem, Select } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

export default function LangChanger ({
    currentLang,
    setCurrentLang
}) {

    return (
        <div className="langChanger">
            <Select
                value={currentLang}
                onChange={(e) => {
                    localStorage.setItem("app.lang", e.target.value);
                    setCurrentLang(e.target.value);
                }}
                style={{ marginBottom: "8px" }}
            >
                <MenuItem value="en">
                    <FormattedMessage id="lang-changer.english" />
                </MenuItem>
                <MenuItem value="ru">
                    <FormattedMessage id="lang-changer.russian" />
                </MenuItem>
            </Select>
        </div>
        
    )
}