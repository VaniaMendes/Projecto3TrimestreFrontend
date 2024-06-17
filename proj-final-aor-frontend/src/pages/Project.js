import React, { useEffect, useState } from "react";
import "./Project.css";
import defaultPhoto from "../components/assets/profile_pic_default.png"
import { FiEdit3 } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Header from "../components/header/Header";
import { FormattedMessage, IntlProvider } from "react-intl";
import { userStore } from "../stores/UserStore";
import languages from "../translations";
import { useNavigate, useParams } from "react-router";
import ProjectService from "../services/ProjectService";
import MemberDisplay from "../components/MemberDisplay";
import KeywordComponent from "../components/keywords/KeywordComponent";

const Project = () => {
    const {locale, token, userId} = userStore();
    const navigate = useNavigate();
    const [projectData, setProjectData] = useState([]);
    const [resources, setResources] = useState([]);
    const [input, setInput] = useState("");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [modalType, setModalType] = useState(""); 
    const { projectId } = useParams();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    useEffect(() => {

        const fetchData = async () => {
            if (!projectId || !token) {
                console.error('Missing projectId or token');
                return;
            }

            try {
                const response = await ProjectService.getProjectInfo(projectId);
                const responseResources = await ProjectService.getProjectResources(token, projectId);
                console.log(response);

                // Assuming keywords are a comma-separated string
                if (response.keywords) {
                    response.keywords = response.keywords.split(',');
                }

                setProjectData(response);
                setResources(responseResources);
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };
        fetchData();
    }, [projectId]);

    const isUserInProject = () => {
        if (projectData.usersInfo) {
            for (let i = 0; i < projectData.usersInfo.length; i++) {
                if (projectData.usersInfo[i].userId === userId) {
                    return true;
                }
            }
        }
        return false;
    };

    const isCollaborator = () => {
        if (projectData.usersInfo) {
            for (let i = 0; i < projectData.usersInfo.length; i++) {
                if (projectData.usersInfo[i].userId === userId) {
                    if (projectData.usersInfo[i].userType === "COLLABORATOR"){
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const handleOpenModalDescription = () => {
        setIsEditModalOpen(true);
        setModalType("description");
    };

    const handleNewDescription = async (description) => {
        try {
            const response = await ProjectService.updateDescription(token, projectId, description);
            console.log(response);

            // Update the projectData state with the new description
            setProjectData(prevProjectData => ({
                ...prevProjectData,
                description: description
            }));

        } catch (error) {
            console.error('Error editing project description:', error);
        }
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
    };

    return (
        <>
            <Header />

            <IntlProvider locale={locale} messages={languages[locale]}>

                <div className="project-page-container">
                    <div className="project-page-content">
                        <div className="project-page-header">
                            <div className="cretor-project-name-container">
                                <div className="creator-info-container">
                                    {projectData.usersInfo && projectData.usersInfo[0].userType === "CREATOR" && (
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
                            {!isUserInProject() && projectData.vacancyNumber>0 && <button className="project-page-candidate-button"><FormattedMessage id="candidate"/></button>}
                        </div>

                        <div className="project-page-info">
                            <div className="ppi-cont">
                                <h4><FormattedMessage id="lab"/> :&nbsp; </h4>
                                {projectData.lab && <p><FormattedMessage id={projectData.lab.name}/></p>}
                            </div>

                            <div className="ppi-cont">
                                <h4><FormattedMessage id="state"/> :&nbsp; </h4>
                                {projectData.stateId && <p><FormattedMessage id={projectData.stateId}/></p>}
                            </div>

                            <div className="ppi-cont">
                                <h4><FormattedMessage id="maxMembers"/> :&nbsp; </h4>
                                <p>{projectData.maxMembers}</p>
                            </div>

                            {isUserInProject() && (
                                <span className="ppi-btn"><FiEdit3 /></span>
                            )}
                        </div>

                        <div className="project-page-description">
                            <label className="c-label"><FormattedMessage id="description"/></label>
                            <p>{projectData.description}</p>
                            {isUserInProject() && (
                                <span className="ppi-btn" onClick={handleOpenModalDescription}><FiEdit3 /></span>
                            )}
                        </div>

                        <div className="project-page-keywords">
                            <label className="c-label"><FormattedMessage id="keywords"/></label>
                            {projectData.keywords && projectData.keywords.map((keyword, index) => (
                                !isCollaborator() ?
                                <KeywordComponent keyword={keyword.trim()} key={index} isProjectInfo={true} isItemRemovable={true}/> :
                                <KeywordComponent keyword={keyword.trim()} key={index} isProjectInfo={true} />
                            ))}
                            {isUserInProject() && (
                                <span className="ppi-btn"><GoPlusCircle /></span>
                            )}
                        </div>

                        <div className="project-page-skills">
                            <label className="c-label"><FormattedMessage id="skills"/></label>
                            {projectData.skills && projectData.skills.map((skill, index) => (
                                !isCollaborator() ? 
                                <KeywordComponent keyword={skill.name} key={index} isProjectInfo={true} isItemRemovable={true}/> :
                                <KeywordComponent keyword={skill.name} key={index} isProjectInfo={true}/>
                            ))}

                            <KeywordComponent keyword="wwwwwwasnfladmad" isProjectInfo={true} isItemRemovable={true}/>
                            <KeywordComponent keyword="wwwwwwasnfladmad" isProjectInfo={true} isItemRemovable={true}/>
                            <KeywordComponent keyword="wwwwwwasnfladmad" isProjectInfo={true} isItemRemovable={true}/>
                            <KeywordComponent keyword="wwwwwwasnfladmad" isProjectInfo={true} isItemRemovable={true}/>
                            <KeywordComponent keyword="wwwwwwasnfladmad" isProjectInfo={true} isItemRemovable={true}/>
                            <KeywordComponent keyword="wwwwwwasnfladmad" isProjectInfo={true} isItemRemovable={true}/>
                            <KeywordComponent keyword="wwwwwwasnfladmad" isProjectInfo={true} isItemRemovable={true}/>
                            <KeywordComponent keyword="wwwwwwasnfladmad" isProjectInfo={true} isItemRemovable={true}/>
                            <KeywordComponent keyword="wwwwwwasnfladmad" isProjectInfo={true} isItemRemovable={true}/>
                            <KeywordComponent keyword="wwwwwwasnfladmad" isProjectInfo={true} isItemRemovable={true}/>
                            
                            {isUserInProject() && (
                                <span className="ppi-btn"><GoPlusCircle /></span>
                            )}
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
                            {isUserInProject() && !isCollaborator() && (
                                <span className="ppi-btn"><GoPlusCircle /></span>
                            )}
                        </div>

                        <div className="project-page-resources">
                            <label className="c-label"><FormattedMessage id="resources"/></label>
                            {resources.length<1 && <p><FormattedMessage id="noResources"/></p>}
                            {resources.length>0 && 
                                <table className="resources-table">
                                    <thead>
                                        <tr>
                                            <th><FormattedMessage id="name"/></th>
                                            <th><FormattedMessage id="brand"/></th>
                                            <th><FormattedMessage id="quantity"/></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resources.map((resource, index) => (
                                            <tr key={index}>
                                                <td>{resource.name}</td>
                                                <td>{resource.brand}</td>
                                                <td>{resource.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            }
                            {isUserInProject() && (
                                <span className="ppi-btn"><GoPlusCircle /></span>
                            )}
                        </div>

                        {isUserInProject() && (
                            <>
                                <div className="project-page-plan">
                                    <label className="c-label"><FormattedMessage id="plan"/></label>
                                </div>
                                <div className="project-page-activity-historic">
                                    <label className="c-label"><FormattedMessage id="activityLog"/></label>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div>
                    {isEditModalOpen && (
                        <EditProject
                            onClose={handleCloseModal}
                            modalType={modalType}
                            input={input}
                            setInput={setInput}
                            onDescriptionSave={handleNewDescription}
                        />
                    )}
                </div>

            </IntlProvider>
        </>
    );
};

function EditProject({ onClose, modalType, input, setInput, onDescriptionSave }) {
  
    const handleEditProject = async (type) => {
        if (type === "description") {
            onDescriptionSave(input);
        }
        onClose();
    };
        
    const handleChangeDescription = (event) => {
        const { value } = event.target;
        setInput(value);
    };
    
    return (
      <div className="modal-skill-container">

          <div className="modal-close" onClick={onClose}>
            <IoIosCloseCircleOutline />
          </div>
          <h1 className="editProfile-title">
               <FormattedMessage id="editDescription"/>
          </h1>
  
          {modalType === "description" && (
            <div className="modal-body-biography">
              <input
                type="text"
                id="description"
                name="description"
                value={input || ""}
                onChange={handleChangeDescription}
              />
            </div>
          )}
         <button className="save-button" onClick={() => handleEditProject(modalType)}>
                <FormattedMessage id="save"/>
        </button>
      </div>
    );
  }

export default Project;