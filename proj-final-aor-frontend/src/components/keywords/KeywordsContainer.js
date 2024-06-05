import React, {useState, useEffect, useRef} from "react";
import "./Keywords.css";
import { IoSearch } from "react-icons/io5";
import { FormattedMessage } from "react-intl";
import KeywordComponent from "./KeywordComponent";
import SkillInterestService from "../../services/SkillInterestService";

const KeywordsContainer = (props) => {
    const {isMobile} = props;

    const [keywords, setKeywords] = useState([]);

    const [showSearchKeywordBar, setShowSearchKeywordBar] = useState(false);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        fetchKeywords();
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const fetchKeywords = async () => {
        try {
            const skills = await SkillInterestService.getAllSkills();
            console.log("skill", skills);

            const interests = await SkillInterestService.getAllInterests();
            console.log("interests", interests);

            setKeywords([...skills, ...interests]);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

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
        <div className={isMobile ? "kw-full" : "kw-mobile"}>
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
                {keywords.map((keyword, index) => (
                    <KeywordComponent key={index} keyword={keyword.name} isProjectInfo={false}/>
                ))}
            </div>
        </div>
    );
}

export default KeywordsContainer;