import React from "react";
import KeywordComponent from "../keywords/KeywordComponent";
import MemberDisplay from "../MemberDisplay";
import "./ProjectInfo.css";
import { FormattedMessage } from "react-intl";

const ProjectInfo = (props) => {
    const {data, onClick} = props;

    const handleClick = (projectId) => {
        if (onClick) {
            onClick(projectId);
        }
    };

    return (
        <div className="project-cards-container">
            {data.map((project, index) => (
                <div className="info-container" key={index} onClick={() => handleClick(project.id)}>
                    
                        <h2>{project.name}</h2>
                        <div className="title-label-container">
                            <h4><FormattedMessage id="lab"/></h4>
                            <p>: {project.lab.name.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                        </div>

                        <div className="state-vacancies-container">
                            <div className="title-label-container">
                                <h4><FormattedMessage id="state"/></h4>
                                <p>: <FormattedMessage id={project.stateId}/></p>
                            </div>
                            <div className="title-label-container">
                                <h4><FormattedMessage id="vacancies"/></h4>
                                <p>: {project.vacancyNumber}</p>
                            </div>
                        </div>
                        <h4><FormattedMessage id="description"/>: </h4>
                        <div className="project-description-container">
                            <p class="description-text roboto-regular">
                                {project.description}
                            </p>
                        </div>
                        <div className="words-container">
                            <h4><FormattedMessage id="keywords"/>:</h4>
                            {project.keywords.split(',').slice(0, 4).map((keyword, index) => (
                                <KeywordComponent keyword={keyword} key={index} isProjectInfo={true}/>
                            ))}                    
                        </div>
                        <div className="words-container">
                            <h4><FormattedMessage id="skills"/>:</h4>
                            {project.skills.slice(0, 4).map((skill, index) => (
                                <KeywordComponent id={skill.id} keyword={skill.name} key={index} isProjectInfo={true}/>
                            ))}
                        </div>
                        <h4><FormattedMessage id="teamMembers"/>:</h4>
                        <div className="team-members-container">
                            {project.usersInfo.map((user, userIndex) => (
                                <MemberDisplay
                                    key={userIndex}
                                    id={user.userId}
                                    photo={user.photo}
                                    name={user.firstName + " " + user.lastName}
                                    role={user.userType}
                                />
                            ))}                        
                        </div>
                    
                </div>
            ))}
        </div>
    );
}

export default ProjectInfo;