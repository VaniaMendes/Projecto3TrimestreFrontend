import React, {useState, useEffect, useRef} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./Keywords.css";
import { IoSearch } from "react-icons/io5";
import { FormattedMessage } from "react-intl";
import KeywordComponent from "./KeywordComponent";
import SkillInterestService from "../../services/SkillInterestService";
import ProjectService from "../../services/ProjectService";

const KeywordsContainer = (props) => {
    const {isMobile} = props;
    const [keywords, setKeywords] = useState([]);
    const [clickedKeyword, setClickedKeyword] = useState(null);
    const [showSearchKeywordBar, setShowSearchKeywordBar] = useState(false);
    const searchContainerRef = useRef(null);
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchKeywords();
    }, []);

    useEffect(() => {
        if (clickedKeyword) {
            const currentPath = location.pathname;
            const newSearchParams = new URLSearchParams(location.search);
            newSearchParams.set('keyword', clickedKeyword);
    
            navigate(`${currentPath}?${newSearchParams.toString()}`);
        }
    }, [clickedKeyword]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const fetchKeywords = async () => {
        try {
            const skills = await SkillInterestService.getAllSkills();
            const projKeywords = await ProjectService.getKeywords();

            setKeywords([...skills, ...projKeywords]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearchIconClick = (event) => {
        event.stopPropagation();
        setShowSearchKeywordBar(true);
    };

    const handleKeywordClick = (keyword) => {
        console.log("Keyword clicked:", keyword);
        setClickedKeyword(keyword);
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
            {keywords.map((keyword, index) => {
                let keywordName;
                if (typeof keyword === 'object' && keyword !== null) {
                    keywordName = keyword.name;
                } else if (typeof keyword === 'string') {
                    keywordName = keyword;
                }
                return <KeywordComponent key={index} keyword={keywordName} isProjectInfo={false} onClick={handleKeywordClick}/>
            })}
            </div>
        </div>
    );
}

export default KeywordsContainer;