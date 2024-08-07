import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import './components/forms/FormStyle.css';
import './index.css';
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import reportWebVitals from './reportWebVitals';
import 'react-toastify/dist/ReactToastify.css';
import ForgetPassword from './pages/ForgetPassword.js';
import Register from './pages/Register.js';
import { ToastContainer } from 'react-toastify';
import ChangePassword from './pages/ChangePassword.js';
import ConfirmationAccount from './pages/ConfirmationAccount.js';
import NewProject from './pages/NewProject.js';
import UserProfile from './pages/UserProfile.js';
import NotificationsPage from './pages/NotificationsPage.js';
import Project from './pages/Project.js';
import MessagesPage from './pages/MessagesPage.js';
import ResourcesHome from './pages/ResourcesHome.js';
import NewResource from './pages/NewResource.js';
import ProjectPlan from './pages/ProjectPlan.js';
import { IntlProvider } from 'react-intl';
import { userStore } from './stores/UserStore.js';
import languages from './translations/index.js';
import ProjectActivities from './pages/ProjectActivities.js';
import SessionTimeoutHandler from './components/SessionTimeOut.js';
import NotLoggedPage from './pages/NotLoggedPage.js';


function Routing() {

 const {locale} = userStore();
  
  return (
    <>
      <IntlProvider locale={locale} messages={languages[locale]}>
   <SessionTimeoutHandler />
        <ToastContainer />
        
        <Routes>
      
          <Route path="/" element={<>
            <Home />
          </>} />
          <Route path="/login" element={<>
            <Login />
          </>} />
          <Route path="/home" element={<>
            <Home />
          </>} />
          <Route path="/home/:userId" element={<>
            <Home />
          </>} />
          <Route path="/project/:projectId" element={<>
            <Project />
          </>} />
          <Route path="/project/:projectId/activities" element={<>
            <ProjectActivities />
          </>} />
          <Route path="/forgot-password" element={<>
            <ForgetPassword />
          </>} />
          <Route path="/register" element={<>
            <Register />
          </>} />
          <Route path="/change-password" element={<>
            <ChangePassword />
          </>} />
          <Route path="/confirm-account" element={<>
            <ConfirmationAccount />
          </>} />
          <Route path="/new-project" element={<>
            <NewProject />
          </>} />
          <Route path="/resources" element={<>
            <ResourcesHome />
          </>} />
          <Route path="/new-resource" element={<>
            <NewResource />
          </>} />
          <Route path="/profile/:userId" element={<> <UserProfile /> </>} />
          <Route path="/notifications" element={<> <NotificationsPage /> </>} />
          <Route path="/messages/:userId" element={<> <MessagesPage /> </>} />
          <Route path="/project/:projectId/execution-plan" element={<> <ProjectPlan /> </>} />
          <Route path="/not-have-permission" element={<> <NotLoggedPage /> </>} />
        </Routes>
      </IntlProvider>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
