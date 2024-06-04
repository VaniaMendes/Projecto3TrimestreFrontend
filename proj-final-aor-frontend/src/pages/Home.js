import React, {useState, useEffect, useRef} from "react";
import "./Home.css";
import Header from "../components/header/Header";
import FilterBar from "../components/FilterBar";
import ProjectInfo from "../components/ProjectInfo";
import KeywordComponent from "../components/KeywordComponent";
import {userStore} from "../stores/UserStore";
import { IoSearch } from "react-icons/io5";
import languages from "../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";

const Home = () => {
    const {token, userData, locale} = userStore();
    const [showSearchKeywordBar, setShowSearchKeywordBar] = useState(false);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleSearchIconClick = (event) => {
        event.stopPropagation();
        setShowSearchKeywordBar(true);
    };

    const handleClickOutside = (event) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
            setShowSearchKeywordBar(false);
        }
    };

    return (
        <div>
            <Header />
            <FilterBar locale={locale}/>

            <IntlProvider locale={locale} messages={languages[locale]}>

            <div className="home-container">

                <div className="left-side">
                    <ProjectInfo locale={locale}/>
                    <ProjectInfo locale={locale}/>
                    <ProjectInfo locale={locale}/>
                    <ProjectInfo locale={locale}/>
                    <ProjectInfo locale={locale}/>
                </div>

                <div className="right-side">
                    <div className="sk-title-container">
                        <h3><FormattedMessage id="skills"/> / </h3>
                        <h3><FormattedMessage id="keywords"/></h3>
                        <div className="search-keyword-container" ref={searchContainerRef}>
                        {!showSearchKeywordBar && (
                            <IoSearch className="search-keyword-icon" onClick={handleSearchIconClick}/>
                        )}
                        {showSearchKeywordBar && (
                            <input className="search-keyword-input" type="search" placeholder="Search..." autoFocus/>
                        )}
                        </div>
                    </div>
                    
                    <div className="keywords-container">
                        <KeywordComponent keyword="Keyword 1"/>
                        <KeywordComponent keyword="Keyword asdasdasda"/>
                        <KeywordComponent keyword="Keyw"/>
                        <KeywordComponent keyword="Keyword 3"/>
                        <KeywordComponent keyword="Keyword 5"/>
                        <KeywordComponent keyword="Keyword 6"/>
                        <KeywordComponent keyword="Keyword 7"/>
                        <KeywordComponent keyword="Keyword 8"/>
                    </div>

                </div>

            </div>

            </IntlProvider>
        </div>
    );
};

export default Home;