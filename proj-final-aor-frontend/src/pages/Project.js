import React, { useEffect, useState } from "react";
import "./Project.css";
import Header from "../components/header/Header";
import { FormattedMessage, IntlProvider } from "react-intl";
import { userStore } from "../stores/UserStore";
import languages from "../translations";
import { useNavigate, useParams } from "react-router";
import ProjectService from "../services/ProjectService";
import MemberDisplay from "../components/MemberDisplay";
import KeywordComponent from "../components/keywords/KeywordComponent";

const Project = () => {
    const {locale, token} = userStore();
    const navigate = useNavigate();
    const  [projectData, setProjectData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { projectId } = useParams();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ProjectService.getProjectInfo(projectId);
                console.log(response);

                // Assuming keywords are a comma-separated string
                if (response.keywords) {
                    response.keywords = response.keywords.split(',');
                }

                setProjectData(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching project:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />

            <IntlProvider locale={locale} messages={languages[locale]}>

                <div className="project-page-container">
                    <div className="project-page-content">
                        <div className="project-page-header">
                            <h1>{projectData.name}</h1>
                            {projectData.lab && <h2>{projectData.lab.name}</h2>}
                            <h3>{projectData.stateId}</h3>
                        </div>

                        <div className="project-page-info">
                            <h4><FormattedMessage id="description"/>:</h4>
                            <p>{projectData.description}</p>
                        </div>

                        <div className="project-page-keywords">
                            <h4><FormattedMessage id="keywords"/>:</h4>
                            {projectData.keywords && projectData.keywords.map((keyword, index) => (
                                <KeywordComponent keyword={keyword.trim()} key={index} isProjectInfo={true} />
                            ))}
                        </div>

                        <div className="project-page-skills">
                            <h4><FormattedMessage id="skills"/>:</h4>
                                {projectData.skills.map((skill, index) => (
                                    <KeywordComponent keyword={skill.name} key={index} isProjectInfo={true}/>
                                ))}
                        </div>

                        <div className="project-page-members">
                            {projectData.usersInfo && projectData.usersInfo.map((user, userIndex) => (
                                <MemberDisplay
                                    key={userIndex}
                                    photo={user.photo}
                                    name={user.firstName + " " + user.lastName}
                                    role={user.userType}
                                />
                            ))}   
                        </div>
                    </div>
                </div>

            </IntlProvider>
        </>
    );
};

export default Project;