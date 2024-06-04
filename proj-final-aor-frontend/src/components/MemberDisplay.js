import React from "react";
import "./MemberDisplay.css";
import languages from "../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";

const MemberDisplay = (props) => {
    const photo = props.photo;
    const name = props.name;
    const role = props.role;
    const locale = props.locale;

    console.log(role);

    return (
        <div className="member-display">
            <IntlProvider locale={locale} messages={languages[locale]}>
                <div className="photo-container">
                    <img src={photo} alt="member" />
                </div>
                <div className="name-container">
                    <h4>{name}</h4>
                    <p><FormattedMessage id={role}/></p>
                </div>
            </IntlProvider>
        </div>
    );
}

export default MemberDisplay;