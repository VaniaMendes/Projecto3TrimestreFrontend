import React, {useState, useEffect} from "react";
import {userStore} from "../../stores/UserStore";
import {FormattedMessage } from "react-intl";


const TopHeader = () => {
    const {locale, updateLocale} = userStore();
    const [time, setTime] = useState(new Date());
    const [selectedLanguage, setSelectedLanguage] = useState(locale);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const handleClickLanguage = (language) => {
        updateLocale(language);
        setSelectedLanguage(language);
    }

    return (
        <div className="top-header">
            <div className="time">
                <FormattedMessage id="time" values={{ t: time }} /> 
            </div>
            <div className="date">
                <FormattedMessage id="date" values={{ d: Date.now() }} /> 
            </div>
            <div className="language-select">
                {["en", "pt"].map((language, index) => (
                    <React.Fragment key={language}>
                        <span className={selectedLanguage === language ? "selected-language" : ""} onClick={() => handleClickLanguage(language)}>
                            {language.toUpperCase()}
                        </span>
                        {index !== ["en", "pt"].length - 1 && <span>|</span>}
                    </React.Fragment>
                ))}
            </div> 
        </div>
    );
}

export default TopHeader;