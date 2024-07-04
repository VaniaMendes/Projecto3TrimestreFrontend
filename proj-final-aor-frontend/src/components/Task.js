import React from "react";
import { MdModeEditOutline, MdDelete } from "react-icons/md";

function Task({
  task,
  handleDeleteTask,
  handleDragStart,
  handleEdit,
  handleTaskDoubleClick
}) {

  const getColorForPriority = (priority) => {
    if (priority === 10) {
      return "green";
    } else if (priority === 20) {
      return "yellow";
    } else if (priority === 30) {
      return "red";
    } else {
      return "grey";
    }
  };

  return (
    <div
      className="task"
      key={task.id}
      draggable
      onDragStart={(event) => handleDragStart(event, task.id)}
      onDoubleClick={() => handleTaskDoubleClick(task.id)}
    >
      <div
        className="priority-bar"
        style={{
          backgroundColor: getColorForPriority(task.priorityId),
        }}
      ></div>
      <div className="task-header">
        <div className="task-title">{task.title}</div>
      </div>
      
      <div className="task-details">
      <div className="task-author">{task.owner.firstName}</div>
        <div className="buttons_scrum">
          <span
            className="delete_btnS"
            onClick={() => handleEdit(task.id)}
          >
            <MdModeEditOutline />
          </span>
          <span
            className="task_btnS"
            onClick={() => handleDeleteTask(task.id)}
          >
            <MdDelete />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Task;
