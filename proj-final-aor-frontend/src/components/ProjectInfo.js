import React, {useState} from "react";
import "./ProjectInfo.css";
import languages from "../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";

const ProjectInfo = (props) => {
    const locale = props.locale;

    return (
        <div className="info-container">
            <IntlProvider locale={locale} messages={languages[locale]}>
                <h2>NOME</h2>
                <p><FormattedMessage id="lab"/>:</p>
                <div className="state-vacancies-container">
                    <p><FormattedMessage id="state"/>:</p>
                    <p><FormattedMessage id="vacancies"/>:</p>
                </div>
                <div className="description-container">
                    <p><FormattedMessage id="description"/>: </p>
                </div>
                <p><FormattedMessage id="keywords"/>:</p>
                <p><FormattedMessage id="skills"/>:</p>
                <p><FormattedMessage id="teamMembers"/>:</p>
            </IntlProvider>
        </div>
    );
}

export default ProjectInfo;