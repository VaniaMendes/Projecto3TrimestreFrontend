import React, { useState, useEffect } from "react";
import { IntlProvider, useIntl } from "react-intl";
import languages from "../translations";
import { userStore } from "../stores/UserStore";
import "./AddNewSkill.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { getAllSkills, createNewSkill, associateSkillToUser } from "../services/skills";
import { getAllInterests, createNewInterest, associateInterestToUser} from "../services/interests";
import SkillComponent from "./SkillComponent";
import { toast } from "react-toastify";


function AddNewSkill({ onClose, modalType }) {
  // Get the locale from the userStore
  const locale = userStore((state) => state.locale);
  const token = userStore((state) => state.token);
  const userId = userStore((state) => state.userId);

  //State variables
  const [list, setList] = useState([]);
  const intl = useIntl();
  const [skill, setSkill] = useState({ name: "", type: "" });
  const [interest, setInterest] = useState({ name: ""});


  //Get the list of skills available with the useEffect
  useEffect(() => {
    async function fetchSkills() {
      // Get the list of skills from the backend
      if (modalType === "skill") {
        const data = await getAllSkills();
        setList(data);
      } else {
        // Get the list of interests from the backend
        const data = await getAllInterests();
        setList(data);
      }
    }
    fetchSkills();
  }, [modalType]);

  const handleSelectChange = (event) => {
    setSkill({ ...skill, type: event.target.value });
  };

  const handleInputChange = (event) => {
    setSkill({ ...skill, name: event.target.value });
  };
  const handleInterestInputChange = (event) => {
    setInterest({ ...interest, name: event.target.value });
  };

  const handleNewSkill = async () => {

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
}else{
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
}
  }

  const handleItemClick = async (id) => {
    console.log('handleItemClick was called with id:', id);
    console.log('handleItemClick was called with userId:', userId);

    try {
        if (modalType === "skill") {
            const response = await associateSkillToUser(token, userId, id);
            if(response === 200){
                toast.success("Skill associated successfully");
            }else{
                toast.error("You already have this skill associated");
            }
        } else {
            const response = await associateInterestToUser(token, userId, id);
            if(response === 200){
                toast.success("Interest associated successfully");
            }else{
                toast.error("You already have this interest associated");
            }
        }
       
    } catch (error) {
        console.log(error);
    }
};


  return (
    <div className="modal-skill-container">
      <IntlProvider locale={locale} messages={languages[locale]}>
        <div className="modal-close" onClick={onClose}>
          <IoIosCloseCircleOutline />
        </div>
        <h1>
          {" "}
          {modalType === "skill"
            ? intl.formatMessage({ id: "addNewSkill" })
            : intl.formatMessage({ id: "addNewInterest" })}
        </h1>

        <div className="modal-boby">
          <div className="list-keywords">
            {list.map((item, index) => (
              <SkillComponent key={index} keyword={item.name} 
              onClick={() => handleItemClick(item.id)} />
            ))}
          </div>
        </div>
        <div className="modal-info">
          <p>
            {modalType === "skill"
              ? intl.formatMessage({ id: "ifNoSkillFound" })
              : intl.formatMessage({ id: "ifNoIntesrestFound" })}
          </p>
        </div>
        <div className="skill-select-container">
          {modalType === "skill" && (
            <select
              className="skill-select"
              onChange={handleSelectChange}
              value={skill.type}
            >
              <option value="">
                {" "}
                {intl.formatMessage({ id: "pleaseSelectOneSkill" })}
              </option>
              <option value="CONHECIMENTO">Conhecimento</option>
              <option value="SOFTWARE">Software</option>
              <option value="HARDWARE">Hardware</option>
              <option value="FERRAMENTAS">Ferramentas</option>
            </select>
          )}

          <input
            className="skill-input"
            type="text"
            placeholder={
              modalType === "skill"
                ? intl.formatMessage({ id: "addNewSkill" })
                : intl.formatMessage({ id: "addNewInterest" })
            }
            onChange={modalType === "skill" ? handleInputChange : handleInterestInputChange}
            value={modalType === "skill" ? skill.name : interest.name}
          />

          <button className="create-button" onClick={handleNewSkill}>
            {intl.formatMessage({ id: "create" })}
          </button>
        </div>
        <button onClick={onClose}>{intl.formatMessage({ id: "back" })}</button>
      </IntlProvider>
    </div>
  );
}

export default AddNewSkill;
