import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Home.css";
import languages from "../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";
import Header from "../components/header/Header";
import FilterBar from "../components/header/FilterBar";
import ProjectInfo from "../components/ProjectInfo";
import KeywordsContainer from "../components/keywords/KeywordsContainer";
import ProjectService from "../services/ProjectService";
import SliderContainer from "../components/SliderContainer";
import {userStore} from "../stores/UserStore";
import { useActionsStore } from "../stores/ActionStore";
import { getCountProjectFromUser } from "../services/users";

const Home = () => {
    const navigate = useNavigate();
    const {locale, token} = userStore();
    const {isSliderOpen} = useActionsStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [projectsTotal, setProjectsTotal] = useState(0);
    const [projectsData, setProjectsData] = useState([]);
    const { userId } = useParams();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                try {
                    const userProjectData = await ProjectService.getUserProjectsFullInfo(token, userId);
                    console.log(userProjectData);
                    setProjectsData(userProjectData);
                    const projectCount = await getCountProjectFromUser(userId);
                    setProjectsTotal(projectCount);
                } catch (error) {
                    console.error('Error fetching user projects:', error);
                }
            } else {
                fetchProjectsData();
                fetchCountProjects();
            }
        };
    
        fetchData();
    }, [userId, token]);
    

    

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
    }, []);

    const fetchUserProjects = async (token, userId) => {
        try {
            const response = await ProjectService.getUserProjects(token, userId);
            
            setProjectsData(response);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchProjectsData = async () => {
        try {
            const response = await ProjectService.getAll();
            
            setProjectsData(response);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchCountProjects = async () => {
        try {
            const response = await ProjectService.count();
            
            setProjectsTotal(response);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    

    return (
        <div>
            <Header />
            <FilterBar locale={locale} projectsTotal={projectsTotal}/>

            <IntlProvider locale={locale} messages={languages[locale]}>

            <div className="home-container">

                <div className="left-side">
                    {projectsData.length > 0 ? (
                        <ProjectInfo data={projectsData} />
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>

                {!isMobile && (

                    <div className="right-side">
                        <KeywordsContainer />
                    </div>
                )}

                {isMobile && (
                    <SliderContainer isOpen={isSliderOpen}>
                        <FilterOptions />
                        <KeywordsContainer />
                    </SliderContainer>
                )}
            </div>

            </IntlProvider>
        </div>
    );
};





const FilterOptions = () => {
    
    return (
        <>
            <div className="filter-options">
                <p><FormattedMessage id="state" /></p>
                <div>
                    <div className="radio-wrapper">
                        <input className="radio-input" type="radio" id="planning" name="state" value="Planning" />
                        <label className="radio-label" htmlFor="planning"><FormattedMessage id="PLANNING" /></label>
                    </div>
                    <div className="radio-wrapper">
                        <input className="radio-input" type="radio" id="ready" name="state" value="Ready" />
                        <label className="radio-label" htmlFor="ready"><FormattedMessage id="READY" /></label>
                    </div>
                    <div className="radio-wrapper">
                        <input className="radio-input" type="radio" id="approved" name="state" value="Approved" />
                        <label className="radio-label" htmlFor="approved"><FormattedMessage id="APPROVED" /></label>
                    </div>
                    <div className="radio-wrapper">
                        <input className="radio-input" type="radio" id="inProgress" name="state" value="InProgress" />
                        <label className="radio-label" htmlFor="inProgress"><FormattedMessage id="IN_PROGRESS" /></label>
                    </div>
                    <div className="radio-wrapper">
                        <input className="radio-input" type="radio" id="finished" name="state" value="Finished" />
                        <label className="radio-label" htmlFor="finished"><FormattedMessage id="FINISHED" /></label>
                    </div>
                    <div className="radio-wrapper">
                        <input className="radio-input" type="radio" id="cancelled" name="state" value="Cancelled" />
                        <label className="radio-label" htmlFor="cancelled"><FormattedMessage id="CANCELLED" /></label>
                    </div>
                </div>
            </div>
            
            <div className="filter-options">
                <p><FormattedMessage id="sortBy" /></p>
                <div>
                    <div className="radio-wrapper">
                        <input className="radio-input" type="radio" id="newest" name="sort" value="Newest" />
                        <label className="radio-label" htmlFor="newest"><FormattedMessage id="newest" /></label>
                    </div>
                    <div className="radio-wrapper">
                        <input className="radio-input" type="radio" id="oldest" name="sort" value="Oldest" />
                        <label className="radio-label" htmlFor="oldest"><FormattedMessage id="oldest" /></label>
                    </div>
                    <div className="radio-wrapper">
                        <input className="radio-input" type="radio" id="vacanciesLow" name="sort" value="VacanciesLow" />
                        <label className="radio-label" htmlFor="vacanciesLow"><FormattedMessage id="vacancies" /> : <FormattedMessage id="lowToHigh" /></label>
                    </div>
                    <div className="radio-wrapper">
                        <input className="radio-input" type="radio" id="vacanciesHigh" name="sort" value="VacanciesHigh" />
                        <label className="radio-label" htmlFor="vacanciesHigh"><FormattedMessage id="vacancies" /> : <FormattedMessage id="highToLow" /></label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;