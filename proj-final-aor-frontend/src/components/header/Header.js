import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from '../assets/Logo_CSW-full-redim.png';
import logoSmall from '../assets/Logo_CSW-small-redim.png';
import defaultPhoto from "../assets/profile_pic_default.png"
import TopHeader from "./TopHeader";
import { IoSearch } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { BiSolidComponent } from "react-icons/bi";
import { BiSolidMessageSquareDots } from "react-icons/bi";
import { IoNotifications } from "react-icons/io5";
import { MdArrowDropDown } from "react-icons/md";
import { MdArrowDropUp } from "react-icons/md";
import './Header.css';
import {userStore} from "../../stores/UserStore";
import languages from "../../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";
import { logoutUser } from "../../services/users";


const Header = () => {

    const {token, userId, locale} = userStore();
    const [headerPhoto, setHeaderPhoto] = useState(defaultPhoto);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showProjectsMenu, setShowProjectsMenu] = useState(false);
    const [showComponentsMenu, setShowComponentsMenu] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
    }, []);

    const handleSearchIconClick = () => {
        setShowSearchBar(true);
    }

    const handleSearchBarBlur = () => {
        setShowSearchBar(false);
    }

    const handleHomeClick = () => {
        setShowProjectsMenu(!showProjectsMenu);
        setShowComponentsMenu(false);
        setShowProfileMenu(false);
    }

    const handleComponentsClick = () => {
        setShowComponentsMenu(!showComponentsMenu);
        setShowProjectsMenu(false);
        setShowProfileMenu(false);
    }

    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu);
        setShowProjectsMenu(false);
        setShowComponentsMenu(false);
    }

    
    

    const logoToRender = isMobile ? logoSmall : logo;
    const logoWidth = isMobile ? '50px' : '200px';

    function handleClickProfile() {
        navigate("/profile")
    }
    const handleClickLogout = async() => {
        const response = await logoutUser(token);
        if(response===200){
            navigate("/login");
        }
        else{
            console.error("Failed to logout user");
        }


    }

    return (
        <header>
            <IntlProvider locale={locale} messages={languages[locale]}>
                <TopHeader />
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
                            {location.pathname === "/" ? (
                                <>
                                    <button onClick={()=> navigate("/login")}><FormattedMessage id="login" /></button>
                                    <button onClick={()=> navigate("/register")}><FormattedMessage id="signup" /></button>
                                </>
                            ) : (
                                <>
                                    <div className="submenu-container">
                                        <div className={`icon-container ${showProjectsMenu ? 'active-menu' : ''}`} onClick={handleHomeClick}>
                                            <AiFillHome className="icon" />
                                            <p className="icon-subtitle">
                                                <FormattedMessage id="projects"/>
                                                {showProjectsMenu ? <MdArrowDropUp /> : <MdArrowDropDown />}
                                            </p>
                                        </div>
                                        {showProjectsMenu && (
                                            <div className="submenu">
                                                <p onClick={() => navigate(`/new-project`)}><FormattedMessage id="create"/></p>
                                                <p onClick={() => navigate(`/home`)}><FormattedMessage id="seeAll"/></p>
                                                <p onClick={() => navigate(`/home/${userId}`)}><FormattedMessage id="myProjects"/></p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="submenu-container">
                                        <div className={`icon-container ${showComponentsMenu ? 'active-menu' : ''}`} onClick={handleComponentsClick}>
                                            <BiSolidComponent className="icon" />
                                            <p className="icon-subtitle component-subtitle">
                                                <FormattedMessage id="components"/>
                                                {showComponentsMenu ? <MdArrowDropUp /> : <MdArrowDropDown />}
                                            </p>
                                        </div>
                                        {showComponentsMenu && (
                                            <div className="submenu component-submemu">
                                                <p><FormattedMessage id="create"/></p>
                                                <p><FormattedMessage id="seeAll"/></p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="icon-container">
                                        <BiSolidMessageSquareDots className="icon" />
                                        <p className="icon-subtitle"><FormattedMessage id="messages"/></p>
                                    </div>
                                    <div className="icon-container">
                                        <IoNotifications className="icon" />
                                        <p className="icon-subtitle"><FormattedMessage id="notifications"/></p>
                                    </div>
                                    <div className="submenu-container">
                                        <div className={`icon-container ${showProfileMenu ? 'active-menu' : ''}`} onClick={handleProfileClick}>
                                            <div className="photo-container">
                                                <img src={headerPhoto} alt="Profile Pic" /> {/* Show profile picture */}
                                            </div>
                                            <p className="icon-subtitle">
                                                <FormattedMessage id="profile"/>
                                                {showProfileMenu ? <MdArrowDropUp /> : <MdArrowDropDown />}
                                            </p>
                                        </div>
                                        {showProfileMenu && (
                                            <div className="submenu">
                                                <p onClick={()=> handleClickProfile()}><FormattedMessage id="myProfile"/></p>
                                                <p><FormattedMessage id="logout"/></p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </IntlProvider>
        </header>
    );
};

export default Header;