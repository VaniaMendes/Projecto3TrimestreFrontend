import React, { useEffect, useState } from "react";
import "./Project.css";
import defaultPhoto from "../components/assets/profile_pic_default.png"
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
                            <div className="cretor-project-name-container">
                                <div className="creator-info-container">
                                    {projectData.usersInfo[0].userType === "CREATOR" && (
                                        <>
                                            <div className="photo-container">
                                                <img src={projectData.usersInfo[0].photo || defaultPhoto} alt="creator" />
                                            </div>
                                            <h4><FormattedMessage id={projectData.usersInfo[0].userType}/> </h4>
                                        </>
                                    )}
                                </div>
                                <h1>{projectData.name}</h1>
                            </div>
                            
                            <button className="project-page-candidate-button"><FormattedMessage id="candidate"/></button>
                        </div>

                        <div className="project-page-info">
                            <div className="ppi-cont">
                                <h4><FormattedMessage id="lab"/> :&nbsp; </h4>
                                {projectData.lab && <p><FormattedMessage id={projectData.lab.name}/></p>}
                            </div>

                            <div className="ppi-cont">
                                <h4><FormattedMessage id="state"/> :&nbsp; </h4>
                                <p><FormattedMessage id={projectData.stateId}/></p>
                            </div>

                            <div className="ppi-cont">
                                <h4><FormattedMessage id="maxMembers"/> :&nbsp; </h4>
                                <p>{projectData.maxMembers}</p>
                            </div>
                        </div>

                        <div className="project-page-description">
                            <label className="c-label"><FormattedMessage id="description"/></label>
                            <p>{projectData.description}</p>
                        </div>

                        <div className="project-page-keywords">
                            <label className="c-label"><FormattedMessage id="keywords"/></label>
                            {projectData.keywords && projectData.keywords.map((keyword, index) => (
                                <KeywordComponent keyword={keyword.trim()} key={index} isProjectInfo={true} />
                            ))}
                        </div>

                        <div className="project-page-skills">
                            <label className="c-label"><FormattedMessage id="skills"/></label>
                                {projectData.skills.map((skill, index) => (
                                    <KeywordComponent keyword={skill.name} key={index} isProjectInfo={true}/>
                                ))}
                        </div>

                        <div className="project-page-members">
                            <label className="c-label"><FormattedMessage id="teamMembers"/></label>
                            {projectData.usersInfo && projectData.usersInfo.map((user, userIndex) => (
                                <MemberDisplay
                                    key={userIndex}
                                    photo={user.photo}
                                    name={user.firstName + " " + user.lastName}
                                    role={user.userType}
                                />
                            ))}   
                        </div>

                        <div className="project-page-resources">
                            <label className="c-label"><FormattedMessage id="resources"/></label>
                            {projectData.resources && projectData.resources.map((skill, index) => (
                                <KeywordComponent keyword={skill.name} key={index} isProjectInfo={true}/>
                            ))}
                        </div>

                        <div className="project-page-plan">
                            <label className="c-label"><FormattedMessage id="plan"/></label>
                        </div>
                    </div>
                </div>

            </IntlProvider>
        </>
    );
};

export default Project;