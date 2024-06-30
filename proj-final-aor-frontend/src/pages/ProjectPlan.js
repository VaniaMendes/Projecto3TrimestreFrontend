import React, {useState, useEffect} from 'react';
import Header from "../components/header/Header";
import './ProjectPlan.css';
import {GoPlusCircle} from 'react-icons/go';
import { IntlProvider, useIntl } from "react-intl";
import { userStore } from "../stores/UserStore";
import languages from "../translations";
import ModalNewTask from '../components/ModalNewTask';
import { useParams } from 'react-router';
import { getProjectTasks } from '../services/TaskService';
import GantChart from '../components/GanttChart';

const ProjectPlan = () => {
    const {locale, token} = userStore();
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const {projectId} = useParams();
    const [availableTasks, setAvailableTasks] = useState([]);

    const closeModal = () => setIsModalOpen(false);
    const handleNewTask = () => setIsModalOpen(true);

    useEffect(() => {
        const fetchTasks = async () => {
          try {
            const data = await getProjectTasks(token, projectId); 
            setAvailableTasks(data); 
          } catch (error) {
            console.error("Error fetching tasks:", error);
          }
        };
    
        fetchTasks(); 
      }, [token, projectId]); 

    

    return (
        <div>
            <IntlProvider locale={locale} messages={languages[locale]}>
                <div className="project-plan-container">
                    <Header />
                    <div className="project-plan-separator"><p className="separator-description">GANT</p></div>
                   
                    <div className="project-plan-exterior-container">
                        <div className="project-plan-chart">
                        <GantChart availableTasks={availableTasks}
                           
                        />
                        </div>
                        <TaskAdder handleNewTask={handleNewTask} />
                        
                    </div>
                </div>
                {isModalOpen && (<ModalNewTask  onClose={closeModal}/>)}
            </IntlProvider>
        </div>
    );
}

// Componente interno que usa useIntl
const TaskAdder = ({handleNewTask}) => {
    const intl = useIntl(); // Agora useIntl é usado corretamente dentro do contexto do IntlProvider

    return (
        <div className="add-task" onClick={handleNewTask}>
            <GoPlusCircle /> <p>{intl.formatMessage({ id: "addTask" })}</p>
        </div>
    );
};

export default ProjectPlan;