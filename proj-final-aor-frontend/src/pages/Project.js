import React, { useEffect, useState } from "react";
import "./Project.css";
import defaultPhoto from "../components/assets/profile_pic_default.png"
import { FiEdit3 } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Header from "../components/header/Header";
import { FormattedMessage, useIntl } from "react-intl";
import { userStore } from "../stores/UserStore";
import { useNavigate, useParams } from "react-router";
import ProjectService from "../services/ProjectService";
import MemberDisplay from "../components/MemberDisplay";
import KeywordComponent from "../components/keywords/KeywordComponent";
import AddNewSkill from "../components/profile/AddNewSkill";
import { toast } from "react-toastify";
import { getUserProjectStatus } from "../services/users";
import ProjectChat from '../components/ProjectChat';
import ResourceService from "../services/ResourceService";



const Project = () => {
    const {token, userId, typeUser} = userStore();
    const navigate = useNavigate();
    const [projectData, setProjectData] = useState([]);
    const [resources, setResources] = useState([]);
    const [activityRecord, setActivityRecord] = useState([]);
    const [input, setInput] = useState("");
    const [currentState, setCurrentState] = useState(null);
    const [newKeyword, setNewKeyword] = useState("");
    const [hasApplied, setHasApplied] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditStateOpen, setIsEditStateOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
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

                if (response.keywords) {
                    response.keywords = response.keywords.split(',');
                }

                setProjectData(response);
                setResources(responseResources);

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

        const fetchActivities = async () => {
            if (!projectId || !token) {
                console.error('Missing projectId or token');
                return;
            }

            try {
                const responseActivity = await ProjectService.getProjectActivity(token, projectId);
                setActivityRecord(responseActivity);

            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };
        fetchActivities();
    }, [projectId, token, projectData]);

    
    useEffect(() => {

        const fetchUserProjectStatus = async () => {
            try {
                const response = await getUserProjectStatus(token, userId, projectId);

                if (response) {
                    setHasApplied(true);
                }
            } catch (error) {
                console.error('Error fetching user project status:', error);
            }
        }

        fetchUserProjectStatus();
    }, [hasApplied, token, projectId]);

    const refetchResourceData = async () => {
        try {
            const responseResources = await ProjectService.getProjectResources(token, projectId);
            setResources(responseResources);
        } catch (error) {
            console.error('Error refetching data:', error);
        }
    };

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

    const handleOpenModalMember = () => {
        setIsMemberModalOpen(true);
    };

    const handleOpenModalKeyword = () => {
        setIsAddModalOpen(true);
        setModalType("keyword");
    };

    const handleOpenModalResource = () => {
        setIsResourceModalOpen(true);
    }
  
    const handlePlanExecution = () => {
        navigate(`/project/${projectId}/execution-plan`);
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
        const keywords = keyword.name.split(',');

        for (let i = 0; i < keywords.length; i++) {
            const response = await ProjectService.addKeyword(token, projectId, keywords[i].trim());

            if (response) {
                const formattedKeyword = toTitleCase(keywords[i].trim());
                toast.success(`Keyword ${formattedKeyword} added successfully!`);
                setProjectData(prevProjectData => ({
                    ...prevProjectData,
                    keywords: [...prevProjectData.keywords, formattedKeyword]
                }));
            }
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
        if (modalType === "keyword") {
            await handleAddKeyword(item);
        } else if (modalType === "skill") {
            await handleAddSkill(item);
        } else {
            console.error("Invalid modalType");
        }
    }

    const handleApplyToProject = async () => {
        const response = await ProjectService.addMember(token, projectId, userId, "CANDIDATE");

        if (response) {
            setHasApplied(true);
            toast.success('Application sent successfully!');
        }
    }

    const handleApproveCandidate = async (candidateId, userType, photo, name) => {
        console.log('Approving candidate:', candidateId, userType);
        const response = await ProjectService.approveCandidate(token, projectId, candidateId, userType);

        if (response) {
            toast.success('Candidate approved successfully!');

            const nameParts = name.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.length > 1 ? nameParts[1] : '';

            const mockUser = {
                firstName: firstName,
                lastName: lastName,
                photo: photo,
                userId: userId,
                userType: userType
            };
            
            setProjectData(prevProjectData => ({
                ...prevProjectData,
                usersInfo: [...prevProjectData.usersInfo, mockUser]
            }));
        }
    };

    const handleAddMember = async (userId, userType, photo, name) => {
        console.log('Adding member:', userId, userType);
        const response = await ProjectService.addMember(token, projectId, userId, userType);

        if (response) {
            toast.success('Member added successfully!');

            const nameParts = name.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.length > 1 ? nameParts[1] : '';

            const mockUser = {
                firstName: firstName,
                lastName: lastName,
                photo: photo,
                userId: userId,
                userType: userType
            };

            setProjectData(prevProjectData => ({
                ...prevProjectData,
                usersInfo: [...prevProjectData.usersInfo, mockUser]
            }));
        }
    };

    const handleChangeMemberRole = async (userId, userType) => {
        const response = await ProjectService.updateMemberRole(token, projectId, userId, userType);

        if (response) {
            toast.success('Member role changed successfully!');

            setProjectData(prevProjectData => ({
                ...prevProjectData,
                usersInfo: prevProjectData.usersInfo.map(user => {
                    if (user.userId === userId) {
                        user.userType = userType;
                    }
                    return user;
                })
            }));
        }
    };

    const handleRemoveMember = async (userId) => {
        console.log('Removing member:', userId);
        const response = await ProjectService.removeMember(token, projectId, userId);

        if (response) {
            toast.success('Member removed successfully!');

            setProjectData(prevProjectData => ({
                ...prevProjectData,
                usersInfo: prevProjectData.usersInfo.filter(user => user.userId !== userId)
            }));
        }
    };

    const handleCloseModal = () => {
        if(isEditModalOpen){
            setIsEditModalOpen(false);
        } else if(isAddModalOpen){
            setIsAddModalOpen(false);
        } else if(isMemberModalOpen){
            setIsMemberModalOpen(false);
        } else if(isResourceModalOpen){
            setIsResourceModalOpen(false);
        }

    };

    return (
        <>
            <Header />

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
                            {!hasApplied && !isUserInProject() && projectData.vacancyNumber>0 && <button className="project-page-candidate-button" onClick={handleApplyToProject}><FormattedMessage id="candidate"/></button>}
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

                            {(isUserInProject() || typeUser=='ADMIN') && (
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
                                    id={user.userId}
                                    photo={user.photo}
                                    name={user.firstName + " " + user.lastName}
                                    role={user.userType}
                                    isInsideProject={true}
                                    onMemberRoleChange={handleChangeMemberRole}
                                    handleRemoveMember={handleRemoveMember}
                                />
                            ))}
                            {isUserInProject() && !isCollaborator() && (
                                <span className="ppi-btn" onClick={handleOpenModalMember}><GoPlusCircle /></span>
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
                                <span className="ppi-btn" onClick={handleOpenModalResource}><GoPlusCircle /></span>
                            )}
                        </div>

                        {isUserInProject() && (
                            <>
                                <div className="project-page-plan">
                                    <label className="c-label"><FormattedMessage id="plan"/></label>
                                    <button onClick={handlePlanExecution} ><FormattedMessage id="executionPlan"/></button>
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

                    {isMemberModalOpen && (
                        <AddTeamMembers
                            onClose={handleCloseModal}
                            projectId={projectId}
                            token={token}
                            handleAddMember={handleAddMember}
                            handleApproveCandidate={handleApproveCandidate}
                        />
                    )}

                    {isResourceModalOpen && (
                        <AddResources
                            onClose={handleCloseModal}
                            token={token}
                            projectId={projectId}
                            onResourceAdded={refetchResourceData}
                        />
                    )}
                    
                </div>

                {isUserInProject() && <ProjectChat projectId={projectId}/>}
        
          
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
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
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
        </>
    );
}

function AddTeamMembers({ onClose, projectId, token, handleApproveCandidate, handleAddMember }) {

    const [candidates, setCandidates] = useState([]);
    const [available, setAvailable] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseAvailable = await ProjectService.getUsersAvailable(token, projectId);
                const responseCandidates = await ProjectService.getCandidates(token, projectId);

                if (responseAvailable) {
                    setAvailable(responseAvailable);
                }
                if (responseCandidates) {
                    setCandidates(responseCandidates);
                }
                
                console.log('Users available:', responseAvailable);
                console.log('Candidates:', responseCandidates);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchData();
    }, [token, projectId, handleApproveCandidate, handleAddMember]);

    
    
    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="modal-skill-container">

                <div className="modal-close" onClick={onClose}>
                    <IoIosCloseCircleOutline />
                </div>
                
                <div className="modal-members-container">
                    <div className="add-members-users-container with-border-right">
                        <h3 style={{ position: 'sticky',top: 0 , backgroundColor: '#fdfdfd'}}>
                            <FormattedMessage id="usersAvailable"/>
                        </h3>
                        {available.map((user, index) => (
                            <MemberDisplay
                                key={index}
                                id={user.userId}
                                photo={user.photo}
                                name={user.firstName + " " + user.lastName}
                                handleAddMember={handleAddMember}
                            />
                        ))}
                    </div>
                    <div className="add-members-users-container">
                        <h3>
                            <FormattedMessage id="usersPending"/>
                        </h3>
                        {candidates.map((candidate, index) => (
                            <MemberDisplay
                                key={index}
                                id={candidate.userId}
                                photo={candidate.photo}
                                name={candidate.firstName + " " + candidate.lastName}
                                isCandidate={true}
                                handleApproveCandidate={handleApproveCandidate}
                            />
                        ))}

                    </div>
                </div>
            </div>
        </>
    );
}

