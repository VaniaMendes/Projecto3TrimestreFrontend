import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Keywords.css";
import { IoSearch } from "react-icons/io5";
import { FormattedMessage, useIntl } from "react-intl";
import KeywordComponent from "./KeywordComponent";
import SkillInterestService from "../../services/SkillInterestService";
import ProjectService from "../../services/ProjectService";

const KeywordsContainer = (props) => {
    const intl = useIntl();
    const { isMobile } = props;
    const [keywords, setKeywords] = useState([]);
    const [filteredKeywords, setFilteredKeywords] = useState([]);
    const [clickedKeyword, setClickedKeyword] = useState(null);
    const [showSearchKeywordBar, setShowSearchKeywordBar] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const searchContainerRef = useRef(null);
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

            // Combine arrays and remove duplicates, preserving original format
            const combinedKeywords = [...skills, ...projKeywords];
            const seen = new Set();
            const uniqueKeywords = combinedKeywords.filter(keyword => {
                if (typeof keyword === 'object' && keyword !== null) {
                    keyword = keyword.name;
                }
                if (typeof keyword !== 'string') {
                    console.warn('Non-string keyword encountered:', keyword);
                    return false;
                }
                const normalizedKeyword = keyword.trim().toLowerCase();
                if (seen.has(normalizedKeyword)) {
                    return false;
                }
                seen.add(normalizedKeyword);
                return true;
            });

            setKeywords(uniqueKeywords);
            setFilteredKeywords(uniqueKeywords);
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

    const handleSearchInputChange = async (event) => {
        const inputValue = event.target.value;
        setSearchInput(inputValue);

        if (inputValue.trim() !== "") {
            try {
                const searchResults = await ProjectService.searchKeywords(inputValue);
                setFilteredKeywords(searchResults);
            } catch (error) {
                console.error('Error searching keywords:', error);
            }
        } else {
            // If the search input is cleared, show all keywords again
            setFilteredKeywords(keywords);
        }
    };

    return (
        <div className={isMobile ? "kw-mobile" : "kw-full"}>
            <div className="sk-title-container">
                <h3><FormattedMessage id="skills" /> / </h3>
                <h3><FormattedMessage id="keywords" /></h3>
                <div className="search-keyword-container" ref={searchContainerRef}>
                    {!showSearchKeywordBar && (
                        <IoSearch className="search-keyword-icon" onClick={handleSearchIconClick} title={intl.formatMessage({ id: "searchKeywords" })} />
                    )}
                    {showSearchKeywordBar && (
                        <input
                            className="search-keyword-input"
                            type="search"
                            placeholder={intl.formatMessage({ id: "searchKeywords" })}
                            onChange={handleSearchInputChange}
                            value={searchInput}
                            autoFocus
                        />
                    )}
                </div>
            </div>

            <div className="keywords-container">
                {filteredKeywords.map((keyword, index) => {
                    let keywordName;
                    if (typeof keyword === 'object' && keyword !== null) {
                        keywordName = keyword.name;
                    } else if (typeof keyword === 'string') {
                        keywordName = keyword;
                    }
                    return <KeywordComponent key={index} id={keyword.id} keyword={keywordName} isProjectInfo={false} onClick={handleKeywordClick} />
                })}
            </div>
        </div>
    );
}

export default KeywordsContainer;