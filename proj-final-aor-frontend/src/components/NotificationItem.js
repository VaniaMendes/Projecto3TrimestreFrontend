import React from 'react';
import { IntlProvider, useIntl } from "react-intl";
import languages from "../translations";
import {userStore} from "../stores/UserStore";
import moment from "moment";
import projectIcon from './assets/projectIcon.png';
import logoUser from './assets/profile_pic_default.png';


function NotificationItem({ notification, onClick}) {

  // Get the locale from the userStore
  const locale = userStore((state) => state.locale);
  const intl = useIntl();

  const handleClick = () => {
    if (!notification.readStatus) {
      onClick(notification.id);
    }
  };

  let notificationMessage;
  let notificationImage;

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
      notificationMessage =  `${intl.formatMessage({ id: "newProjectNotification" })} ${notification.sender.firstName} ${intl.formatMessage({ id: "withTheTitle" })}${notification.relatedEntityName}`; 
      notificationImage = projectIcon;
      break;
    case 'PROJECT_STATE_CHANGE':
      notificationMessage = `${intl.formatMessage({ id: "projectStatusNotification" })} ${notification.sender.firstName} ${intl.formatMessage({ id: "withTheTitle" })}${notification.relatedEntityName}`;
      break;
      case 'MESSAGE_PROJECT':
        notificationMessage =  `${intl.formatMessage({ id: "messageReceivedProject" })} ${notification.sender.firstName} ${intl.formatMessage({ id: "withTheTitle" })}${notification.relatedEntityName}`; 
        if(notification.sender.photo){
          notificationImage = notification.sender.photo;
        }else{
          notificationImage = logoUser;
        }
      break;
      case 'NEW_MEMBER':
        notificationMessage =  `${notification.sender.firstName} ${notification.sender.lastName} ${intl.formatMessage({ id: "newMemberNotification" })} ${notification.relatedEntityName}`; 
        if(notification.sender.photo){
          notificationImage = notification.sender.photo;
        }else{
          notificationImage = logoUser;
        }
      break;
    default:
      notificationMessage = `${intl.formatMessage({ id: "projectStatusNotification" })} ${notification.project.title}`;
  }


   // Get the current time
   const now = moment();

   // Get the time difference
   const duration = moment.duration(now.diff(notification.sendTimestamp));
 
   let formattedTimestamp;

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
         <IntlProvider locale={locale} messages={languages[locale]}>
    <div className="notification-avatar">
      <img className="notification-image" src={notificationImage} alt="avatar" />
    </div>
    <div className={`notification-item ${notification.type}`}>{notificationMessage}</div>
    <div className="notification-timestamp">{formattedTimestamp}</div>
    </IntlProvider>
    </div>

)
}

export default NotificationItem;