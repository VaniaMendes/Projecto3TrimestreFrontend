import React, {useState, useEffect} from "react";
import './NewProject.css';
import { toast } from 'react-toastify';
import Header from "../components/header/Header";
import { GoPlusCircle } from "react-icons/go";
import { FiEdit3 } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {userStore} from "../stores/UserStore";
import languages from "../translations"; 
import { IntlProvider, FormattedMessage, injectIntl } from "react-intl";
import KeywordComponent from "../components/keywords/KeywordComponent";
import { getAllInterests } from "../services/interests";
import ProjectService from "../services/ProjectService";

const NewProject = () => {
    const {locale, token} = userStore();
    const [inputs, setInputs] = useState({
        name: '',
        description: '',
        maxMembers: '',
        lab: ''
    });

    const [description, setDescription] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [needs, setNeeds] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openEditModal, setEditModal] = useState(false);
    const [modalType, setModalType] = useState(""); 


    const labOptions = {
        LISBOA: "Lisboa",
        COIMBRA: "Coimbra",
        PORTO: "Porto",
        TOMAR: "Tomar",
        VISEU: "Viseu",
        VILA_REAL: "Vila Real"
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditModal(false);
    };

    const handleOpenModalDescription = () => {
        setEditModal(true);
        setModalType("description");
    };

    const handleOpenModalKeywords = () => {
        setIsModalOpen(true);
        setModalType("keyword");
    };

    const handleOpenModalNeeds = () => {
        setIsModalOpen(true);
        setModalType("need");
    };

    

    const handleChange = (event) => {
        const { name, value } = event.target;
        let parsedValue = value;
        if (name === 'maxMembers') {
            parsedValue = isNaN(parseInt(value, 10)) ? '' : parseInt(value, 10);
        }
        setInputs(inputs => ({ ...inputs, [name]: parsedValue }));
    };

    const handleRemoveKeyword = (keyword) => {
        setKeywords(keywords.filter(kw => kw !== keyword));
    };
    
    const handleRemoveNeed = (need) => {
        setNeeds(needs.filter(nd => nd !== need));
    };

    
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const projectData = {
            name: inputs.name,
            description: description,
            keywords: keywords.join(', '),
            needs: needs.join(', '),
            maxMembers: parseInt(inputs.maxMembers, 10),
            lab: { name: inputs.lab }
        };
        console.log("Submitting project data:", projectData);

        const response = await ProjectService.register(token, projectData);
        
        if (response) {
            toast.success("Project created successfully");

            setInputs({ name: '', lab: '', maxMembers: '' });
            setDescription('');
            setKeywords([]);
            setNeeds([]);
        } else {
            toast.error("Error creating project");
        }
    }

    return (
        <div>
            <Header />

            <IntlProvider locale={locale} messages={languages[locale]}>
                <div className="new-project-container">
                    <div className="project-form-container">
                        <h1><FormattedMessage id="create"/> <FormattedMessage id="project"/></h1>
                        <form className="form" onSubmit={handleSubmit}>
                            <div className = "project-inputs-top">
                                <div className = "input-container">
                                {/* Project Name input */}
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={inputs.name}
                                    onChange={handleChange}
                                    required
                                />
                                <label className="label-description" htmlFor="name">
                                    <FormattedMessage id="projectName">
                                        {(message) => <span>{message} *</span>}
                                    </FormattedMessage>
                                </label>
                                </div>
                                <div className = "input-container">
                                    {/* Max Members input */}
                                    <input
                                        type="text"
                                        name="maxMembers"
                                        placeholder="Max Members"
                                        value={inputs.maxMembers}
                                        onChange={handleChange}
                                    />

                                    <label className="label-description" htmlFor="members">
                                        <FormattedMessage id="maxMembers">
                                            {(message) => <span>{message}</span>}
                                        </FormattedMessage>
                                    </label>
                                </div>
                                
                            </div>
                            
                            {/* Workplace input */}
                            <label><FormattedMessage id="lab">
                                    {(message) => <span>{message} *</span>}
                                </FormattedMessage></label>
                            <div className="radio-buttonsConfirm">
                                {Object.entries(labOptions).map(([labValue, labLabel], index) => (
                                    <div className="radio-item" key={index}>
                                        <input
                                            type="radio"
                                            id={`option${index + 1}`}
                                            name="lab"
                                            value={labValue}
                                            onChange={handleChange}
                                            checked={inputs.lab === labValue}
                                        />
                                        <label className="radio-description" htmlFor={`option${index + 1}`}>{labLabel}</label>
                                    </div>
                                ))}
                            </div>

                            {/* Conteúdo da descrição */}
                            <div className="profile-biography">
                                <div className="input-profile">
                                    <label className="label-profile" htmlFor="biography">
                                    <FormattedMessage id="description">
                                        {(message) => <span>{message} *</span>}
                                    </FormattedMessage>
                                    </label>
                                </div>
                                <div className="add-keywords" onClick={handleOpenModalDescription}>
                                    <FiEdit3 />
                                </div>
                                {description && <div>{description}</div>}
                            </div>

                            <div className="sections-container">
                                <div className="profile-keywords">
                                    {/* Conteúdo das palavras-chave */}
                                    <div className="input-profile">
                                        <label className="label-profile" htmlFor="keywords">
                                            <FormattedMessage id="keywords"/>
                                        </label>
                                    </div>

                                    <div className="add-keywords" onClick={handleOpenModalKeywords}>
                                        <GoPlusCircle />
                                    </div>
                                    <div className="list-keywords">
                                        {keywords.map((keyword, index) => (
                                            <KeywordComponent key={index} keyword={keyword} isProjectInfo={true} isItemRemovable={true} onRemoveClick={handleRemoveKeyword}/>
                                        ))}
                                    </div>
                                </div>

                                

                                <div className="profile-keywords">
                                    {/* Conteúdo das necessidades */}
                                    <div className="input-profile">
                                        <label className="label-profile" htmlFor="needs">
                                            <FormattedMessage id="needs"/>
                                        </label>
                                    </div>

                                    <div className="add-keywords" onClick={handleOpenModalNeeds}>
                                        <GoPlusCircle />
                                    </div>
                                    <div className="list-keywords">
                                        {needs.map((need, index) => (
                                            <KeywordComponent key={index} keyword={need} isProjectInfo={true} isItemRemovable={true} onRemoveClick={handleRemoveNeed}/>
                                        ))}
                                    </div>
                                </div>

                            
                            </div>

                            {/* Submit button */}
                            <button type="submit">
                                <FormattedMessage id="confirm">
                                {(message) => <span>{message}</span>}
                                </FormattedMessage>
                            </button>
                        
                        </form>
                    </div>
                </div>

                <div>
                    {isModalOpen && (
                        <InjectedAddNewKeywordOrNeed 
                            onClose={handleCloseModal} 
                            modalType={modalType}
                            keywords={keywords}
                            setKeywords={setKeywords}
                            needs={needs}
                            setNeeds={setNeeds}
                        />
                    )}
                    {openEditModal && (
                        <EditProject
                            onClose={handleCloseModal}
                            modalType={modalType}
                            description={description}
                            setDescription={setDescription}
                        />
                    )}
                </div>
            </IntlProvider>
            
        </div>
    );
};

