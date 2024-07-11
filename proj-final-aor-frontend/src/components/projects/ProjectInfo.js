import React, { useEffect, useRef, useState } from "react";
import KeywordComponent from "../keywords/KeywordComponent";
import MemberDisplay from "../MemberDisplay";
import "./ProjectInfo.css";
import { FormattedMessage } from "react-intl";

const ProjectInfo = (props) => {
    const containerRef = useRef(null);
    const {data, onClick} = props;
    const [containerWidth, setContainerWidth] = useState(0);
    const [renderLimits, setRenderLimits] = useState({});

    const stateProgression = {
        PLANNING: 10,
        READY: 25,
        APPROVED: 50,
        IN_PROGRESS: 80,
        FINISHED: 100,
        CANCELLED: 100,
    };


    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
    }, []);

    useEffect(() => {
        const newRenderLimits = {};
        data.forEach((project, projectIndex) => {
            let totalWidthUsed = 0;
            const memberWidth = 160;
            let limit = project.usersInfo.reduce((acc, curr, index) => {
                totalWidthUsed += memberWidth;
                if (totalWidthUsed <= containerWidth) return index + 1;
                else return acc;
            }, 0);
            newRenderLimits[projectIndex] = limit;
        });
        setRenderLimits(newRenderLimits);
    }, [containerWidth, data]);

    const handleClick = (projectId) => {
        if (onClick) {
            onClick(projectId);
        }
    };

    const getProgressBarClass = (stateId) => {
        switch (stateId) {
            case 'PLANNING':
            case 'READY':
            case 'APPROVED':
            case 'IN_PROGRESS':
                return 'progress-bar-green'
            case 'FINISHED':
                return 'progress-bar-full-green'
            case 'CANCELLED':
                return 'progress-bar-red';
            default:
                return '';
        }
    };

    const getStateLabelClass = (stateId) => {
        switch (stateId) {
            case 'PLANNING':
            case 'READY':
            case 'APPROVED':
            case 'IN_PROGRESS':
                return 'proj-state-neutral'
            case 'FINISHED':
                return 'proj-state-green'
            case 'CANCELLED':
                return 'proj-state-red';
            default:
                return '';
        }
    };

    return (
        <div className="project-cards-container">
            {data.map((project, index) => {
                const progressPercentage = stateProgression[project.stateId] || 0;
                const progressBarClass = getProgressBarClass(project.stateId);
                const stateLabelClass = getStateLabelClass(project.stateId);

                return (
                    <div className="info-container" key={index} onClick={() => handleClick(project.id)}>
                        <h2>{project.name}</h2>

                        <div className="progress-bar-container">
                            <div className={`progress-bar ${progressBarClass}`} style={{ width: `${progressPercentage}%` }}></div>
                        </div>

                        <div className="state-vacancies-container">
                            <div className="title-label-container">
                                <h4><FormattedMessage id="lab" />:</h4>
                                <p>&nbsp;{project.lab.name.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                            </div>
                            <div className="title-label-container">
                                <h4><FormattedMessage id="state" />:</h4>
                                <p className={`${stateLabelClass}`}>&nbsp;<FormattedMessage id={project.stateId} /></p>
                            </div>
                            <div className="title-label-container">
                                <h4><FormattedMessage id="vacancies" />:</h4>
                                <p>&nbsp;{project.vacancyNumber}</p>
                            </div>
                        </div>
                        
                        <h4><FormattedMessage id="description" />: </h4>
                        <div className="project-description-container">
                            <p className="description-text roboto-regular">
                                {project.description}
                            </p>
                        </div>
                        <div className="words-container">
                            <h4><FormattedMessage id="keywords" />:</h4>
                            {project.keywords.split(',').slice(0, 4).map((keyword, index) => (
                                <KeywordComponent keyword={keyword} key={index} isProjectInfo={true} />
                            ))}
                        </div>
                        <div className="words-container">
                            <h4><FormattedMessage id="skills" />:</h4>
                            {project.skills.slice(0, 4).map((skill, index) => (
                                <KeywordComponent id={skill.id} keyword={skill.name} key={index} isProjectInfo={true} />
                            ))}
                        </div>
                        <h4><FormattedMessage id="teamMembers" />:</h4>
                        <div className="team-members-container" ref={containerRef}>
                            {project.usersInfo.slice(0, renderLimits[index] || project.usersInfo.length).map((user, userIndex) => (
                                <MemberDisplay
                                    key={userIndex}
                                    id={user.userId}
                                    photo={user.photo}
                                    name={user.firstName + " " + user.lastName}
                                    role={user.userType}
                                />
                            ))}
                            {project.usersInfo.length > (renderLimits[index] || 0) && (
                                <div className="more-members-info">
                                    <FormattedMessage id="moreMembers" values={{ value: project.usersInfo.length - (renderLimits[index] || 0) }} />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProjectInfo;