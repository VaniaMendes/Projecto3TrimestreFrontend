import React, { useEffect, useState } from "react";
import "./Profile.css";
import logo from "../assets/profile_pic_default.png";
import { useIntl, FormattedMessage } from "react-intl";
import { userStore } from "../../stores/UserStore";
import { updatevisibility, getUserById } from "../../services/users";
import { getUserSkills } from "../../services/skills";
import { GoPlusCircle } from "react-icons/go";
import { FiEdit3 } from "react-icons/fi";
import KeywordComponent from "../keywords/KeywordComponent";
import { getUserInterests } from "../../services/interests";
import ProjectService from "../../services/ProjectService";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import AddNewSkill from "./AddNewSkill";
import EditProfile from "./modalEditProfile";
import { useParams } from "react-router-dom";
import { softDeleteInterestUser } from "../../services/interests";
import { softDeleteSkillUser } from "../../services/skills";
import { toast } from "react-toastify";
import Visibility from "./Visibility";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

function Profile() {

  const token = userStore((state) => state.token);
  const userLoggedID = userStore((state) => state.userId);
  const { userId } = useParams();
  

  //Library to format date of projects
  momentDurationFormatSetup(moment);

  const intl = useIntl();


  //State variables
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [projects, setProjects] = useState([]);


  //Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openEditModal, setEditModal] = useState(false);
  const [order, setOrder] = useState("newest");
  //Modal type
  const [modalType, setModalType] = useState("");

  const [isOwner, setIsOwner] = useState(false);


  useEffect(() => {
    async function fetchUser() {
      setIsOwner(userId === userLoggedID);
      const effectiveUserId = isOwner ? userLoggedID : userId;

      const data = await getUserById(token, effectiveUserId);
      setUser(data);

      const skillsData = await getUserSkills(token, effectiveUserId);
      setSkills(skillsData);

      const interestsData = await getUserInterests(token, effectiveUserId);
      setInterests(interestsData);

      const projectsData = await ProjectService.getUserProjects(token, effectiveUserId, order);
   console.log(projectsData)
      setProjects(projectsData);


    }
    fetchUser();
  }, [token, userId, isModalOpen, openEditModal, order]);


  const handleRemoveInterestFromUser = async (userId, interestId) => {
    const result = await softDeleteInterestUser(token, userId, interestId);
    if (result === 200) {
      toast.success(intl.formatMessage({ id: "profile1" }));
      setInterests((prevInterests) =>
        prevInterests.filter((interest) => interest.id!== interestId)
      );
      
    } else {
      toast.error(intl.formatMessage({ id: "profile2" }));
      
    }
  };

  const handleRemoveSkillFromUser = async (userId, skillId) => {
    const result = await softDeleteSkillUser(token, userId, skillId);
    if (result === 200) {
      toast.success(intl.formatMessage({ id: "profile3" }));
      setSkills((prevSkills) => prevSkills.filter((skill) => skill.id !== skillId));
    } else {
      toast.error(intl.formatMessage({ id: "profile4" }));
    }
  };
  const handleOpenModalSkill = () => {
    setIsModalOpen(true);
    setModalType("skill");
  };

  const handleOpenModalInterest = () => {
    setIsModalOpen(true);
    setModalType("interest");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditModal(false);
  };

  const handleEditModal = () => {
    setEditModal(true);
    setModalType("biography");
  };
  const handleEditModalProfile = () => {
    setEditModal(true);
    setModalType("profile");
  };


  const onChangeVisibility = async () => {
 
    try {
      const response = await updatevisibility(token, userId);
      if (response === 200) {
        toast.success(intl.formatMessage({ id: "profile5" }));
      } else {
        toast.error("Error updating visibility");
      }
    } catch (error) {
      toast.error("Error updating visibility");
    }
  }


  const getStateDescription = (stateCode) => {
    let messageId;
    switch (stateCode) {
        case "100":
            messageId = "planning";
            break;
        case "200":
            messageId = "ready";
            break;
        case "300":
            messageId = "approved";
            break;
        case "400":
            messageId = "inProgress";
            break;
        case "500":
            messageId = "finished";
            break;
        case "600":
            messageId = "cancelled";
            break;
        default:
            messageId = "";
    }
    return intl.formatMessage({ id: messageId });
}


  return (
   
      <div className="profile-container">
        <div className="profile-external-container">
  
            <div>
              {isModalOpen && (
                <AddNewSkill onClose={handleCloseModal} modalType={modalType} isUser={true}/>
              )}
              {openEditModal && (
                <EditProfile onClose={handleCloseModal} modalType={modalType} user={user} />
              )}
            </div>
           
            <div className="profile-header">
              <div className="profile-image">
                {user && user.photo ? (
                  <img src={user.photo} alt=" Photo" />
                ) : (
                  <img src={logo} alt="Logo" />
                )}
                {user && user.nickname && (
                  <div className="user-nickname">{user.nickname}</div>
                )}
              </div>
              <div className="profile-info">
                {user && (
                  <div className="user-name">
                    {user.firstName} {user.lastName}
                  </div>
                )}
                {user && <div className="user-email">{user.email}</div>}
                {user && (
                  <div className="user-lab">
                    {intl.formatMessage({ id: user.lab.name })}
                  </div>
                )}
{user && user.id === userLoggedID && (
                <div className="user-email">
                  <Visibility visibility={user.visibilityState} onChangeVisibility={onChangeVisibility} profile={true} />
                </div>)}
         
              </div>
              {user && user.id === userLoggedID && (
              <div className="add-keywords" onClick={handleEditModalProfile}>
                <FiEdit3 />
              </div>)}
                          </div>
            {/* Conteúdo da biografia */}
            <div className="profile-biography">
              <div className="input-profile">
                <label className="label-profile" htmlFor="biography">
                  {intl.formatMessage({ id: "biography" })}
                </label>
              </div>
              {user && user.id === userLoggedID && ( 
              <div className="add-keywords" onClick={handleEditModal}>
                <FiEdit3 />
              </div> )}
              {user && <div>{user.biography}</div>}
            </div>
            <div className="profile-keywords">
              {/* Conteúdo das palavras-chave */}
              <div className="input-profile">
                <label className="label-profile" htmlFor="skills">
                  {intl.formatMessage({ id: "skills" })}
                </label>
              </div>
              {user && user.id === userLoggedID && (
              <div className="add-keywords" onClick={handleOpenModalSkill}>
                <GoPlusCircle />
              </div>)}
              <div className="list-keywords">
                {skills && skills.map((skill, index) => (
                  <KeywordComponent key={index} id={skill.id} keyword={skill.name}
                  skillId={skill.id} isItemRemovable={true} isSkill={true} onRemoveSkill={() => handleRemoveSkillFromUser(userId, skill.id)}/>
                ))}
              </div>
            </div>
            <div className="profile-interests">
              {/* Conteúdo dos interesses */}
              <div className="input-profile">
                <label className="label-profile" htmlFor="interests">
                  {intl.formatMessage({ id: "interests" })}
                </label>
              </div>
              {user && user.id === userLoggedID && (
              <div className="add-keywords" onClick={handleOpenModalInterest}>
                <GoPlusCircle />
              </div> )}
                           <div className="list-keywords">
                {interests && interests.map((interest, index) => (
                  <KeywordComponent key={index} id={interest.id} keyword={interest.name} isItemRemovable={true}
                  interestId={interest.id} isInterest={true} onRemoveInterest={() => handleRemoveInterestFromUser(userId, interest.id)} />
                ))}
              </div>
            </div>
            {projects && projects.length > 0 && (
              <div className="profile-projects">
               
                {/* Conteúdo dos projetos */}
                <div className="input-profile">
                  <label className="label-profile" htmlFor="myProjects">
                    {intl.formatMessage({ id: "myProjects" })}
                  </label>
                </div>

                <div className="info-projects-profile">
               
                <div className="list-projects" style={{ textAlign: "left" }}>
                  {projects && projects.map((project, index) => (
                    <div key={index}>
                      <div className="Project-title"> {project.name}</div>

                      <div>
                        {moment(project.joinedAt).format("D MMMM YYYY")} -
                        {project.leftAt
                          ? moment(project.leftAt).format("D MMMM YYYY")
                          : "momento"}{" "}
                        |
                        {(() => {
                          const duration = moment.duration(
                            moment(project.leftAt || moment()).diff(
                              moment(project.joinedAt)
                            )
                          );
                          if (duration.asYears() >= 1) {
                            return duration.format("Y [ano(s)], M [mês(es)]");
                          } else if (duration.asMonths() >= 1) {
                            return duration.format("M [mês(es)]");
                          } else {
                            return duration.format("D [dia(s)]");
                          }
                        })()}
                      </div>

                      <div className="project-lab">
                        {" "}
                        {intl.formatMessage({ id: project.lab.name })}{" "} |   {intl.formatMessage({ id: "status" })}: {intl.formatMessage({ id: getStateDescription(project.stateId)})}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="filter-options-profile" ><FilterOptions setOrder={setOrder}/> </div>
              </div>
             
              </div>
              
            )}
  
        </div>
      </div>
  
  );
}

const FilterOptions = ({setOrder}) => {

  const [openMenu, setOpenMenu] = useState(false);
  const handleToggleMenu = () => {
    setOpenMenu(!openMenu);
  } 

  const handleSortChange = (event) => {
    setOrder(event.target.value);
    setOpenMenu(false); // Fechar o menu após selecionar uma opção
  };

  return (
    <div className = "filter-class-profile">
       <button className='select-item-profile'   onClick={handleToggleMenu}> 
                    <FormattedMessage id="sortBy" />
                    {openMenu ? <MdArrowDropUp /> : <MdArrowDropDown />} 
                </button>
   
   {openMenu && (   
    <div className={`select-container-profile ${openMenu ? 'show' : ''}`}>
    {/* Sort by radio buttons */}
    <div className="radio-wrapper">
        <input className="radio-input" type="radio" id="newest" name="sort" value="newest"  onChange={handleSortChange} />
        <label className="radio-label" htmlFor="newest"><FormattedMessage id="newest" /></label>
    </div>
    <div className="radio-wrapper">
        <input className="radio-input" type="radio" id="oldest" name="sort" value="oldest"   onChange={handleSortChange}/>
        <label className="radio-label" htmlFor="oldest"><FormattedMessage id="oldest" /></label>
    </div>
    <div className="radio-wrapper">
        <input className="radio-input" type="radio" id="vacanciesLow" name="sort" value="state"  onChange={handleSortChange} />
        <label className="radio-label" htmlFor="vacanciesLow"><FormattedMessage id="state" /></label>
    </div>
   
</div>
 )}
</div>
  )
}

export default Profile;



