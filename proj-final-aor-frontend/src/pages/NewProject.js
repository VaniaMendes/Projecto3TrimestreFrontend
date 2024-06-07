import React, {useState} from "react";
import './NewProject.css';
import Header from "../components/header/Header";
import {userStore} from "../stores/UserStore";
import languages from "../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";
import KeywordComponent from "../components/keywords/KeywordComponent";

const NewProject = () => {
    const {locale} = userStore();
    const [inputs, setInputs] = useState({
        name: '',
        description: '',
        maxMembers: '',
        lab: ''
    });

    const [keywords, setKeywords] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resources, setResources] = useState([]);
    
    const [newKeyword, setNewKeyword] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [newResource, setNewResource] = useState('');

    const [isAddOpen, setIsAddOpen] = useState(false);

    const labOptions = {
        LISBOA: "Lisboa",
        COIMBRA: "Coimbra",
        PORTO: "Porto",
        TOMAR: "Tomar",
        VISEU: "Viseu",
        VILA_REAL: "Vila Real"
    };

    const handleAddClick = () => {
        setIsAddOpen(!isAddOpen);
    };

    const handleAddKeyword = () => {
        if (newKeyword.trim() !== '') {
        setKeywords([...keywords, newKeyword.trim()]);
        setNewKeyword('');
        }
    };

    const handleAddSkill = () => {
        if (newSkill.trim() !== '') {
        setSkills([...skills, newSkill.trim()]);
        setNewSkill('');
        }
    };

    const handleAddResource = () => {
        if (newResource.trim() !== '') {
        setResources([...resources, newResource.trim()]);
        setNewResource('');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    };

    
    const handleSubmit = (event) => {
        event.preventDefault();
        
        const projectData = {
            name: inputs.name,
            description: inputs.description,
            keywords: keywords.join(', '),
            needs: resources.join(', '),
            maxMembers: parseInt(inputs.maxMembers, 10),
            lab: { name: inputs.lab }
        };
        console.log("Submitting project data:", projectData);
    }

    return (
        <div>
            <Header />

            <IntlProvider locale={locale} messages={languages[locale]}>
                <div className="new-project-container">
                    <div className="project-form-container">
                        <h1>New Project</h1>
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
                                            name="members"
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

                            {/* Description input */}
                            <div className="text-area-container">
                                <textarea 
                                    name="description"
                                    placeholder="Description"
                                />
                                 <label className="textarea-label-description" htmlFor="description">
                                    <FormattedMessage id="description">
                                        {(message) => <span>{message} *</span>}
                                    </FormattedMessage>
                                </label>
                            </div>

                            <div className="sections-container">
                            <Section
                                title="Keywords"
                                items={keywords}
                                newItem={newKeyword}
                                setNewItem={setNewKeyword}
                                handleAddItem={handleAddKeyword}
                                isAddOpen={isAddOpen}
                                handleAddClick={handleAddClick}
                            />
                            <Section
                                title="Skills"
                                items={skills}
                                newItem={newSkill}
                                setNewItem={setNewSkill}
                                handleAddItem={handleAddSkill}
                                isAddOpen={isAddOpen}
                                handleAddClick={handleAddClick}
                            />
                            <Section
                                title="Resources"
                                items={resources}
                                newItem={newResource}
                                setNewItem={setNewResource}
                                handleAddItem={handleAddResource}
                                isAddOpen={isAddOpen}
                                handleAddClick={handleAddClick}
                            />
                            </div>

                        {/* Submit button */}
                        <button type="submit">
                            <FormattedMessage id="confirm">
                            {(message) => <span>{message}</span>}
                            </FormattedMessage>
                        </button>
                        {/* Back button */}
                        </form>
                    </div>
                </div>
            </IntlProvider>
            
        </div>
    );
};


const Section = ({ title, items, newItem, setNewItem, handleAddItem, isAddOpen, handleAddClick }) => (
    <div className="section-wrapper">
        <div className="section-container">
        <h3 className="section-label">{title}</h3>
            <div className="words-container">
                {items.map((item, index) => (
                <KeywordComponent key={index} keyword={item} isProjectInfo={true}/>
                ))}
            
            </div>
            <div>
                {!isAddOpen && (
                <span className="add-component-button" onClick={() => handleAddClick()}>+</span>
                )}
            </div>
        </div>
        
            

        <div className="input-container">
            <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={`Add new ${title.toLowerCase()}`}
            />
            <button type="button" onClick={handleAddItem}>+</button>
        </div>
        
    </div>
  );
  

export default NewProject;