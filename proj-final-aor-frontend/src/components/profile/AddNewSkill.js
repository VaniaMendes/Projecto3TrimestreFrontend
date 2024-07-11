import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { userStore } from "../../stores/UserStore";
import "./AddNewSkill.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {
  getAllSkills,
  createNewSkill,
  associateSkillToUser,
} from "../../services/skills";
import {
  getAllInterests,
  createNewInterest,
  associateInterestToUser,
} from "../../services/interests";
import SkillComponent from "./SkillComponent";
import { toast } from "react-toastify";
import SkillInterestService from "../../services/SkillInterestService";

function AddNewSkill(props) {
  // Destructuring props
  const { onClose, modalType, isUser, handleAdd, projectId, setNewKeyword } =
    props;

  //Using userStore to get token and userId
  const { token, userId } = userStore();

  //State variables
  const [list, setList] = useState([]);
  const [skill, setSkill] = useState({ name: "", type: "" });
  const [interest, setInterest] = useState({ name: "" });
  const intl = useIntl(); // Internationalization hook

  // Fetching skills/interests based on modalType
  useEffect(() => {
    async function fetchSkills() {
      try {
        let data = [];
        if (modalType === "skill") {
          if (!isUser) {
            // Fetch skills not in project if modalType is skill and user is not specified
            data = await SkillInterestService.getSkillsNotInProject(
              token,
              projectId
            );
          } else {
            // Fetch all skills if modalType is skill and user is specified
            data = await getAllSkills();
          }
        } else if (modalType === "interest") {
          // Fetch all interests if modalType is interest
          data = await getAllInterests();
        } else if (modalType === "keyword") {
          // Fetch all interests if modalType is keyword
          data = await getAllInterests();
        }
        setList(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchSkills();
  }, [modalType, isUser, token, projectId]); //Dependencies for the useEffect

  // Handle change in skill input fields
  const handleSkillInputChange = (event) => {
    const { name, value } = event.target;
    setSkill((prevSkill) => ({
      ...prevSkill,
      [name]: value,
    }));
  };

  // Handle change in interest input fields
  const handleInterestInputChange = (event) => {
    setInterest({ ...interest, name: event.target.value });
  };

  // Handle creation of new skill/interest/keyword
  const handleNewItem = async () => {
    if (modalType === "skill") {
      // If modalType is skill
      if (!skill.name || !skill.type) {
        toast.error(intl.formatMessage({ id: "fillAllFields" }));
        return;
      }
      try {
        //Create new skill
        const createdSkill = await createNewSkill(token, skill);
        toast.success(intl.formatMessage({ id: "skillCreatedSuccess" }));

        setList([...list, createdSkill]); // Update skills list with new skill
        setSkill({ name: "", type: "" }); //Clear input fields
      } catch (error) {
        toast.error(error.message || intl.formatMessage({ id: "errorOccurred" }));
      }
    } else if (modalType === "interest") {
      //If modalType is interest
      if (!interest.name) {
        toast.error(intl.formatMessage({ id: "fillAllFields" }));
        return;
      }
      try {
        //Create new interest
        const response = await createNewInterest(token, interest);
        if (response === 200) {
          toast.success(intl.formatMessage({ id: "interestCreatedSuccess" }));
          // Update the interests list locally
          setList([...list, interest]);
          // Reset the interest input fields
          setInterest({ name: "" });
        } else {
          toast.error(intl.formatMessage({ id: "errorOccurred" }));
        }
      } catch (error) {
        toast.error(intl.formatMessage({ id: "errorOccurred" }));
      }
    } else if (modalType === "keyword") {
      // If modalType is keyword
      if (!interest.name) {
        toast.error(intl.formatMessage({ id: "fillAllFields" }));
        return;
      }
      handleAdd(modalType, interest); // Call handleAdd function passed from props
      onClose(); //Close the modal
    }
  };

  // Handle item click (associate skill/interest or add keyword)
  const handleItemClick = async (item) => {
    if (isUser) {
      // If user is specified
      try {
        if (modalType === "skill") {
          //If modalType is a skill
          const response = await associateSkillToUser(token, userId, item.id);
          if (response === 200) {
            toast.success(intl.formatMessage({ id: "skillAssociatedSuccess" }));
          }
        } else {
          // If modalType is interest
          const response = await associateInterestToUser(
            token,
            userId,
            item.id
          );
          if (response === 200) {
            toast.success(intl.formatMessage({ id: "interestAssociatedSuccess" }));
          } else {
            toast.error(intl.formatMessage({ id: "errorOccurred" }));
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      handleAdd(modalType, item);
      onClose();
    }
  };

  return (
    <div>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-skill-container">
        {/* Close button */}
        <div className="modal-close" onClick={onClose}>
          <IoIosCloseCircleOutline />
        </div>
        {/* Modal title */}
        <p className="title-modal">
          {" "}
          {modalType === "skill"
            ? intl.formatMessage({ id: "addNewSkill" })
            : modalType === "interest"
            ? intl.formatMessage({ id: "addNewInterest" })
            : intl.formatMessage({ id: "addNewKeyword" })}
        </p>

        {/* Modal body */}
        <div className="modal-boby">
          <div className="list-keywords">
            {list &&
              list.map((item, index) => (
                <SkillComponent
                  key={index}
                  keyword={item.name}
                  onClick={() => handleItemClick(item)}
                />
              ))}
          </div>
        </div>
        {/* Modal info */}
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
          {/* Render select input for skills (only shown if modalType is skill) */}
          {modalType === "skill" && (
            <select
              className="skill-select"
              name="type"
              onChange={handleSkillInputChange}
              value={skill.type}
            >
              <option value="">
                {" "}
                {intl.formatMessage({ id: "pleaseSelectOneSkill" })}
              </option>
              <option value="CONHECIMENTO">
                {" "}
                {intl.formatMessage({ id: "conhecimento" })}
              </option>
              <option value="SOFTWARE">
                {intl.formatMessage({ id: "software" })}
              </option>
              <option value="HARDWARE">
                {intl.formatMessage({ id: "hardware" })}
              </option>
              <option value="FERRAMENTAS">
                {" "}
                {intl.formatMessage({ id: "ferramentas" })}
              </option>
            </select>
          )}
          {/* Input field for skill/interest/keyword */}
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
            name={modalType === "skill" ? "name" : "name"}
            onChange={
              modalType === "skill"
                ? handleSkillInputChange
                : handleInterestInputChange
            }
            value={modalType === "skill" ? skill.name : interest.name}
          />

          {/* Button to create skill/interest/keyword */}
          <button className="create-button" onClick={handleNewItem}>
            {modalType === "keyword"
              ? intl.formatMessage({ id: "add" })
              : intl.formatMessage({ id: "create" })}
          </button>
          <button className="back" onClick={onClose}>
            {intl.formatMessage({ id: "back" })}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNewSkill;
