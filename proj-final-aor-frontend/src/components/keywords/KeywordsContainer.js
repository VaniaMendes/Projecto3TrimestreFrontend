import React, {useState, useEffect, useRef} from "react";
import "./Keywords.css";
import { IoSearch } from "react-icons/io5";
import { FormattedMessage } from "react-intl";
import KeywordComponent from "./KeywordComponent";
import SkillInterestService from "../../services/SkillInterestService";
import { useActionsStore } from "../../stores/ActionStore";
import ProjectService from "../../services/ProjectService";

const KeywordsContainer = (props) => {
    const {isMobile, updateProjectData } = props;
    const {sortBy, updateAreProjectsFromKeyword} = useActionsStore();
    const [keywords, setKeywords] = useState([]);
    const [clickedKeyword, setClickedKeyword] = useState(null);
    const [showSearchKeywordBar, setShowSearchKeywordBar] = useState(false);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        fetchKeywords();
    }, []);

    useEffect(() => {
        if (clickedKeyword) {
            fetchProjectsByKeyword(clickedKeyword, sortBy);
        }
    }, [clickedKeyword, sortBy]);

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

    const fetchProjectsByKeyword = async (keyword) => {
        try {
            updateAreProjectsFromKeyword(true);
            const projects = await ProjectService.getProjectsByKeyword(keyword, sortBy);
            await updateProjectData(projects);
            

            console.log('Projects by keyword:', projects);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

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