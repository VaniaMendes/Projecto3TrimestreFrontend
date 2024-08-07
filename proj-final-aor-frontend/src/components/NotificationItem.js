import React, {useState, useEffect} from 'react';
import { useIntl } from "react-intl";
import moment from "moment";
import projectIcon from './assets/projectIcon.png';
import logoUser from './assets/profile_pic_default.png';
import ProjectService from "../services/ProjectService";
import { userStore } from '../stores/UserStore';


function NotificationItem({ notification, onClick}) {

  const intl = useIntl();
  //Get the token from the user store
  const {token} = userStore();

  //State variables
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);


  // Fetch the project information when the component mounts
  useEffect(() => {
   
      const fetchProject = async () => {
        try {
          const projectResponse = await ProjectService.getProjectInfo(token, notification.relatedIDEntity);
          setProject(projectResponse);
        
        } catch (error) {
          console.error("Error fetching project:", error);
        }finally{
          setLoading(false);
        }
      };

      if (notification.type === 'PROJECT_STATE_CHANGE' || notification.type === 'NEW_PROJECT') {
        fetchProject();
      } else {
        setLoading(true);
      }
      fetchProject();
    
  }, [notification.relatedIDEntity, notification.type]);


// Add a click evente to the notification item
  const handleClick = () => {
    if (notification) {
      onClick(notification.id);
    }
  };

  let notificationMessage;
  let notificationImage;
  
//Create a notification item depending on the type of notification
  switch (notification.type) {
    case 'MESSAGE_RECEIVED':
      notificationMessage =  `${intl.formatMessage({ id: "messageReceived" })} ${notification.sender.firstName}`; 
      if(notification.sender.photo){
        notificationImage = notification.sender.photo;
      }else{
        notificationImage = logoUser;
      }
      
      break;
    case 'NEW_PROJECT':
      
      notificationMessage =  `${intl.formatMessage({ id: "newProjectNotification" })} ${notification.sender.firstName} ${intl.formatMessage({ id: "withTheTitle" })}${project.name}`; 
      notificationImage = projectIcon;
      break;
    case 'PROJECT_STATE_CHANGE':
      
      notificationMessage = ` ${intl.formatMessage({ id: "projectStatusNotification" })} ${project.name} ${intl.formatMessage({ id: "wasChanged" })}`;
      notificationImage = projectIcon;
      break;
      case 'MESSAGE_PROJECT':
        notificationMessage =  `${intl.formatMessage({ id: "messageReceivedProject" })} ${notification.sender.firstName} ${intl.formatMessage({ id: "forProject" })}${project.name}`; 
        if(notification.sender.photo){
          notificationImage = notification.sender.photo;
        }else{
          notificationImage = logoUser;
        }
      break;
      case 'NEW_MEMBER':
        notificationMessage =  ` ${intl.formatMessage({ id: "newMemberNotification" })} ${project.name} ${intl.formatMessage({ id: "byUser" })} ${notification.sender.firstName} ${notification.sender.lastName}`; 
        if(notification.sender.photo){
          notificationImage = notification.sender.photo;
        }else{
          notificationImage = logoUser;
        }
      break;
    default:
      notificationMessage = `${intl.formatMessage({ id: "projectStatusNotification" })}`;
  }


   // Get the current time
   const now = moment();

   // Get the time difference
   const duration = moment.duration(now.diff(notification.sendTimestamp));
 
   let formattedTimestamp;

   // Format the timestamp based on the time difference
   if (duration.asYears() >= 1) {
    formattedTimestamp = `${duration.years()} a`;
  } else if (duration.asMonths() >= 1) {
    formattedTimestamp = `${duration.months()} m`;
  } else if (duration.asDays() >= 1) {
    formattedTimestamp = `${duration.days()} d`;
  } else if (duration.asHours() >= 1) {
    formattedTimestamp = `${duration.hours()} h`;
  } else if (duration.asMinutes() >= 1) {
    formattedTimestamp = `${duration.minutes()} min`;
  } else {
    formattedTimestamp = `${duration.seconds()} s`;
  }
  

  return(
    <div className={`notification-info ${notification.readStatus ? 'read' : 'unread'}`} onClick={handleClick}>
         
    <div className="notification-avatar">
      <img className="notification-image" src={notificationImage} alt="avatar" />
    </div>
    <div className={`notification-item ${notification.type}`}>{notificationMessage}

      </div>
    <div className="notification-timestamp">{formattedTimestamp}</div>
  
    </div>

)
}

export default NotificationItem;