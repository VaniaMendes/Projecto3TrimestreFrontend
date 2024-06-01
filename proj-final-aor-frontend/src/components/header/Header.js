import React, {useState, useEffect} from "react";
import logo from '../assets/Logo_CSW-full-redim.png';
import logoSmall from '../assets/Logo_CSW-small-redim.png';
import defaultPhoto from "../assets/profile_pic_default.png"
import { IoSearch } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { BiSolidComponent } from "react-icons/bi";
import { BiSolidMessageSquareDots } from "react-icons/bi";
import { IoNotifications } from "react-icons/io5";
import { MdArrowDropDown } from "react-icons/md";
import './Header.css';
import {userStore} from "../../stores/UserStore";
import languages from "../../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";

const Header = () => {
    
    const {token, userData, locale, updateLocale} = userStore();
    const [time, setTime] = useState(new Date());
    const [selectedLanguage, setSelectedLanguage] = useState(locale);
    const [headerPhoto, setHeaderPhoto] = useState(defaultPhoto);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showHomeMenu, setShowHomeMenu] = useState(false);
    const [showComponentsMenu, setShowComponentsMenu] = useState(false);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleClickLanguage = (language) => {
        updateLocale(language);
        setSelectedLanguage(language);
    }

    const handleSearchIconClick = () => {
        setShowSearchBar(true);
    }

    const handleSearchBarBlur = () => {
        setShowSearchBar(false);
    }

    const handleHomeClick = () => {
        setShowHomeMenu(!showHomeMenu);
        setShowComponentsMenu(false);
        setShowProfileMenu(false);
    }

    const handleComponentsClick = () => {
        setShowComponentsMenu(!showComponentsMenu);
        setShowHomeMenu(false);
        setShowProfileMenu(false);
    }

    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu);
        setShowHomeMenu(false);
        setShowComponentsMenu(false);
    }

    const logoToRender = isMobile ? logoSmall : logo;
    const logoWidth = isMobile ? '50px' : '200px';

    return (
        <header>
            <IntlProvider locale={locale} messages={languages[locale]}>
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
                                <span className={selectedLanguage === language ? "selected" : ""} onClick={() => handleClickLanguage(language)}>
                                    {language.toUpperCase()}
                                </span>
                                {index !== ["en", "pt"].length - 1 && <span>|</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className="bottom-header">
                    <div className="header-left">
                        <img
                                    src={logoToRender}
                                    alt="CSW Logo"
                                    style={{ width: logoWidth, height: 'auto' }}
                                    loading="lazy"
                                />
                       {isMobile && !showSearchBar && (
                            <IoSearch className="icon search-icon" onClick={handleSearchIconClick} />
                        )}
                        {(showSearchBar || !isMobile) && (
                            <input
                                className={`search-bar ${isMobile ? 'search-bar-mobile' : ''}`}
                                type="search"
                                placeholder="Search..."
                                autoFocus={isMobile}
                                onBlur={isMobile ? handleSearchBarBlur : null}
                            />
                        )}
                    </div>
                    {!showSearchBar && (
                        <div className="header-right">
                            {/*<button><FormattedMessage id="login" /></button>
                            <button><FormattedMessage id="signup" /></button>*/}
                            <div className="submenu-container">
                                <div className={`icon-container ${showHomeMenu ? 'active-menu' : ''}`} onClick={handleHomeClick}>
                                    <AiFillHome className="icon" />
                                    <p className="icon-subtitle">
                                        <FormattedMessage id="home"/>
                                        <MdArrowDropDown/>
                                    </p>
                                </div>
                                {showHomeMenu && (
                                        <div className="submenu">
                                            <p><FormattedMessage id="create"/></p>
                                            <p><FormattedMessage id="seeAll"/></p>
                                            <p><FormattedMessage id="myProjects"/></p>
                                        </div>
                                    )}
                            </div>
                            <div className="submenu-container">
                                <div className={`icon-container ${showComponentsMenu ? 'active-menu' : ''}`} onClick={handleComponentsClick}>
                                    <BiSolidComponent className="icon"/>
                                    <p className="icon-subtitle">
                                        <FormattedMessage id="components"/>
                                        <MdArrowDropDown />
                                    </p>
                                </div>
                                {showComponentsMenu && (
                                        <div className="submenu">
                                            <p><FormattedMessage id="create"/></p>
                                            <p><FormattedMessage id="seeAll"/></p>
                                        </div>
                                    )}
                            </div>
                            <div className="icon-container">
                                <BiSolidMessageSquareDots className="icon"/>
                                <p className="icon-subtitle"><FormattedMessage id="messages"/></p>
                            </div>
                            <div className="icon-container">
                                <IoNotifications className="icon"/>
                                <p className="icon-subtitle"><FormattedMessage id="notifications"/></p>
                            </div>
                            <div className="submenu-container">
                                <div className={`icon-container ${showProfileMenu ? 'active-menu' : ''}`} onClick={handleProfileClick}>
                                    <div className="photo-container">
                                        <img src={headerPhoto} alt="Profile Pic" /> {/* Show profile picture */}
                                    </div>
                                    <p className="icon-subtitle">
                                        <FormattedMessage id="profile"/>
                                        <MdArrowDropDown />
                                    </p>
                                </div>
                                {showProfileMenu && (
                                        <div className="submenu">
                                            <p><FormattedMessage id="myProfile"/></p>
                                            <p><FormattedMessage id="logout"/></p>
                                        </div>
                                    )}
                            </div>

                        </div>
                    )}
                </div>
            </IntlProvider>
        </header>
    );
};

export default Header;