import React, {useState, useEffect} from "react";
import './FilterBar.css';
import { MdArrowDropDown } from "react-icons/md";
import { MdArrowDropUp } from "react-icons/md";
import { BiSliderAlt } from "react-icons/bi";
import languages from "../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";

const FilterBar = (props) => {
    const {locale, projectsTotal, componentsTotal} = props;
    const [state, setState] = useState('all');
    const [stateSelected, setStateSelected] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [sortBySelected, setSortBySelected] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
    }, []);

    const handleClickState = () => {
        setStateSelected(!stateSelected);
        setSortBySelected(false);
    };

    const handleClickSortBy = () => {
        setSortBySelected(!sortBySelected);
        setStateSelected(false);
    };

    return (
        <div className="filter-bar-container roboto-medium">
            <IntlProvider locale={locale} messages={languages[locale]}>
                {projectsTotal > 0 && (
                    <p>{projectsTotal} <FormattedMessage id="projects"/></p>
                )}
                {componentsTotal > 0 && (
                    <p>{componentsTotal} <FormattedMessage id="components"/></p>
                )}
                
                <div className="right-side">
                    {isMobile ? <BiSliderAlt className="filter-icon"/> : (
                        <>
                            <p className={stateSelected ? 'active-item' : ''} onClick={handleClickState}>
                                <FormattedMessage id="state"/>
                                {stateSelected ? <MdArrowDropUp /> : <MdArrowDropDown/>}
                            </p>
                            {stateSelected && (
                                <div className={`select-container ${stateSelected ? 'show' : ''}`}>
                                    <div className="radio-wrapper">
                                        <input className="radio-input" type="radio" id="planning" name="state" value="Planning" />
                                        <label className="radio-label" htmlFor="planning"><FormattedMessage id="PLANNING"/></label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input className="radio-input" type="radio" id="ready" name="state" value="Ready" />
                                        <label className="radio-label" htmlFor="ready"><FormattedMessage id="READY"/></label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input className="radio-input" type="radio" id="approved" name="state" value="Approved" />
                                        <label className="radio-label" htmlFor="approved"><FormattedMessage id="APPROVED"/></label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input className="radio-input" type="radio" id="inProgress" name="state" value="InProgress" />
                                        <label className="radio-label" htmlFor="inProgress"><FormattedMessage id="IN_PROGRESS"/></label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input className="radio-input" type="radio" id="finished" name="state" value="Finished" />
                                        <label className="radio-label" htmlFor="finished"><FormattedMessage id="FINISHED"/></label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input className="radio-input" type="radio" id="cancelled" name="state" value="Cancelled" />
                                        <label className="radio-label" htmlFor="cancelled"><FormattedMessage id="CANCELLED"/></label>
                                    </div>
                                </div>
                            )}
                            <p className={sortBySelected ? 'active-item' : ''} onClick={handleClickSortBy}>
                                <FormattedMessage id="sortBy"/>
                                {sortBySelected ? <MdArrowDropUp /> : <MdArrowDropDown/>}
                            </p>
                            {sortBySelected && (
                                <div className={`select-container ${sortBySelected ? 'show' : ''}`}>
                                    <div className="radio-wrapper">
                                        <input className="radio-input" type="radio" id="newest" name="sort" value="Newest" />
                                        <label className="radio-label" htmlFor="newest"><FormattedMessage id="newest"/></label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input className="radio-input" type="radio" id="oldest" name="sort" value="Oldest" />
                                        <label className="radio-label" htmlFor="oldest"><FormattedMessage id="oldest"/></label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input className="radio-input" type="radio" id="vacanciesLow" name="sort" value="VacanciesLow" />
                                        <label className="radio-label" htmlFor="vacanciesLow"><FormattedMessage id="vacancies"/> : <FormattedMessage id="lowToHigh"/></label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input className="radio-input" type="radio" id="vacanciesHigh" name="sort" value="VacanciesHigh" />
                                        <label className="radio-label" htmlFor="vacanciesHigh"><FormattedMessage id="vacancies"/> : <FormattedMessage id="highToLow"/></label>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </IntlProvider>
        </div>
    )
};

export default FilterBar;