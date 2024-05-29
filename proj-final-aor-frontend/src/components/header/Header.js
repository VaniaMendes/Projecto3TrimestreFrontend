import React from "react";
import logo from '../assets/Logo_CSW-full-redimens.png'
import './Header.css';
import {userStore} from "../../stores/UserStore";
import languages from "../../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";

const Header = () => {
    const {token, userData, locale, updateLocale} = userStore();


    return (
        <header>
            <IntlProvider locale={locale} messages={languages[locale]}>

            <div className="top-header">
                {/*<div className="time">
                    <FormattedMessage id="time" values={{t: time}} /> 
                </div>
                <div className="date">
                    <FormattedMessage id="date" values={{d: Date.now()}} /> 
                </div>
                <div className="language-select">
                    {["en", "pt", "fr"].map((language, index) => (
                        <React.Fragment key={language}>
                            <span className={selectedLanguage === language ? "selected" : ""} onClick={() => handleClickLanguage(language)}>
                                {language.toUpperCase()}
                            </span>
                            {index !== ["en", "pt", "fr"].length - 1 && <span>|</span>}
                        </React.Fragment>
                    ))}
                </div>*/}
            </div>


                <div className="header-left">
                    <img src={logo} alt="CSW Logo" style={{ width: '200px', height: 'auto'}}/>
                    <input className="search-bar" type="search" placeholder="Search..."></input>
                </div>
                <div className="header-right">
                    <button><FormattedMessage id="login" /></button>
                    <button><FormattedMessage id="signup" /></button>
                    <span>pt | en</span>
                </div>
                
                

                


            </IntlProvider>
            

            
        </header>
    );
};

export default Header;