import React, {useState, useEffect} from "react";
import './FilterBar.css';
import { MdArrowDropDown } from "react-icons/md";
import { MdArrowDropUp } from "react-icons/md";
import { BiSliderAlt } from "react-icons/bi";
import languages from "../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";

const FilterBar = (props) => {
    const {locale} = props;
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
                <p>XXX <FormattedMessage id="projects"/></p>
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
                                        <input type="radio" id="planning" name="state" value="Planning" />
                                        <label htmlFor="planning"><FormattedMessage id="planning"/></label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input type="radio" id="ready" name="state" value="Ready" />
                                        <label htmlFor="ready"><FormattedMessage id="ready"/></label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input type="radio" id="approved" name="state" value="Approved" />
                                        <label htmlFor="approved"><FormattedMessage id="approved"/></label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input type="radio" id="inProgress" name="state" value="InProgress" />
                                        <label htmlFor="inProgress"><FormattedMessage id="inProgress"/></label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input type="radio" id="finished" name="state" value="Finished" />
                                        <label htmlFor="finished"><FormattedMessage id="finished"/></label>
                                    </div>
                                    <div className="radio-wrapper">
                                        <input type="radio" id="cancelled" name="state" value="Cancelled" />
                                        <label htmlFor="cancelled"><FormattedMessage id="cancelled"/></label>
                                    </div>
                                </div>
                            )}
                            <p className={sortBySelected ? 'active-item' : ''} onClick={handleClickSortBy}>
                                <FormattedMessage id="sortBy"/>
                                {sortBySelected ? <MdArrowDropUp /> : <MdArrowDropDown/>}
                            </p>
                            {sortBySelected && (
                                <div className="select-container">
                                    <div>
                                        <input type="radio" id="newest" name="sort" value="Newest" />
                                        <label htmlFor="newest"><FormattedMessage id="newest"/></label>
                                    </div>
                                    <div>
                                        <input type="radio" id="oldest" name="sort" value="Oldest" />
                                        <label htmlFor="oldest"><FormattedMessage id="oldest"/></label>
                                    </div>
                                    <div>
                                        <input type="radio" id="vacanciesLow" name="sort" value="VacanciesLow" />
                                        <label htmlFor="vacanciesLow"><FormattedMessage id="vacancies"/> : <FormattedMessage id="lowToHigh"/></label>
                                    </div>
                                    <div>
                                        <input type="radio" id="vacanciesHigh" name="sort" value="VacanciesHigh" />
                                        <label htmlFor="vacanciesHigh"><FormattedMessage id="vacancies"/> : <FormattedMessage id="highToLow"/></label>
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