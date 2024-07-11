import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { userStore } from "../stores/UserStore";
import Task from "./Task";
import { useParams } from "react-router";

import {updateTaskStatus, softDeleteTask} from "../services/TaskService";
import ModalNewTask from "./ModalNewTask";
import { toast } from "react-toastify";



const TaskBoard = ({listTasks})=>{
  //Destructure the props values
    const {token} = userStore();
    const [taskId, setTaskId] = useState("");
    const {projectId} = useParams();

    const intl = useIntl();

    //State variables
    const [tasks, setTasks] = useState(listTasks);
    const [editTask, setEditTask] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskIdEdit, setTaskIdEdit] = useState(false);

    useEffect(() => {
      setTasks(listTasks); //Update the tasks list when the listTasks prop changes
  }, [listTasks]);
  
      
 
    //Lists of tasks in each state
const todoList = tasks.filter((tasks) => tasks.stateId === 10);
const doingList = tasks.filter((tasks) => tasks.stateId === 20);
const doneList = tasks.filter((tasks) => tasks.stateId === 30);

///Handle the event of dragging a task to another
const handleDragStart = (event, taskId) => {
    event.dataTransfer.setData("taskId", taskId);
    setTaskId(taskId);
  };

  //Handle the event of dragging a task to
  const handleDrop = async (event, token, taskId, newState) => {
    event.preventDefault();

    try {
      //Update the task en database
     await updateTaskStatus(token, projectId, taskId, newState);
    
    } catch (error) {
      console.error("Failed to update task state:", error);
    }
   
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };


  //Function to soft delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      // Deleta a tarefa no servidor
      const result = await softDeleteTask(token, projectId, taskId);
      if (result === 200) {
        toast.success(intl.formatMessage({ id: "taskDeleted" }));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
}

//Function to edit a task, show the modal
const handleEdit = (taskId) =>{
  setTaskIdEdit(taskId);
    setEditTask(true);
    setIsModalOpen(true);
}


const closeModal = () => setIsModalOpen(false);


    return(
        <div className = "scrumForPhone">
    
      
        <div className="board-container" >
          <div className="column">
            <div className="title">{intl.formatMessage({ id: "planned" })}</div>
            <section
              className="task_list"
              id="toDo"
              onDrop={(event) => handleDrop(event, token, taskId, 10)}
              onDragOver={allowDrop}
            >
              {todoList.map((task) => (
               <Task
               key={task.id}
               task={task}
               handleEdit={() => handleEdit(task.id)}
               handleDeleteTask={handleDeleteTask}
               handleDragStart={handleDragStart}
             />
              ))}
            </section>
            
          </div>
          <div
            className="column"
            onDrop={(event) => handleDrop(event, token, taskId, 20)}
            onDragOver={allowDrop}
          >
            <div className="title">{intl.formatMessage({ id: "inProgress" })}</div>
            <section className="task_list" id="doing">
              {doingList.map((task) => (
                <Task
                key={task.id}
                task={task}
                handleEdit={() => handleEdit(task.id)}
                token={token}
                handleDragStart={handleDragStart}
                handleDeleteTask={handleDeleteTask}
              />
              ))}
            </section>
          </div>
          <div
            className="column"
            onDrop={(event) => handleDrop(event, token, taskId, 30)}
            onDragOver={allowDrop}
          >
            <div className="title">{intl.formatMessage({ id: "finished" })}</div>
            <section className="task_list" id="done">
              {doneList.map((task) => (
                 <Task
                 key={task.id}
                 task={task}
                 handleEdit={() => handleEdit(task.id)}
                 handleDragStart={handleDragStart}
                 handleDeleteTask={handleDeleteTask}
                
                 />
              ))}
            </section>
          </div>
        </div>
        {isModalOpen && (<ModalNewTask onClose={closeModal} taskId={taskIdEdit} editTask={true}/> )}
     
    </div>

    )
}

export default TaskBoard;