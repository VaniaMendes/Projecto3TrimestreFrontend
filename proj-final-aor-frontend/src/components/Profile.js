import React, { useEffect, useState } from "react";
import "./Profile.css";
import logo from "./assets/profile_pic_default.png";
import { IntlProvider, useIntl } from "react-intl";
import languages from "../translations";
import { userStore } from "../stores/UserStore";
import { getUserInfo } from "../services/users";
import { getUserSkills } from "../services/skills";
import { GoPlusCircle } from "react-icons/go";
import { FiEdit3 } from "react-icons/fi";
import KeywordComponent from "./KeywordComponent";
import { getUserInterests } from "../services/interests";
import { getUserProjects } from "../services/projects";
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import AddNewSkill from './AddNewSkill';

function Profile() {
  // Get the locale from the userStore
  const locale = userStore((state) => state.locale);
  const token = userStore((state) => state.token);
  console.log(token);

  //Library to format date of projects
  momentDurationFormatSetup(moment);

  const intl = useIntl();

  //State variables
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [projects, setProjects] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
      setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
  };

  useEffect(() => {
    async function fetchUser() {
      const data = await getUserInfo(token);
      setUser(data);

      const skillsData = await getUserSkills(token, data.id);
      setSkills(skillsData);

      const interestsData = await getUserInterests(token, data.id);
      setInterests(interestsData);

      const projectsData = await getUserProjects(token, data.id);
      setProjects(projectsData);
    }
    fetchUser();
  }, [token]);

  console.log(interests);

  return (
    <div className="profile-container">
      <IntlProvider locale={locale} messages={languages[locale]}>
      <div>{isModalOpen && <AddNewSkill onClose={handleCloseModal} />}</div>
        <div className="profile-header">
          <div className="profile-image">
            {user && user.photo ? (
              <img src={user.photo} alt=" Photo" />
            ) : (
              <img src={logo} alt="Logo" />
            )}
          </div>
          <div className="profile-info">
            {user && (
              <div className="user-name">
                {user.firstName} {user.lastName}
              </div>
            )}
            {user && <div className="user-email">{user.email}</div>}
            {user && <div className="user-lab">{user.lab.name}</div>}
          </div>
          <div className="add-keywords">
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
          <div className="add-keywords">
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

          <div className="add-keywords" onClick={handleOpenModal}>
            <GoPlusCircle />
          </div>
          <div className="list-keywords">
            {skills.map((skill, index) => (
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

          <div className="add-keywords" onClick={handleOpenModal}>
            <GoPlusCircle />
          </div>
          <div className="list-keywords">
            {interests.map((interest, index) => (
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
    {projects.map((project, index) => (
        <div key={index}>
            <div className="Project-title"> {project.name}</div>
            
            <div>
    {moment(project.joinedAt).format('D MMMM YYYY')} - 
    {project.leftAt ? moment(project.leftAt).format('D MMMM YYYY') : 'momento'} | 
    {(() => {
        const duration = moment.duration(moment(project.leftAt || moment()).diff(moment(project.joinedAt)));
        if (duration.asYears() >= 1) {
            return duration.format('Y [ano(s)], M [mês(es)]');
        } else if (duration.asMonths() >= 1) {
            return duration.format('M [mês(es)]');
        } else {
            return duration.format('D [dia(s)]');
        }
    })()}
</div>

            <div className="project-lab"> {project.lab.name}</div>
        </div>
    ))}
</div>
          </div>
        )}
       
      </IntlProvider>
    </div>
  );
}

export default Profile;
