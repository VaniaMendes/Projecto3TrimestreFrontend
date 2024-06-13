import React, {useState, useEffect} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./Home.css";
import languages from "../translations"; 
import { IntlProvider } from "react-intl";
import Header from "../components/header/Header";
import FilterBar from "../components/header/FilterBar";
import ProjectInfo from "../components/projects/ProjectInfo";
import KeywordsContainer from "../components/keywords/KeywordsContainer";
import ProjectService from "../services/ProjectService";
import SliderContainer from "../components/SliderContainer";
import { userStore } from "../stores/UserStore";
import { useActionsStore } from "../stores/ActionStore";
import { getCountProjectFromUser } from "../services/users";
import FilterOptions from "../components/FilterOptions";

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {locale, token} = userStore();
    const { isSliderOpen, stateId, vacancies, sortBy} = useActionsStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [projectsTotal, setProjectsTotal] = useState(0);
    const [projectsData, setProjectsData] = useState([]);
    const { userId } = useParams();

    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword');

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);


    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                try {
                    const [userProjectData, projectCount] = await Promise.all([
                        ProjectService.getUserProjectsFullInfo(token, userId, sortBy, vacancies, stateId),
                        getCountProjectFromUser(userId, stateId)
                    ]);
                    setProjectsData(userProjectData);
                    setProjectsTotal(projectCount);
                } catch (error) {
                    console.error('Error fetching user projects:', error);
                }
            } else {
                if (keyword) {
                    fetchProjectsByKeyword(keyword);
                    fetchCountProjectsByKeyword(keyword);
                } else {
                    fetchProjectsData(sortBy, vacancies, stateId);
                    fetchCountProjects(stateId);
                }
            }
    
            
        }
    
        fetchData();
    }, [userId, token, sortBy, vacancies, stateId, keyword]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
    }, []);

    const fetchProjectsData = async (sortBy, vacancies, stateId) => {
        try {
            const response = await ProjectService.getProjects(sortBy, vacancies, stateId);
            setProjectsData(response);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchCountProjects = async (state) => {
        try {
            const response = await ProjectService.count(state);
            setProjectsTotal(response);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchProjectsByKeyword = async (keyword) => {
        try {
            const projects = await ProjectService.getProjectsByKeyword(keyword, sortBy);
            setProjectsData(projects);
            console.log('Projects by keyword:', projects);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchCountProjectsByKeyword = async (keyword) => {
        try {
            const count = await ProjectService.countByKeyword(keyword);
            setProjectsTotal(count);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleProjectClick = (projectId) => {
        navigate(`/project/${projectId}`);
    };
    

    return (
        <div>
            <Header />
            <FilterBar locale={locale} projectsTotal={projectsTotal}/>

            <IntlProvider locale={locale} messages={languages[locale]}>

            <div className="home-container">

                <div className="left-side">
                    {projectsData && projectsData.length > 0 ? (
                        <ProjectInfo data={projectsData} onClick={handleProjectClick}/>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>

                {!isMobile && (

                    <div className="right-side">
                        <KeywordsContainer/>
                    </div>
                )}

                {isMobile && (
                    <SliderContainer isOpen={isSliderOpen}>
                        <FilterOptions locale={locale} isFilterBar={false} />
                        <KeywordsContainer/>
                    </SliderContainer>
                )}
            </div>

            </IntlProvider>
        </div>
    );
};


export default Home;