function AddResources({ onClose, token, projectId, onResourceAdded }) {

    const intl = useIntl();
    const [resources, setResources] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            let response=[];
            try {
                if (searchInput === ''){
                    response = await ResourceService.getAllResources("desc", null, null);
                }else{
                    response = await ResourceService.searchResources(searchInput);
                }

                console.log('Resources:', response);
                if (response) {
                    setResources(response);
                }
            } catch (error) {
                console.error('Error fetching resources:', error);
            }
        };

        fetchData();

    }, [searchInput]);

    const handleQuantityChange = (resourceId, value) => {
        setQuantities({
            ...quantities,
            [resourceId]: value,
        });
    };

    const handleAddResource = async (resource) => {
        const quantity = quantities[resource.id];
        
        const response = await ProjectService.addResource(token, projectId, resource.id, quantity);

        if (response) {
            setQuantities([]);
            toast.success(intl.formatMessage({ id: 'resourceAdded' }));
            onResourceAdded();
        }
    };

    return (
        <>
            <div className="modal-backdrop"></div>
            <div className="modal-resources-container">
                <div className="modal-close" onClick={onClose}>
                    <IoIosCloseCircleOutline />
                </div>
                <div className="modal-header">
                    <h2>
                        <FormattedMessage id="addResource"/>
                    </h2>
                    <input 
                        className="search-resource-input"
                        type="search"
                        onChange={(e) => setSearchInput(e.target.value)}
                        value={searchInput}
                        placeholder={intl.formatMessage({ id: "searchResource" })} 
                    />
                </div>
                
                <div className="resource-table-container">
                    <table className="resource-table">
                        <thead className="sticky-header">
                            <tr>
                                <th><FormattedMessage id="name"/></th>
                                <th><FormattedMessage id="brand"/></th>
                                <th><FormattedMessage id="type"/></th>
                                <th className="minor-th"><FormattedMessage id="quantity"/></th>
                                <th className="minor-th"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map((resource) => (
                                <tr key={resource.id}>
                                    <td>{resource.name}</td>
                                    <td>{resource.brand}</td>
                                    <td><FormattedMessage id={resource.type}/></td>
                                    <td className="minor-td">
                                        <input
                                            type="number"
                                            min="0"
                                            value={quantities[resource.id] || ''}
                                            onChange={(e) => handleQuantityChange(resource.id, e.target.value)}
                                        />
                                    </td>
                                    <td className="minor-td">
                                        <span className="add-resource-btn" onClick={() => handleAddResource(resource)}>
                                            <GoPlusCircle/>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Project;