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
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import "./Header.css";
import { userStore } from "../../stores/UserStore";
import { FormattedMessage, useIntl } from "react-intl";
import { logoutUser } from "../../services/users";
import { notificationStore } from "../../stores/NotificationStore";
import WebSocketClient from "../../websocket/Websocket";
import Settings from "./Settings";
import ProjectService from "../../services/ProjectService";

const Header = (props) => {
  const { searchInput, setSearchInput } = props;
  const intl = useIntl();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProjectsMenu, setShowProjectsMenu] = useState(false);
  const [showComponentsMenu, setShowComponentsMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchInputProjectsName, setSearchInputProjectsName] = useState("");
  const [ProjectsNameData, setProjectsNameData] = useState([]);
  const { token, userId, name, resetUserStore , photo, typeUser} = userStore();

  const navigate = useNavigate();
  const location = useLocation();

  const { clearNotifications, notifications } = notificationStore();
  WebSocketClient();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (searchInput) {
      setSearchInput(searchInput);
    } else {
      setSearchInputProjectsName(searchInputProjectsName);
    }
  }, [searchInput, searchInputProjectsName]);

  useEffect(() => {
    if (searchInputProjectsName) {
      const fetchData = async () => {
        const response = await ProjectService.searchProjectsByName(searchInputProjectsName, 1, false, "desc");
        
        const projectsInfo = response.map(project => ({
          name: project.name,
          id: project.id
        }));
        setProjectsNameData(projectsInfo);
      };
      fetchData();
    }
  }, [searchInputProjectsName]);

  const handleSearchIconClick = () => {
    setShowSearchBar(true);
  };

  const handleSearchBarBlur = () => {
    setShowSearchBar(false);
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowProjectsMenu(false);
    setShowComponentsMenu(false);
  };

  const handleClickLogout = async () => {
    const response = await logoutUser(token);
    if (response === 200) {
      resetUserStore();
      navigate("/");
    } else {
      console.error("Failed to logout user");
    }
  };

  const handleClickSettings = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowSettingsModal(true);
  };

  const handleClickNotificationsPage = () => {
    clearNotifications();
    setSearchInput("");
    navigate("/notifications");
  };

  const handleSeeAllProjects = () => {
    if (location.pathname !== "/home" || location.search !== "") {
      navigate("/home", { replace: true });
    }
    setSearchInput("");
  };

  const handleHomeClick = () => {
    setShowProjectsMenu(!showProjectsMenu);
    setShowComponentsMenu(false);
    setShowProfileMenu(false);
  };

  const handleComponentsClick = () => {
    setShowComponentsMenu(!showComponentsMenu);
    setShowProjectsMenu(false);
    setShowProfileMenu(false);
  };

  const logoToRender = isMobile ? logoSmall : logo;
  const logoWidth = isMobile ? "50px" : "200px";

  const handleClickProfile = () => {
    setSearchInput("");
    navigate(`/profile/${userId}`);
  };

  const handleMyProjects = () => {
    if (location.pathname !== `/home/${userId}` || location.search !== "") {
      navigate(`/home/${userId}`, { replace: true });
    }
    setSearchInput("");
  };

  const handleMessages = () => {
    setSearchInput("");
    navigate(`/messages/${userId}`, { replace: true });
  }

  const handleSearchInputChange = (event) => {
    const path = location.pathname;

    if (path === '/home' || path === '/' || path.startsWith('/home/')) {
      setSearchInput(event.target.value);
    } else {
      setSearchInputProjectsName(event.target.value);
    }
  };

  return (
    <header>
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
                placeholder={intl.formatMessage({ id: "searchProjects" })}
                onChange={handleSearchInputChange}
                value={searchInput}
                autoFocus={isMobile}
                onBlur={isMobile ? handleSearchBarBlur : null}
              />
            )}
          </div>
          {ProjectsNameData.length > 0 && (
            <div className="search-results">
              {ProjectsNameData.map((project) => (
                <p
                  className="search-result"
                  key={project.id}
                  onClick={() => {
                    setSearchInputProjectsName("");
                    navigate(`/project/${project.id}`);
                  }}
                >
                  {project.name}
                </p>
              ))}
            </div>
          )}
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
                        <p
                          className="submenu-clickable"
                          onClick={() => { setSearchInput(""); navigate(`/new-project`); }}
                        >
                          <FormattedMessage id="create" />
                        </p>
                        <p
                          className="submenu-clickable"
                          onClick={handleSeeAllProjects}
                        >
                          <FormattedMessage id="seeAll" />
                        </p>
                        <p
                          className="submenu-clickable"
                          onClick={handleMyProjects}
                        >
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
                    {showComponentsMenu && (
                      <div className="submenu component-submemu">
                        <p className="submenu-clickable" onClick={() => { setSearchInput(""); navigate(`/new-resource`); }}>
                          <FormattedMessage id="create" />
                        </p>
                        <p className="submenu-clickable" onClick={() => { setSearchInput(""); navigate(`/resources`); }}>
                          <FormattedMessage id="seeAll" />
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="icon-container" onClick={handleMessages}>
                    <BiSolidMessageSquareDots className="icon" />
                    <p className="icon-subtitle">
                      <FormattedMessage id="messages" />
                    </p>
                  </div>
                  <div className="icon-container" onClick={handleClickNotificationsPage}>
                    <IoNotifications className="icon" />
                    <p className="icon-subtitle">
                      <FormattedMessage id="notifications" />
                    </p>
                    {notifications > 0 &&(
                    <div className="notification-badge ">{notifications}</div>)}
                  </div>
                  <div className="submenu-container">
                    <div
                      className={`icon-container ${
                        showProfileMenu ? "active-menu" : ""
                      }`}
                      onClick={handleProfileClick}
                    >
                      <div className="photo-container">
                        <img src={photo || defaultPhoto} alt="Profile Pic" />{" "}
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
                        <p className="submenu-name">{name}</p>
                        <p
                          className="submenu-clickable"
                          onClick={() => handleClickProfile()}
                        >
                          <FormattedMessage id="myProfile" />
                        </p>
                        {typeUser === "ADMIN" && ( 
                        <p
                          className="submenu-clickable"
                          onClick={() => handleClickSettings()}
                        >
                          <FormattedMessage id="settings" />
                        </p>)}
                        <p
                          className="submenu-clickable"
                          onClick={() => handleClickLogout()}
                        >
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
        {showSettingsModal &&  <Settings onClose={() => setShowSettingsModal(false)} />}
    </header>
  );
};

Header.defaultProps = {
  setSearchInput: () => {},
};

export default Header;