import React, { useEffect, useState } from "react";
import "./Profile.css";
import logo from "../assets/profile_pic_default.png";
import { IntlProvider, useIntl } from "react-intl";
import languages from "../../translations";
import { userStore } from "../../stores/UserStore";
import { getUserInfo } from "../../services/users";
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

function Profile() {
  // Get the locale from the userStore
  const locale = userStore((state) => state.locale);
  const token = userStore((state) => state.token);
  const updateUserId = userStore((state) => state.updateUserId);

  //Library to format date of projects
  momentDurationFormatSetup(moment);

  const intl = useIntl();
  const { userId } = useParams();

  //State variables
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [projects, setProjects] = useState([]);

  //Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openEditModal, setEditModal] = useState(false);
  //Modal type
  const [modalType, setModalType] = useState("");

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
  
  useEffect(() => {
    async function fetchUser() {
      const data = await getUserInfo(token);
      console.log(data);
      setUser(data);

      const skillsData = await getUserSkills(token, userId);
      setSkills(skillsData);

      const interestsData = await getUserInterests(token, userId);
      setInterests(interestsData);

      const projectsData = await ProjectService.getUserProjects(token, userId);
      setProjects(projectsData);

      // Update the userId in the userStore
      if (data) {
        updateUserId(data.id);
      }
    }
    fetchUser();
  }, [token, modalType, isModalOpen, openEditModal]);


console.log(user);
  return (
   
      <div className="notification-container">
        <div className="notification-external-container">
          <IntlProvider locale={locale} messages={languages[locale]}>
            <div>
              {isModalOpen && (
                <AddNewSkill onClose={handleCloseModal} modalType={modalType} />
              )}
              {openEditModal && (
                <EditProfile onClose={handleCloseModal} modalType={modalType} />
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
              </div>
              <div className="add-keywords" onClick={handleEditModalProfile}>
                <FiEdit3 />
              </div>
            </div>
            {/* Conteúdo da biografia */}
            <div className="profile-biography">
              <div className="input-profile">
                <label className="label-profile" htmlFor="biography">
                  {intl.formatMessage({ id: "biography" })}
                </label>
              </div>
              <div className="add-keywords" onClick={handleEditModal}>
                <FiEdit3 />
              </div>
              {user && <div>{user.biography}</div>}
            </div>
            <div className="profile-keywords">
              {/* Conteúdo das palavras-chave */}
              <div className="input-profile">
                <label className="label-profile" htmlFor="skills">
                  {intl.formatMessage({ id: "skills" })}
                </label>
              </div>

              <div className="add-keywords" onClick={handleOpenModalSkill}>
                <GoPlusCircle />
              </div>
              <div className="list-keywords">
                {skills && skills.map((skill, index) => (
                  <KeywordComponent key={index} keyword={skill.name} />
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

              <div className="add-keywords" onClick={handleOpenModalInterest}>
                <GoPlusCircle />
              </div>
              <div className="list-keywords">
                {interests && interests.map((interest, index) => (
                  <KeywordComponent key={index} keyword={interest.name} />
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
                        {intl.formatMessage({ id: project.lab.name })}{" "}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </IntlProvider>
        </div>
      </div>
  
  );
}

export default Profile;
