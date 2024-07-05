import React, { useEffect, useState } from "react";
import "./Project.css";
import { userStore } from "../stores/UserStore";
import { useNavigate, useParams } from "react-router";
import ProjectService from "../services/ProjectService";
import { FormattedMessage } from "react-intl";
import Header from "../components/header/Header";


const ProjectActivities = () => {
    const {token, userId} = userStore();
    const {projectId} = useParams();
    const [activityRecord, setActivityRecord] = useState([]);
    const [projectName, setProjectName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            const responseProject = await ProjectService.getProjectInfo(token, projectId);

            if (!isUserInProject(responseProject)) {
                navigate("/home");
            }

            setProjectName(responseProject.name);

            const response = await ProjectService.getProjectActivity(token, projectId);
            setActivityRecord(response);
        };

        fetchData();
    }, [projectId, token]);
    

    const isUserInProject = (projectData) => {
        if (projectData.usersInfo) {
            for (let i = 0; i < projectData.usersInfo.length; i++) {
                if (projectData.usersInfo[i].userId === userId) {
                    return true;
                }
            }
        }
        return false;
    };


    return (
        <>
            <Header />
            <div className="project-page-container">
                <div className="project-page-content">
                    <div className="cretor-project-name-container">
                        <h2>{projectName}</h2>
                    </div>
                    <div className="project-page-activity-historic">
                        <label className="c-label"><FormattedMessage id="activityLog"/></label>
                        {activityRecord.length<1 && <p><FormattedMessage id="noActivities"/></p>}
                        {activityRecord.length>0 && 
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th><FormattedMessage id="type"/></th>
                                        <th><FormattedMessage id="author"/></th>
                                        <th><FormattedMessage id="obs"/></th>
                                        <th><FormattedMessage id="dateRegisted"/></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activityRecord.map((activity, index) => (
                                        <tr key={index}>
                                            <td><FormattedMessage id={activity.type}/></td>
                                            <td>{activity.author.name}</td>
                                            <td>{activity.observation}</td>
                                            <td>{new Date(activity.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectActivities;