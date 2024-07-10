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
    const { token } = userStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { projectId } = useParams();
    const [availableTasks, setAvailableTasks] = useState([]);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [showList, setShowList] = useState(true);
    const [viewMode, setViewMode] = useState('Week'); 
    const [showBoard, setShowBoard] = useState(false);
    const [showGantt, setShowGantt] = useState(true);
    const [tasksOrdered, setTasksOrdered] = useState([]);
    const [isMobile, setIsMobile] = useState(false); 
    const [selectedMode, setSelectedMode] = useState('gantt'); 

    const [project, setProject] = useState("");

    const closeModal = () => setIsModalOpen(false);
    const handleNewTask = () => setIsModalOpen(true);

    const fetchTasks = async () => {
        try {
            if (!token || !projectId) {
                console.warn("Missing token or projectId.");
                return;
            }

            setProject(await ProjectService.getProjectInfo(token, projectId));
            

            if (showGantt) {
                const data = await getProjectTasksOrderByDate(token, projectId);
                console.log(data);
                setTasksOrdered(data);
       
            } else{
                const data = await getProjectTasks(token, projectId);
                setAvailableTasks(data);
               
            
            }
            setIsPageLoaded(true);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    console.log(project);
    useEffect(() => {
        fetchTasks();
    }, [projectId, token, showGantt, showBoard]);

    useEffect(() => {
        const WS_URL = "ws://localhost:8080/project_backend/websocket/task/";
        const websocket = new WebSocket(WS_URL + token);
        
        websocket.onopen = () => {
            console.log("WebSocket connection for task is open");
        };
    
        websocket.onmessage = (event) => {
            const taskReceived = JSON.parse(event.data);
            console.log("Task received: ", taskReceived);
            taskReceived.startDate = formatDateFromArray(taskReceived.startDate)
            taskReceived.deadline = formatDateFromArray(taskReceived.deadline)
    
            if(taskReceived.erased === true){
                setAvailableTasks(prevTasks =>
                    prevTasks.filter(task => task.id!== taskReceived.id)
                );
            }else{
            // Atualiza a tarefa no estado
            setAvailableTasks(prevTasks => {
                // Verifica se a tarefa recebida deve ser adicionada ou atualizada
                const index = prevTasks.findIndex(task => task.id === taskReceived.id);
                if (index !== -1) {
                    // Tarefa já existe, atualiza ela
                    return [
                        ...prevTasks.slice(0, index),
                        { ...prevTasks[index], ...taskReceived },
                        ...prevTasks.slice(index + 1)
                    ];
                } else {
                    // Tarefa é nova, adiciona ela
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

    useEffect(() => {
        const handleResize = () => {
            // Atualiza o estado de acordo com a largura da janela
            setIsMobile(window.innerWidth < 768); // Define como móvel se a largura for menor que 768px
        };

        // Verifica o tamanho da janela inicialmente e adiciona um ouvinte de redimensionamento
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
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

    const showTasksList = () => {
        setShowList(!showList);
    }
    

    const handleChangeToGantt = () => {
        setSelectedMode('gantt');
        setShowBoard(false);
        setShowGantt(true);
    };
    
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
                           
                            {!showBoard && isPageLoaded && <GanttComponent availableTasks={tasksOrdered} showList={showList} viewMode={viewMode} project={project} />}
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
            <GoPlusCircle className= "add-task-button" onClick={handleNewTask}/> <p>{intl.formatMessage({ id: "addTask" })}</p>
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
