import React, { useState, useEffect } from "react";
import { IntlProvider, useIntl } from "react-intl";
import languages from "../../translations";
import { userStore } from "../../stores/UserStore";
import "./AddNewSkill.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { getAllSkills, createNewSkill, associateSkillToUser } from "../../services/skills";
import { getAllInterests, createNewInterest, associateInterestToUser} from "../../services/interests";
import SkillComponent from "./SkillComponent";
import { toast } from "react-toastify";
import SkillInterestService from "../../services/SkillInterestService";
import ProjectService from "../../services/ProjectService";


function AddNewSkill(props) {
  // Get the locale from the userStore
  const { onClose, modalType, isUser, handleAdd, projectId, setNewKeyword } = props;
  const {locale, token, userId} = userStore();

  //State variables
  const [list, setList] = useState([]);
  const intl = useIntl();
  const [skill, setSkill] = useState({ name: "", type: "" });

  const [interest, setInterest] = useState({ name: ""});


  //Get the list of skills available with the useEffect
  useEffect(() => {
    async function fetchSkills() {
      try {
        let data = [];
        if (modalType === "skill") {
          if (!isUser) {
            data = await SkillInterestService.getSkillsNotInProject(token, projectId);
          } else {
            data = await getAllSkills();
          }
        } else if (modalType === "interest"){
          data = await getAllInterests();
        } else if (modalType === "keyword") {
          data = await getAllInterests();
        }
        setList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchSkills();
  }, [modalType]);
  

  const handleInputChange = (event) => {
    setSkill({ ...skill, name: event.target.value });
  };

  const handleInterestInputChange = (event) => {
    setInterest({ ...interest, name: event.target.value });
  };

  const handleNewItem = async () => {

    if(modalType === "skill") {
        if (!skill.name || !skill.type) {
          toast.error("Please fill out both the skill name and type.");
          return;
        }
        try {
          const response = await createNewSkill(token, skill);
          if (response === 200) {
            toast.success("Skill created successfully");
            // Update the skills list locally
            setList([...list, skill]);
            // Reset the skill input fields
            setSkill({ name: "", type: "" });
            
          } else {
            toast.error("Failed to create skill");
          }
        } catch (error) {
          toast.error("An error occurred");
        }
    }else if (modalType === "interest"){
        if(!interest.name){
            toast.error("Please fill out the interest name.");
            return;
        }
        try{
            const response = await createNewInterest(token, interest);
            if(response === 200){
                toast.success("Interest created successfully");
                // Update the interests list locally
                setList([...list, interest]);
                // Reset the interest input fields
                setInterest({ name: "" });
            }else{
                toast.error("Failed to create interest");
            }
        }
        catch(error){
            toast.error("An error occurred");
        }
    }else if (modalType === "keyword") {
      if(!interest.name){
          toast.error("Please fill out the interest name.");
          return;
      }
      try{
          const response = await ProjectService.addKeyword(token, projectId, interest.name);
          if(response){
              toast.success("Keyword added successfully!");
              setInterest({ name: "" });
              setNewKeyword(interest.name);
              onClose();
          }else{
              toast.error("Failed to add keyword");
          }
      }
      catch(error){
          toast.error("An error occurred");
      }
    }
  }

  const handleItemClick = async (item) => {

    if(isUser){
      try {
          if (modalType === "skill") {
              const response = await associateSkillToUser(token, userId, item.id);
              if(response === 200){
                  toast.success("Skill associated successfully");
              }else{
                  toast.error("You already have this skill associated");
              }
          } else {
              const response = await associateInterestToUser(token, userId, item.id);
              if(response === 200){
                  toast.success("Interest associated successfully");
              }else{
                  toast.error("You already have this interest associated");
              }
          }
        
      } catch (error) {
          console.log(error);
      }
    }else{
      handleAdd(modalType, item);
      onClose();
    }
    
};


  return (
    <div>
      <div className="modal-backdrop" onClick={onClose}></div>
    <div className="modal-skill-container">
      
      <IntlProvider locale={locale} messages={languages[locale]}>
        <div className="modal-close" onClick={onClose}>
          <IoIosCloseCircleOutline />
        </div>
        <p className="title-modal">
          {" "}
          {modalType === "skill"
            ? intl.formatMessage({ id: "addNewSkill" })
            : modalType === "interest"
            ? intl.formatMessage({ id: "addNewInterest" })
            : intl.formatMessage({ id: "addNewKeyword" })}
        </p>

        <div className="modal-boby">
          <div className="list-keywords">
            {list && list.map((item, index) => (
              <SkillComponent key={index} keyword={item.name} onClick={() => handleItemClick(item)} />
            ))}
          </div>
        </div>
        <div className="modal-info">
          <p>
            {modalType === "skill"
              ? intl.formatMessage({ id: "ifNoSkillFound" })
              : modalType === "interest"
              ? intl.formatMessage({ id: "ifNoIntesrestFound" })
              : intl.formatMessage({ id: "ifNoKeywordFound" })}
          </p>
        </div>
        <div className="skill-select-container">
          {modalType === "skill" && (
            <select
              className="skill-select"
              onChange={(event) => setSkill({ ...skill, type: event.target.value })}

              value={skill.type}
            >
              <option value="">
                {" "}
                {intl.formatMessage({ id: "pleaseSelectOneSkill" })}
              </option>
              <option value="CONHECIMENTO"> {intl.formatMessage({ id: "conhecimento" })}</option>
              <option value="SOFTWARE">{intl.formatMessage({ id: "software" })}</option>
              <option value="HARDWARE">{intl.formatMessage({ id: "hardware" })}</option>
              <option value="FERRAMENTAS"> {intl.formatMessage({ id: "ferramentas" })}</option>
            </select>
          )}

          <input
            className="skill-input"
            type="text"
            placeholder={
              modalType === "skill"
                ? intl.formatMessage({ id: "addNewSkill" })
                : modalType === "interest"
                ? intl.formatMessage({ id: "addNewInterest" })
                : intl.formatMessage({ id: "addNewKeyword" })
            }
            onChange={modalType === "skill" ? handleInputChange : handleInterestInputChange}
            value={modalType === "skill" ? skill.name : interest.name}
          />

          <button className="create-button" onClick={handleNewItem}>
            {modalType === "keyword" ? intl.formatMessage({ id: "add" }) : intl.formatMessage({ id: "create" })}
          </button>
          <button className="back" onClick={onClose}>{intl.formatMessage({ id: "back" }) }</button>
        </div>
        
      </IntlProvider>
    </div>
    </div>
  );
}

export default AddNewSkill;