function EditProject({ onClose, modalType, description, setDescription }) {
  
    const handleEditProject = async (type) => {
      onClose();
    };
        
    const handleChangeDescription = (event) => {
        const { value } = event.target;
        setDescription(value);
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
                value={description || ""}
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


  function AddNewKeywordOrNeed({ onClose, modalType, keywords, setKeywords, needs, setNeeds, intl }) {
  
    // State variables
    const [list, setList] = useState([]);
    const [inputValue, setInputValue] = useState("");
    
  
    useEffect(() => {
      async function fetchInterests() {
        if (modalType === "keyword") {
            const data = await getAllInterests();
            setList(data);
        }
      }
      fetchInterests();
    }, [modalType]);
  
    
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };
  
    const handleAddNewItem = () => {
        
        const values = inputValue.split(",").map(value => value.trim().charAt(0).toUpperCase() + value.slice(1).toLowerCase());
        const existingKeywords = new Set(keywords.map(k => k.charAt(0).toUpperCase() + k.slice(1).toLowerCase()));
        const existingNeeds = new Set(needs.map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()));

        let error = "";
        if (modalType === "keyword") {
            const newKeywords = [];
            values.forEach(value => {
                if (existingKeywords.has(value)) {
                    error += `Keyword "${value}" already exists. `;
                } else {
                    newKeywords.push(value);
                    existingKeywords.add(value);
                }
            });
            setKeywords([...keywords, ...newKeywords]);
        } else {
            const newNeeds = [];
            values.forEach(value => {
                if (existingNeeds.has(value)) {
                    error += `Need "${value}" already exists. `;
                } else {
                    newNeeds.push(value);
                    existingNeeds.add(value);
                }
            });
            setNeeds([...needs, ...newNeeds]);
        }

        if (error) {
            toast.warning(error);
        } else {
            toast.success(`${modalType === "keyword" ? "Keywords" : "Needs"} updated successfully`);
            setInputValue("");
            onClose();
        }
    };
    
    

    const handleItemClick = (item) => {
        if (modalType === "keyword") {
            if (!keywords.includes(item)) {
                setKeywords([...keywords, item]);
                toast.success(`Keyword "${item}" added successfully`);
            } else {
                toast.error(`Keyword "${item}" already added`);
            }
        }
    };
    
    

    return (
        <div className="modal-skill-container">
            <div className="modal-close" onClick={() => onClose()}>
                <IoIosCloseCircleOutline />
            </div>
            <h1>
                {modalType === "keyword"
                    ? <FormattedMessage id="addKeyword"/>
                    : <FormattedMessage id="addNeed"/>
                }
            </h1>
  
            <div className="modal-body">
                {modalType === "keyword" && (
                    <div className="list-keywords">
                        {list.map((item, index) => (
                            <KeywordComponent key={index} id={item.id} keyword={item.name} onClick={() => handleItemClick(item.name)} />
                        ))}
                    </div>
                )}
            </div>
            <div className="skill-select-container">
                <input
                    className="skill-input"
                    type="text"
                    placeholder={
                        modalType === "keyword"
                            ? intl.formatMessage({ id: "addKeyword" })
                            : intl.formatMessage({ id: "addNeed" })
                    }
                    onChange={handleInputChange}
                    value={inputValue}
                />
                <button className="create-button" onClick={handleAddNewItem}>
                    <FormattedMessage id="save"/>
                </button>
            </div>
            <button onClick={onClose}><FormattedMessage id="back"/></button>
        </div>
    );
}


const InjectedAddNewKeywordOrNeed = injectIntl(AddNewKeywordOrNeed);
  

export default NewProject;