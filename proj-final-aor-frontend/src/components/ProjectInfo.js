import React, {useState} from "react";
import KeywordComponent from "./KeywordComponent";
import MemberDisplay from "./MemberDisplay";
import "./ProjectInfo.css";
import languages from "../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";

const ProjectInfo = (props) => {
    const locale = props.locale;

    return (
        <div className="info-container">
            <IntlProvider locale={locale} messages={languages[locale]}>
                <h2>NOME</h2>
                <h4><FormattedMessage id="lab"/>:</h4>
                <div className="state-vacancies-container">
                    <h4><FormattedMessage id="state"/>:</h4>
                    <h4><FormattedMessage id="vacancies"/>:</h4>
                </div>
                <h4><FormattedMessage id="description"/>: </h4>
                <div className="description-container">
                    <p class="description-text roboto-regular">Lorem ipsum dolor sit amet, consectetur 
                        adipiscing elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud 
                        exercitation ullamco laboris nisi ut aliquip ex 
                        ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum 
                        dolore eu fugiat nulla pariatur. Excepteur sint 
                        occaecat cupidatat non proident, sunt in culpa 
                        qui officia deserunt mollit anim id est laborum.</p>
                    
                </div>
                <div className="words-container">
                    <h4><FormattedMessage id="keywords"/>:</h4>
                    <KeywordComponent keyword="Matemática"/>
                    <KeywordComponent keyword="Inteligência Artificial"/>
                    <KeywordComponent keyword="Python"/>
                    <KeywordComponent keyword="Data Science"/>
                    
                   
                </div>
                <div className="words-container">
                    <h4><FormattedMessage id="skills"/>:</h4>
                    <KeywordComponent keyword="VSCode"/>
                </div>
                <h4><FormattedMessage id="teamMembers"/>:</h4>
                <div className="team-members-container">
                    <MemberDisplay photo="https://via.placeholder.com/150" name="João" role="developer" locale={locale}/>
                    <MemberDisplay photo="https://via.placeholder.com/150" name="Ana" role="developer" locale={locale}/>
                    <MemberDisplay photo="https://via.placeholder.com/150" name="Joana" role="developer" locale={locale}/>
                </div>
            </IntlProvider>
        </div>
    );
}

export default ProjectInfo;