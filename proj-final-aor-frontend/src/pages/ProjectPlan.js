import React, { useState, useEffect } from 'react';
import Header from "../components/header/Header";
import './ProjectPlan.css';
import { GoPlusCircle } from 'react-icons/go';
import { useIntl } from "react-intl";
import { userStore } from "../stores/UserStore";
import ModalNewTask from '../components/ModalNewTask';
import { useParams } from 'react-router';
import { getProjectTasks, getProjectTasksOrderByDate } from '../services/TaskService';
import GanttComponent from '../components/GanttChart';
import Visibility from '../components/profile/Visibility';
import TaskBoard from '../components/TaskBoard';
import ProjectService from '../services/ProjectService';

const ProjectPlan = () => {

    //Get the token from the userStore
    const { token } = userStore();

    //State variables
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { projectId } = useParams();
    const [availableTasks, setAvailableTasks] = useState([]);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [showList, setShowList] = useState(true);
    const [viewMode, setViewMode] = useState('Week'); 
    const [showBoard, setShowBoard] = useState(false);
    const [showGantt, setShowGantt] = useState(true);
    const [isMobile, setIsMobile] = useState(false); 
    const [selectedMode, setSelectedMode] = useState('gantt'); 
    const [project, setProject] = useState("");

    //Functions to close modal or show modal new task
    const closeModal = () => setIsModalOpen(false);
    const handleNewTask = () => setIsModalOpen(true);

    //Fetch tasks when component mounts
    const fetchTasks = async () => {
        try {
            if (!token || !projectId) {
                console.warn("Missing token or projectId.");
                return;
            }

            //Get info about the project
            setProject(await ProjectService.getProjectInfo(token, projectId));
            

            //If showGantt is true, fetch tasks ordered by date
            if (showGantt) {
                const data = await getProjectTasksOrderByDate(token, projectId);
                console.log(data);
                setAvailableTasks(data);
       
            } else{
                //if showBoard is true, fetch tasks ordered by priority
                const data = await getProjectTasks(token, projectId);
                setAvailableTasks(data);
            
            }
            setIsPageLoaded(true);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };


    //efect to mount the component
    useEffect(() => {
        fetchTasks();
    }, [projectId, token, showGantt, showBoard]);


    //efect to received a task from websocket connection
    useEffect(() => {
        const WS_URL = "ws://localhost:8080/project_backend/websocket/task/";
        const websocket = new WebSocket(WS_URL + token);
        
        websocket.onopen = () => {
            console.log("WebSocket connection for task is open");
        };
    
        websocket.onmessage = (event) => {
            const taskReceived = JSON.parse(event.data);
          
            taskReceived.startDate = formatDateFromArray(taskReceived.startDate)
            taskReceived.deadline = formatDateFromArray(taskReceived.deadline)
    
            //If task was deleted , is removed from the list
            if(taskReceived.erased === true){
                setAvailableTasks(prevTasks =>
                    prevTasks.filter(task => task.id!== taskReceived.id)
                );
            }else{
         //If not verifica it was a new task or an update
            setAvailableTasks(prevTasks => {
                //
                const index = prevTasks.findIndex(task => task.id === taskReceived.id);
                if (index !== -1) {
                   //If the task already exists, update it
                    return [
                        ...prevTasks.slice(0, index),
                        { ...prevTasks[index], ...taskReceived },
                        ...prevTasks.slice(index + 1)
                    ];
                } else {
                    // Otherwise, add the new task to the list
                    return [...prevTasks, taskReceived];
                }
            });
        }

            
        };
       
        websocket.onclose = (event) => {
            console.warn("WebSocket task closed: ", event);
        };
    
        websocket.onerror = (error) => {
            console.error("WebSocket task error: ", error);
        };
    
        return () => {
            websocket.close();
        };
    }, [token]);


    //Efect for mobile device
    useEffect(() => {
        const handleResize = () => {
            
            setIsMobile(window.innerWidth < 768); 
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    //Format date and time of task
    function formatDateFromArray(dateArray) {
        // Cria um objeto Date usando os valores do array
        const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
      
        // Formata a data e hora
        const year = date.getFullYear().toString().slice(-2); // Pega os dois últimos dígitos do ano
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adiciona um zero à esquerda se necessário
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
      
        // Retorna a data formatada
        return `${day}/${month}/${year} ${hour}:${minute}`;
      }

      //Show task list
    const showTasksList = () => {
        setShowList(!showList);
    }
    

    //Handle to render the gantt component
    const handleChangeToGantt = () => {
        setSelectedMode('gantt');
        setShowBoard(false);
        setShowGantt(true);
    };
    
    //Handle to render the board component
    const handleChangeToBoard = () => {
        setSelectedMode('board');
        setShowBoard(true);
        setShowGantt(false);
    };


    return (
        <div>
            
                <div className="project-plan-container">
                    <Header />
                    <div className={`project-plan-separator ${selectedMode === 'board' ? 'selected' : ''}`} onClick={handleChangeToGantt}>
                    <p className="separator-description">GANTT</p>
                </div>
                <div className={`project-plan-separator-board ${selectedMode === 'gantt' ? 'selected' : ''}`} onClick={handleChangeToBoard}>
                    <p className="separator-description">BOARD</p>
                </div>
                    {!showBoard && isPageLoaded && !isMobile && (<Visibility project={true} showTasksList={showTasksList}/>)}
                    {!showBoard && !isMobile && (<Buttons setViewMode={setViewMode} />)}

                    <div className="project-plan-exterior-container">
                        <div className="project-plan-chart">
                           
                            {!showBoard && isPageLoaded && <GanttComponent availableTasks={availableTasks} showList={showList} viewMode={viewMode} project={project} />}
                    {showBoard && isPageLoaded&& <TaskBoard listTasks={availableTasks} />}
                        </div>
                        <TaskAdder handleNewTask={handleNewTask} />
                    </div>
                </div>
                {isModalOpen && (<ModalNewTask onClose={closeModal} />)}

        </div>
    );
};

// Componente interno que usa useIntl
const TaskAdder = ({ handleNewTask }) => {
    const intl = useIntl();

    return (
        <div className="add-task" >
            <GoPlusCircle className= "add-task-button" onClick={handleNewTask}/> <p className="add-new-task" onClick={handleNewTask}>{intl.formatMessage({ id: "addTask" })}</p>
        </div>
    );
};

const Buttons = ({ setViewMode }) => {
    const intl = useIntl();

    return (
        <div className="date-buttons-container">
            <button className="date-button" onClick={() => setViewMode('Day')}>{intl.formatMessage({ id: "days" })}</button>
            <button className="date-button" onClick={() => setViewMode('Week')}>{intl.formatMessage({ id: "week" })}</button>
            <button className="date-button" onClick={() => setViewMode('Month')}>{intl.formatMessage({ id: "month" })}</button>
        </div>
    )
}

export default ProjectPlan;
