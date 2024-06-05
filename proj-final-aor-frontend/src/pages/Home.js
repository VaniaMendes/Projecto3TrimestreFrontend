import React, {useState, useEffect} from "react";
import "./Home.css";
import Header from "../components/header/Header";
import FilterBar from "../components/FilterBar";
import ProjectInfo from "../components/ProjectInfo";
import KeywordsContainer from "../components/keywords/KeywordsContainer";
import {userStore} from "../stores/UserStore";
import languages from "../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";
import ProjectService from "../services/ProjectService";

const Home = () => {
    const {locale} = userStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [projectsTotal, setProjectsTotal] = useState(0);
    
    const [projectsData, setProjectsData] = useState([]);

    useEffect(() => {
        fetchProjectsData();
        featchCountProjects();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
    }, []);

    const fetchProjectsData = async () => {
        try {
            const response = await ProjectService.getAll();
            
            setProjectsData(response);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const featchCountProjects = async () => {
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

            </div>

            </IntlProvider>
        </div>
    );
};

export default Home;