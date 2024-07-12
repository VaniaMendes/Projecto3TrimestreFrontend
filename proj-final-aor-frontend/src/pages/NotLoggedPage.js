import React from "react";
import TopHeader from "../components/header/TopHeader";
import logo from '../components/assets/Logo_CSW-full-redim.png';
import { FormattedMessage, useIntl } from "react-intl";
import "./NotLoggedPage.css";
import { useNavigate } from "react-router";

const NotLoggedPage = () => {
    const intl = useIntl();
    const navigate = useNavigate();

    return (
        <div>
            <div className="initial-Header"><TopHeader /></div>
                <div className="header-left">
                    <img className = "header-image" src={logo} alt="CSW Logo" onClick={() => navigate('/')}/>
                </div>
                <div className="login-page-container">
                    <div className="nlp-container">
                            <h2 className="nlp-title-forms">
                                <FormattedMessage id="seeMoreInformation"/>
                            </h2>

                            
                            <div className="navigate-ctnr">
                                <p>{intl.formatMessage({ id: "allreadyhaveanaccount" })}</p>
                                <a className="link-login no-margin" onClick={() => navigate('/login')}>
                                    {intl.formatMessage({ id: "login" })}
                                </a>
                            </div>
                            <div className="navigate-ctnr">
                                <p>{intl.formatMessage({ id: "notallreadyhaveanaccount" })}</p>
                                <a className="link-login no-margin" onClick={() => navigate('/register')}>
                                    {intl.formatMessage({ id: "register" })}
                                </a>
                            </div>
                            <div className="navigate-ctnr">
                                <a className = "link-login no-margin" onClick={() => navigate('/')}>
                                    {intl.formatMessage({ id: "returnHomePage"})}
                                </a>
                            </div>
                </div>
            </div>
        </div>
      );
}

export default NotLoggedPage;