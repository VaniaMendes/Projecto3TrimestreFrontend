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
import AddNewSkill from "../components/profile/AddNewSkill";
import { toast } from "react-toastify";

const Project = () => {
    const {locale, token, userId} = userStore();
    const navigate = useNavigate();
    const [projectData, setProjectData] = useState([]);
    const [resources, setResources] = useState([]);
    const [activityRecord, setActivityRecord] = useState([]);
    const [input, setInput] = useState("");
    const [currentState, setCurrentState] = useState(null);
    const [newKeyword, setNewKeyword] = useState("");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditStateOpen, setIsEditStateOpen] = useState(false);
    const [modalType, setModalType] = useState(""); 
    const { projectId } = useParams();

    const states = [
        { id: 100, name: 'PLANNING' },
        { id: 200, name: 'READY' },
        { id: 300, name: 'APPROVED' },
        { id: 400, name: 'IN_PROGRESS' },
        { id: 500, name: 'FINISHED' },
        { id: 600, name: 'CANCELLED' },
    ];
    
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
                const responseActivity = await ProjectService.getProjectActivity(token, projectId);

                // Assuming keywords are a comma-separated string
                if (response.keywords) {
                    response.keywords = response.keywords.split(',');
                }

                setProjectData(response);
                setResources(responseResources);
                setActivityRecord(responseActivity);

                const state = states.find(state => state.name === response.stateId);
                if (state) {
                    setCurrentState(state.id);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };
        fetchData();
    }, [projectId, token]);

    useEffect(() => {
        if (newKeyword) {
            const formattedKeyword = toTitleCase(newKeyword);
            setProjectData(prevProjectData => ({
                ...prevProjectData,
                keywords: [...prevProjectData.keywords, formattedKeyword]
            }));
        }
    }, [newKeyword]);

    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

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

    const handleOpenModalSkill = () => {
        setIsAddModalOpen(true);
        setModalType("skill");
    };

    const handleOpenModalKeyword = () => {
        setIsAddModalOpen(true);
        setModalType("keyword");
    };

    const handleNewDescription = async (description) => {
        try {
            const response = await ProjectService.updateDescription(token, projectId, description);

            if (response) {
                toast.success('Description updated successfully!');
                // Update the projectData state with the new description
                setProjectData(prevProjectData => ({
                    ...prevProjectData,
                    description: description
                }));
            }

        } catch (error) {
            console.error('Error editing project description:', error);
        }
    }

    const handleClickEditState = () => {
        setIsEditStateOpen(!isEditStateOpen);
    }

    const handleStateChange = async (event) => {
        const selectedStateId = event.target.value;
        const selectedStateName = states.find(state => state.id === parseInt(selectedStateId)).name;
        const userConfirmed = window.confirm('Are you sure you want to save this selection?');

        if (userConfirmed) {
            const response = await ProjectService.updateState(token, projectId, selectedStateId);
            if  (response) {
                setProjectData(prevProjectData => ({
                    ...prevProjectData,
                    stateId: selectedStateName
                }));
                setCurrentState(selectedStateId);
                setIsEditStateOpen(false);
            }
        }
    };

    const handleAddKeyword = async (keyword) => {
        console.log('Adding keyword:', keyword);
        const response = await ProjectService.addKeyword(token, projectId, keyword.name);

        if (response) {
            toast.success('Keyword added successfully!');
            setProjectData(prevProjectData => ({
                ...prevProjectData,
                keywords: [...prevProjectData.keywords, keyword.name]
            }));
        }
    }

    const handleRemoveKeyword = async (keyword) => {
        const response = await ProjectService.removeKeyword(token, projectId, keyword);

        if (response) {
            toast.success('Keyword removed successfully!');
            setProjectData(prevProjectData => ({
                ...prevProjectData,
                keywords: prevProjectData.keywords.filter(k => k !== keyword)
            }));
        }
    }

    const handleAddSkill = async (skill) => {
        await ProjectService.joinSkill(token, projectId, skill.id);

        const responseAdd = await ProjectService.addSkill(token, projectId, skill.id);

        if (responseAdd) {
            toast.success('Skill added successfully!');
            setProjectData(prevProjectData => ({
                ...prevProjectData,
                skills: [...prevProjectData.skills, skill]
            }));
        }
    };

    const handleRemoveSkill = async (name, id) => {
        const response = await ProjectService.removeSkill(token, projectId, id);

        if (response) {
            toast.success('Skill removed successfully!');
            setProjectData(prevProjectData => ({
                ...prevProjectData,
                skills: prevProjectData.skills.filter(s => s.name !== name)
            }));
        }
    };

    const handleAdd = async (modalType, item) => {
        console.log('handleAdd was called with modalType:', modalType);
        if (modalType === "keyword") {
            await handleAddKeyword(item);
        } else if (modalType === "skill") {
            await handleAddSkill(item);
        } else {
            console.error("Invalid modalType");
        }
    }

    const handleCloseModal = () => {
        if(isEditModalOpen){
            setIsEditModalOpen(false);
        } else if(isAddModalOpen){
            setIsAddModalOpen(false);
        }
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
                                {isEditStateOpen ? (
                                    <select value={currentState} onChange={handleStateChange}>
                                        {states.map((state) => (
                                            <option key={state.id} value={state.id}>
                                                <FormattedMessage id={state.name}/>
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    projectData.stateId && <p><FormattedMessage id={projectData.stateId}/></p>
                                )}
                            </div>

                            <div className="ppi-cont">
                                <h4><FormattedMessage id="maxMembers"/> :&nbsp; </h4>
                                <p>{projectData.maxMembers}</p>
                            </div>

                            {isUserInProject() && (
                                <>
                                {isEditStateOpen ? (
                                    <span className="ppi-btn" onClick={handleClickEditState}><IoIosCloseCircleOutline /></span>
                                ) : (
                                    <span className="ppi-btn" onClick={handleClickEditState}><FiEdit3 /></span>
                                )}
                                </>
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
                                !isCollaborator() && isUserInProject() ?
                                <KeywordComponent keyword={keyword.trim()} key={index} isProjectInfo={true} isItemRemovable={true} onRemoveClick={handleRemoveKeyword}/> :
                                <KeywordComponent keyword={keyword.trim()} key={index} isProjectInfo={true} />
                            ))}
                            {isUserInProject() && (
                                <span className="ppi-btn" onClick={handleOpenModalKeyword}><GoPlusCircle /></span>
                            )}
                        </div>

                        <div className="project-page-skills">
                            <label className="c-label"><FormattedMessage id="skills"/></label>
                            {projectData.skills && projectData.skills.map((skill, index) => (
                                !isCollaborator() && isUserInProject() ? 
                                <KeywordComponent id={skill.id} keyword={skill.name} key={index} isProjectInfo={true} isItemRemovable={true} onRemoveClick={handleRemoveSkill}/> :
                                <KeywordComponent id={skill.id} keyword={skill.name} key={index} isProjectInfo={true}/>
                            ))}
                            {isUserInProject() && (
                                <span className="ppi-btn" onClick={handleOpenModalSkill}><GoPlusCircle /></span>
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
                                <table className="table">
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
                                    {activityRecord.length<1 && <p><FormattedMessage id="noActivities"/></p>}
                                    {activityRecord.length>0 && 
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th><FormattedMessage id="type"/></th>
                                                    <th><FormattedMessage id="author"/></th>
                                                    <th><FormattedMessage id="dateRegisted"/></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activityRecord.map((activity, index) => (
                                                    <tr key={index}>
                                                        <td><FormattedMessage id={activity.type}/></td>
                                                        <td>{activity.author.name}</td>
                                                        <td>{new Date(activity.createdAt).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    }
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
                    {isAddModalOpen && (
                        <AddNewSkill 
                            onClose={handleCloseModal} 
                            modalType={modalType}
                            isUser={false}
                            handleAdd={handleAdd}
                            projectId={projectId}
                            setNewKeyword={setNewKeyword}
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