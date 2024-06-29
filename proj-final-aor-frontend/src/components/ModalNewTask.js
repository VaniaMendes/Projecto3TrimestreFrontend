import React, { useState } from "react";
import { userStore } from "../stores/UserStore";
import languages from "../translations";
import { IntlProvider, FormattedMessage, useIntl } from "react-intl";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./ModalNewTask.css";

function NewTask({ onClose }) {
  // Obtem a linguagem de exibição da página
  const { locale } = userStore((state) => state.locale);
  const [editTask, setEditTask] = useState(false);
  const intl = useIntl();

  // Estados para guardar os dados da task para editar
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adicionalExecutors, setAdicionalExecutors] = useState("");
  const [endDate, setEndDate] = useState("");
  const [initialDate, setInitialDate] = useState("");
  const [priority, setPriority] = useState("");
  const [categories, setCategories] = useState(null);
  const [priorityColor, setPriorityColor] = useState("");
  const [idCategory, setIdCategory] = useState("");

  // Função para mudar a cor da prioridade
  const handlePriorityChange = (event) => {
    setPriorityColor(event.target.value);
    setPriority(event.target.value);
  };

  return (
    <div className="new-task-external-container">
      <div className="new-task-container">
        <div className="modal-close-task" onClick={onClose}>
          <IoIosCloseCircleOutline />
        </div>
        
        <h2 className="task_creationTitle">
          {editTask ? (
            intl.formatMessage({ id: "taskEdition" })
          ) : (
            intl.formatMessage({ id: "addTask" })
          )}
        </h2>
      
       

        <div className="input-container">
       
            <input
              type="text"
              placeholder= {intl.formatMessage({ id: "title" })}
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          
   
        <label htmlFor="title" className="label-description-editProfile">
        {intl.formatMessage({ id: "title" })}
        </label>

        </div>

       <div className="input-container">
            <textarea
              cols="30"
              rows="14"
              placeholder= {intl.formatMessage({ id: "description" })}
              className="description-task"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            ></textarea>
          
          
        <label htmlFor="description-task" className="label-description-editProfile">
        {intl.formatMessage({ id: "description" })}
        </label>
       </div>
       
        
        <div className="input-container">
            <textarea
              cols="30"
              rows="14"
              placeholder={intl.formatMessage({ id: "executors" })}
              className="description-task"
              value={adicionalExecutors}
              onChange={(event) => setAdicionalExecutors(event.target.value)}
            ></textarea>
             <label htmlFor="description-task" className="label-description-editProfile">
        {intl.formatMessage({ id: "executors" })}
         
        </label>

</div>

        <div id="date_section" className="descriptioLabelTask">
          <div>
            <p>
              <FormattedMessage id="initialDate">
                {(message) => <span>{message}</span>}
              </FormattedMessage>
            </p>
            <input
              type="date"
              id="initial_date"
              value={initialDate}
              onChange={(event) => setInitialDate(event.target.value)}
            />
          </div>
          <div id="end_date">
            <p>
              <FormattedMessage id="finalDate">
                {(message) => <span>{message}</span>}
              </FormattedMessage>
            </p>
            <input
              type="date"
              id="end_dates"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        </div>

        <div id="color_section">
          <label id="label_color">
            <FormattedMessage id="priority">
              {(message) => <span>{message}</span>}
            </FormattedMessage>
          </label>
          <div className="priority_div">
            <input
              type="radio"
              name="priority"
              id="low_priority"
              value="100"
              onChange={handlePriorityChange}
              checked={priority === "100"}
            />
            <label htmlFor="low_priority">
              <FormattedMessage id="low">
                {(message) => <span>{message}</span>}
              </FormattedMessage>
            </label>
          </div>
          <div className="priority_div">
            <input
              type="radio"
              name="priority"
              id="medium_priority"
              value="200"
              onChange={handlePriorityChange}
              checked={priority === "200"}
            />
            <label htmlFor="medium_priority">
              <FormattedMessage id="medium">
                {(message) => <span>{message}</span>}
              </FormattedMessage>
            </label>
          </div>
          <div className="priority_div">
            <input
              type="radio"
              name="priority"
              id="high_priority"
              value="300"
              onChange={handlePriorityChange}
              checked={priority === "300"}
            />
            <label htmlFor="high_priority">
              <FormattedMessage id="high">
                {(message) => <span>{message}</span>}
              </FormattedMessage>
            </label>
          </div>
          <div
            id="priority_color"
            style={{
              backgroundColor:
                priorityColor === "100"
                  ? "green"
                  : priorityColor === "200"
                  ? "yellow"
                  : priorityColor === "300"
                  ? "red"
                  : "transparent",
            }}
          ></div>
        </div>

        <div className="buttons">
          <button className="btns_task" id="task_save">
            {editTask ? (
              <FormattedMessage id="update">
                {(message) => <span>{message}</span>}
              </FormattedMessage>
            ) : (
              <FormattedMessage id="save">
                {(message) => <span>{message}</span>}
              </FormattedMessage>
            )}
          </button>
          <button className="btns_task" id="task_cancel" onClick={onClose}>
            <FormattedMessage id="back">
              {(message) => <span>{message}</span>}
            </FormattedMessage>
          </button>
        </div>

        <div id="error_creating_task"></div>
      </div>
    </div>
  );
}

export default NewTask;
