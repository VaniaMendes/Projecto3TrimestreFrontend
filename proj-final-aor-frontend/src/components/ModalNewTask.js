import React, { useState, useEffect } from "react";
import { userStore } from "../stores/UserStore";
import { useIntl } from "react-intl";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./ModalNewTask.css";
import {
  createTask,
  getTaskInfo,
  getListTasks,
  updateTask,
} from "../services/TaskService";
import ProjectService from "../services/ProjectService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function NewTask(props) {
  //Destructue the props values
  const { onClose, editTask, taskId } = props;
  //Get the token from the userStore
  const { token } = userStore();
  const { projectId } = useParams();
  const intl = useIntl();

  //State variables
  const [project, setProject] = useState({});
  const [showDependencies, setShowDependencies] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [additionalExecutors, setAdicionalExecutors] = useState("");
  const [deadline, setDeadline] = useState("");
  const [startDate, setStartDate] = useState("");
  const [priorityId, setPriorityId] = useState(10);
  const [tasksIdList, setTasksIdList] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [priorityColor, setPriorityColor] = useState("");
  const [dependencies, setDependencies] = useState([]);
  const [executor, setExecutor] = useState("");
  const [projectUsers, setProjectUsers] = useState([]);
  const [finalDateProject, setFinalDateProject] = useState("");

  const task = {
    title,
    description,
    additionalExecutors,
    deadline: deadline + "T23:59:59",
    startDate: startDate + "T00:00:00",
    priorityId: parseInt(priorityId),
    owner: { id: parseInt(executor) },
  };

  //Fetch the list of tasks and the project info when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {

        //Get list of tasks of the project
        const data = await getListTasks(token, projectId);
        setAvailableTasks(data);

        //Get info about the project to know about the conclusion date
        const projectInfo = await ProjectService.getProjectInfo(
          token,
          projectId
        );
        setProject(projectInfo);
        setFinalDateProject(projectInfo.conclusionDate);
        

        // Extract users from projectInfo
        if (projectInfo && projectInfo.usersInfo) {
          setProjectUsers(projectInfo.usersInfo);
        }

        // If task is being edited, fetch the task info and populate the form fields
        if (editTask && taskId) {
          const taskToEdit = await getTaskInfo(token, projectId, taskId);

          setTitle(taskToEdit.title);
          setDescription(taskToEdit.description);
          setAdicionalExecutors(taskToEdit.additionalExecutors);
          setDeadline(taskToEdit.deadline.split("T")[0]);
          setStartDate(taskToEdit.startDate.split("T")[0]);
          setPriorityId(taskToEdit.priorityId);
          setPriorityColor(taskToEdit.priorityId.toString());
          setDependencies(taskToEdit.dependencies);
          setExecutor(taskToEdit.owner.id.toString());

          // Map dependencies to IDs for the checkbox list
          const dependencyIds = taskToEdit.dependencies.map((dep) => dep.id);
          setTasksIdList(dependencyIds);
        }
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };
    fetchData();
  }, [token, projectId, editTask, taskId]);

  //Function to handle the new tasks
  const handleNewTask = async () => {

    //Validate the inputs of data time
    if (startDate > deadline) {
      toast.error(intl.formatMessage({ id: "deadlineMustBeBeforeStartDate" }));
      return;
    }
    if (deadline > finalDateProject) {
      toast.error(
        intl.formatMessage({ id: "deadlineMustBeBeforeFinalDateProject" })
      );
      return;
    }

    if (startDate > finalDateProject) {
      toast.error(
        intl.formatMessage({ id: "startDateMustBeBeforeFinalDateProject" })
      );
      return;
    }

    //If task is being edited, update the task, otherwise, create a new one
    if (editTask && taskId) {
      const result = await updateTask(
        token,
        projectId,
        taskId,
        task,
        tasksIdList
      );
      if (result === 200) {
        toast.success(intl.formatMessage({ id: "taskUpdatedSuccefuly" }));
        onClose();
      }
    } else {
      // Create a new task
      const result = await createTask(token, projectId, task, tasksIdList);
      if (result === 200) {
        toast.success(intl.formatMessage({ id: "taskCreatedSuccefuly" }));
        onClose();
      } else {
        console.error("Error creating new task");
      }
    }
  };

  //Handle with the priority change
  const handlePriorityChange = (event) => {
    setPriorityColor(event.target.value);
    setPriorityId(parseInt(event.target.value));
  };

  //Close the modal for dependencies
  const handleCloseDependencies = () => {
    setShowDependencies(false);
  };

  // Handle with the add dependencies
  const handleAddDependencies = () => {
    setShowDependencies(true);
    if (editTask) {
      setTasksIdList(dependencies.map((dep) => dep.id));
    } else {
      setTasksIdList([]);
    }
  };

  // Get the date in format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // onChange handler for the executor select
  const handleExecutorChange = (event) => {
    setExecutor(event.target.value); 
  };

  return (
    <div className="new-task-external-container">
      <div
        className={`new-task-container ${showDependencies ? "shift-left" : ""}`}
      >
        <div className="modal-close-task" onClick={onClose}>
          <IoIosCloseCircleOutline />
        </div>

        <h2 className="task_creationTitle">
          {editTask
            ? intl.formatMessage({ id: "taskEdition" })
            : intl.formatMessage({ id: "addTask" })}
        </h2>

        <div className="input-container">
          <input
            type="text"
            placeholder={intl.formatMessage({ id: "title" })}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <label htmlFor="title" className="label-description-task">
            {intl.formatMessage({ id: "title" })}
          </label>
        </div>

        <div className="input-container">
          <textarea
            cols="30"
            rows="3"
            placeholder={intl.formatMessage({ id: "description" })}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            style={{ resize: "none" }}
          ></textarea>
          <label htmlFor="description-task" className="label-description-task">
            {intl.formatMessage({ id: "description" })}
          </label>
        </div>

        <div className="input-container">
          <select
            className="select-task"
            value={executor}
            onChange={handleExecutorChange}
          >
            <option value="">
              {intl.formatMessage({ id: "selectExecutor" })}
            </option>
            {projectUsers &&
              projectUsers.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
          </select>
          <label htmlFor="executor-select" className="label-description-task">
            {intl.formatMessage({ id: "executor" })}
          </label>
        </div>

        <div className="input-container">
          <textarea
            cols="30"
            rows="3"
            placeholder={intl.formatMessage({ id: "executors" })}
            value={additionalExecutors}
            onChange={(event) => setAdicionalExecutors(event.target.value)}
            style={{ resize: "none" }}
          ></textarea>
          <label htmlFor="description-task" className="label-description-task">
            {intl.formatMessage({ id: "executors" })}
          </label>
        </div>

        <div className="dependencies" onClick={handleAddDependencies}>
          {!editTask
            ? intl.formatMessage({ id: "addDependys" })
            : intl.formatMessage({ id: "editDependys" })}
        </div>

        <div id="date_section" className="descriptionLabelTask">
          <div>
            <p>{intl.formatMessage({ id: "initialDate" })}</p>
            <input
              type="date"
              id="startDate"
              value={startDate}
              min={today}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
          <div id="end_date">
            <p>{intl.formatMessage({ id: "finalDate" })}</p>
            <input
              type="date"
              id="deadline"
              value={deadline}
              min={today}
              onChange={(event) => setDeadline(event.target.value)}
            />
          </div>
        </div>

        <div className="input-container">
          <div className="color-section">
            <div className="priority_div">
              <input
                type="radio"
                name="priorityId"
                id="low_priority"
                value="10"
                onChange={handlePriorityChange}
                checked={priorityId === 10}
              />
              <label htmlFor="low_priority">
                {intl.formatMessage({ id: "low" })}
              </label>
            </div>
            <div className="priority_div">
              <input
                type="radio"
                name="priorityId"
                id="medium_priority"
                value="20"
                onChange={handlePriorityChange}
                checked={priorityId === 20}
              />
              <label htmlFor="medium_priority">
                {intl.formatMessage({ id: "medium" })}
              </label>
            </div>
            <div className="priority_div">
              <input
                type="radio"
                name="priorityId"
                id="high_priority"
                value="30"
                onChange={handlePriorityChange}
                checked={priorityId === 30}
              />
              <label htmlFor="high_priority">
                {intl.formatMessage({ id: "high" })}
              </label>
            </div>
            <div
              id="priority_color"
              style={{
                backgroundColor:
                  priorityColor === "10"
                    ? "green"
                    : priorityColor === "20"
                    ? "yellow"
                    : priorityColor === "30"
                    ? "red"
                    : "green",
              }}
            ></div>
          </div>
          <label htmlFor="description-task" className="label-description-task">
            {intl.formatMessage({ id: "priority" })}
          </label>
        </div>

        <div className="buttons">
          <button className="btns_task" id="task_save" onClick={handleNewTask}>
            {editTask
              ? intl.formatMessage({ id: "update" })
              : intl.formatMessage({ id: "save" })}
          </button>
          <button className="btns_task" id="task_cancel" onClick={onClose}>
            {intl.formatMessage({ id: "back" })}
          </button>
        </div>

        <div id="error_creating_task"></div>
      </div>

      {showDependencies && (
        <div className="dependencies_modal">
          <div
            className="modal-close-dependencies"
            onClick={handleCloseDependencies}
          >
            <IoIosCloseCircleOutline />
          </div>
          <h2 className="label-description-task">
            {intl.formatMessage({ id: "addDependys" })}
          </h2>
          <div className="dependencies_list">
            {availableTasks &&
              availableTasks.map((task) => (
                <div key={task.id} className="task_item">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id={task.id}
                      value={task.id}
                      checked={tasksIdList.includes(task.id)}
                      onChange={(event) => {
                        const newPrerequisiteTasks = [...tasksIdList];
                        if (event.target.checked) {
                          newPrerequisiteTasks.push(task.id);
                        } else {
                          const index = newPrerequisiteTasks.indexOf(task.id);
                          if (index !== -1) {
                            newPrerequisiteTasks.splice(index, 1);
                          }
                        }
                        setTasksIdList(newPrerequisiteTasks);
                      }}
                    />
                  </div>
                  <div className="task-title">
                    <label htmlFor={task.id}>{task.title}</label>
                  </div>
                </div>
              ))}

            <button
              className="btns_task"
              id="task_save"
              onClick={handleCloseDependencies}
            >
              {intl.formatMessage({ id: "save" })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewTask;
