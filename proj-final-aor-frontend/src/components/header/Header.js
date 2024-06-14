import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/Logo_CSW-full-redim.png";
import logoSmall from "../assets/Logo_CSW-small-redim.png";
import defaultPhoto from "../assets/profile_pic_default.png";
import TopHeader from "./TopHeader";
import { IoSearch } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { BiSolidComponent } from "react-icons/bi";
import { BiSolidMessageSquareDots } from "react-icons/bi";
import { IoNotifications } from "react-icons/io5";
import { MdArrowDropDown } from "react-icons/md";
import { MdArrowDropUp } from "react-icons/md";
import "./Header.css";
import { userStore } from "../../stores/UserStore";
import languages from "../../translations";
import { IntlProvider, FormattedMessage } from "react-intl";
import { logoutUser } from "../../services/users";
import { notificationStore } from "../../stores/NotificationStore";
import { getUnreadNotifications } from "../../services/notifications";
import WebSocketClient from "../../websocket/Websocket";

const Header = () => {
  const { token, userId, locale } = userStore();
  const [headerPhoto, setHeaderPhoto] = useState(defaultPhoto);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProjectsMenu, setShowProjectsMenu] = useState(false);
  const [showComponentsMenu, setShowComponentsMenu] = useState(false);

    const {token, userId, name, locale, resetUserStore} = userStore();
  const navigate = useNavigate();
  const location = useLocation();

  const { clearNotifications, setNotifications } = notificationStore();
  const notifications = notificationStore((state) => state.notifications);

  WebSocketClient();

  // Efeito para buscar os dados do usuário ao montar o componente
  useEffect(() => {
    async function fetchData() {
      try {
        if (token) {
          //Quando cria o componente vai buscar a lista de mensagens não lidas do utilizador e coloca-as na store
          const unreadNotifications = await getUnreadNotifications(token);
          console.log(unreadNotifications);

          setNotifications(unreadNotifications);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    }
    fetchData();
  }, [setNotifications, token]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
  }, []);

  const handleSearchIconClick = () => {
    setShowSearchBar(true);
  };

  const handleSearchBarBlur = () => {
    setShowSearchBar(false);
  };

    const logoToRender = isMobile ? logoSmall : logo;
    const logoWidth = isMobile ? '50px' : '200px';

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowProjectsMenu(false);
    setShowComponentsMenu(false);
  };

    
    const handleClickLogout = async() => {
        const response = await logoutUser(token);
        if(response===200){
            resetUserStore();
            navigate("/");
        }
        else{
            console.error("Failed to logout user");
        }
    }
  const handleClickNotificationsPage = () => {
    clearNotifications();
    navigate("/notifications");
  };

    const handleSeeAllProjects = () => {
        if (location.pathname !== "/home" || location.search !== "") {
            navigate("/home", { replace: true });
        }
    }

    }
  };

  return (
    <header>
      <IntlProvider locale={locale} messages={languages[locale]}>
        <TopHeader />
        <div className="bottom-header">
          <div className="header-left">
            <img
              src={logoToRender}
              alt="CSW Logo"
              style={{ width: logoWidth, height: "auto" }}
              loading="lazy"
            />
            {isMobile && !showSearchBar && (
              <IoSearch
                className="icon search-icon"
                onClick={handleSearchIconClick}
              />
            )}
            {(showSearchBar || !isMobile) && (
              <input
                className={`search-bar ${isMobile ? "search-bar-mobile" : ""}`}
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
                  <button onClick={() => navigate("/login")}>
                    <FormattedMessage id="login" />
                  </button>
                  <button onClick={() => navigate("/register")}>
                    <FormattedMessage id="signup" />
                  </button>
                </>
              ) : (
                <>
                  <div className="submenu-container">
                    <div
                      className={`icon-container ${
                        showProjectsMenu ? "active-menu" : ""
                      }`}
                      onClick={handleHomeClick}
                    >
                      <AiFillHome className="icon" />
                      <p className="icon-subtitle">
                        <FormattedMessage id="projects" />
                        {showProjectsMenu ? (
                          <MdArrowDropUp />
                        ) : (
                          <MdArrowDropDown />
                        )}
                      </p>
                    </div>
                    {showProjectsMenu && (
                      <div className="submenu">
                        <p onClick={() => navigate(`/new-project`)}>
                          <FormattedMessage id="create" />
                        </p>
                        <p onClick={() => navigate(`/home`)}>
                          <FormattedMessage id="seeAll" />
                        </p>
                        <p onClick={() => navigate(`/home/${userId}`)}>
                          <FormattedMessage id="myProjects" />
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="submenu-container">
                    <div
                      className={`icon-container ${
                        showComponentsMenu ? "active-menu" : ""
                      }`}
                      onClick={handleComponentsClick}
                    >
                      <BiSolidComponent className="icon" />
                      <p className="icon-subtitle component-subtitle">
                        <FormattedMessage id="components" />
                        {showComponentsMenu ? (
                          <MdArrowDropUp />
                        ) : (
                          <MdArrowDropDown />
                        )}
                      </p>
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
                                                <p className="submenu-clickable" onClick={() => navigate(`/new-project`)}><FormattedMessage id="create"/></p>
                                                <p className="submenu-clickable" onClick={handleSeeAllProjects}><FormattedMessage id="seeAll"/></p>
                                                <p className="submenu-clickable" onClick={handleMyProjects}><FormattedMessage id="myProjects"/></p>
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
                                                <p className="submenu-clickable"><FormattedMessage id="create"/></p>
                                                <p className="submenu-clickable"><FormattedMessage id="seeAll"/></p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="icon-container">
                                        <BiSolidMessageSquareDots className="icon" />
                                        <p className="icon-subtitle"><FormattedMessage id="messages"/></p>
                                    </div>
                                    <div className="icon-container" onClick={handleClickNotificationsPage}>
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
                                                <p className="submenu-name">{name}</p>
                                                <p className="submenu-clickable" onClick={()=> handleClickProfile()}><FormattedMessage id="myProfile"/></p>
                                                <p className="submenu-clickable" onClick={()=>handleClickLogout()}><FormattedMessage id="logout"/></p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                      )}
                      <FormattedMessage id="notifications" />
                    </p>
                  </div>
                  <div className="submenu-container">
                    <div
                      className={`icon-container ${
                        showProfileMenu ? "active-menu" : ""
                      }`}
                      onClick={handleProfileClick}
                    >
                      <div className="photo-container">
                        <img src={headerPhoto} alt="Profile Pic" />{" "}
                        {/* Show profile picture */}
                      </div>
                      <p className="icon-subtitle">
                        <FormattedMessage id="profile" />
                        {showProfileMenu ? (
                          <MdArrowDropUp />
                        ) : (
                          <MdArrowDropDown />
                        )}
                      </p>
                    </div>
                    {showProfileMenu && (
                      <div className="submenu">
                        <p onClick={() => handleClickProfile()}>
                          <FormattedMessage id="myProfile" />
                        </p>
                        <p onClick={() => handleClickLogout()}>
                          <FormattedMessage id="logout" />
                        </p>
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
