import React, {useState, useEffect} from "react";
import './FilterBar.css';
import { BiSliderAlt } from "react-icons/bi";
import { useActionsStore } from "../../stores/ActionStore";
import languages from "../../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";
import FilterOptions from "../FilterOptions";

const FilterBar = (props) => {
    const {isSliderOpen, updateIsSliderOpen} = useActionsStore();
    const {locale, projectsTotal, componentsTotal} = props;
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
    }, []);


    const handleClickSliderIcon = () => {
        updateIsSliderOpen(!isSliderOpen);
    }

    return (
        <div className="filter-bar-container roboto-medium">
            <IntlProvider locale={locale} messages={languages[locale]}>
                {projectsTotal > -1 && (
                    <p>{projectsTotal} <FormattedMessage id={projectsTotal === 1 ? "project" : "projects"}/></p>
                )}
                {componentsTotal > -1 && (
                    <p>{componentsTotal} <FormattedMessage id={componentsTotal === 1 ? "component" : "components"}/></p>
                )}
                
                <div className="right-side">
                    {isMobile ? (
                        <BiSliderAlt className={isSliderOpen ? "slider-icon-active" : 'slider-icon'} onClick={handleClickSliderIcon}/>
                    ) : (
                        <>
                            {projectsTotal > -1 && (
                                <FilterOptions isProjectsFilterBar={true} />
                            )}
                            {componentsTotal > -1 && (
                                <FilterOptions isResourcesFilterBar={true} />
                            )}
                        </>
                    )}
                </div>
            </IntlProvider>
        </div>
    )
};

export default FilterBar;