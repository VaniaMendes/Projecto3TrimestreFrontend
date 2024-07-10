import React, {useState, useEffect} from "react";
import './FilterBar.css';
import { BiSliderAlt } from "react-icons/bi";
import { useActionsStore } from "../../stores/ActionStore";
import { userStore } from "../../stores/UserStore";
import {FormattedMessage } from "react-intl";
import FilterOptions from "../FilterOptions";
import { useLocation } from "react-router";
import { AiFillHome } from "react-icons/ai";
import { FaUserLarge } from "react-icons/fa6";

const FilterBar = (props) => {
    const {isSliderOpen, updateIsSliderOpen} = useActionsStore();
    const {userId} = userStore();
    const {projectsTotal, componentsTotal} = props;
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const location = useLocation();

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
                <div className="left-side">
                    {projectsTotal > -1 && (
                        <p>{projectsTotal} <FormattedMessage id={projectsTotal === 1 ? "project" : "projects"}/></p>
                    )}
                    {componentsTotal > -1 && (
                        <p>{componentsTotal} <FormattedMessage id={componentsTotal === 1 ? "component" : "components"}/></p>
                    )}
                </div>
                <div className="center-side">
                    {location.pathname === "/home" ? (
                        <AiFillHome size='1.2em' color="#C01722"/>
                    ) : location.pathname === `/home/${userId}` ? (
                        <FaUserLarge size='1.2em' color="#C01722"/>
                    ) : null}
                </div>
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
        </div>
    )
};

export default FilterBar;