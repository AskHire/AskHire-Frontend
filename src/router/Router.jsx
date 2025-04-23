import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Login from "../pages/Login/Login";
import Signup from "../pages/signup/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import AboutUs from "../pages/about us/AboutUs";
import Interview from "../pages/interview/Interview";
import Job from "../pages/jobs/Job";
import Manager from "../layout/Manager";
import ManagerDashboard from "../pages/Manager/ManagerDashboard";
import ManageQuestions from "../pages/Manager/ManageQuestions";
import SetupVacancy from "../pages/Manager/SetupVacancy";
import ManageVacancy from "../pages/Manager/ManageVacancy";
import LongList from "../pages/Manager/LongList";
import ViewDetails from "../pages/Manager/ViewDetails";
import NotifyCandidates from "../pages/Manager/NotifyCandidates";
import AutomatedInterviews from "../pages/Manager/AutomatedInterviews";
import ManualInterviews from "../pages/Manager/ManualInterviews";
import CreateQuestions from "../pages/Manager/CreateQuestions";
import Admin from "../layout/Admin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import CreateJobs from "../pages/Admin/CreateJobs";
import ManageAdmin from "../pages/Admin/ManageAdmin";
import UserRoles from "../pages/Admin/UserRoles";
import ManageManager from "../pages/Admin/ManageManager";
import ManageCandidate from "../pages/Admin/ManageCandidate";
import SystemNotification from "../pages/Admin/SystemNotification";
import LongListInterviewScheduler from "../pages/Manager/LongListInterviewSheduler";
import View_LongList from "../pages/Manager/View_LongList";
import InterviewScheduler from "../pages/Manager/InterviewScheduler";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "aboutus",
        element: <AboutUs />,
      },
     
    ],
  },
  {
    path: "/manager",
    element: <Manager />,
    children: [
      {
        path: "",
        element: <ManagerDashboard />,
      },
      {
        path: "dashboard",
        element: <ManagerDashboard />,
      },
      {
        path: "CreateQuestions",
        element: <CreateQuestions />,
      },
      {
        path: "ManageQuestions",
        element: <ManageQuestions />,
      },
      {
        path: "SetupVacancy",
        element: <SetupVacancy />,
      },
      {
        path: "ManageVacancy",
        element: <ManageVacancy />,
      },
      {
        path: "LongList",
        element: <LongList />,
       
      },
      {
        path: "View_LongList",
        element: <View_LongList />,
       
      },
      {
        path: "ViewDetails/:id",
        element: <ViewDetails />,
      },
      {
        path: "NotifyCandidates",
        element: <NotifyCandidates />,
      },
      {
        path: "LongListInterviewSheduler",
        element: <LongListInterviewScheduler />,
       
      },
      {
        path: "InterviewScheduler/:applicationId",
        element: <InterviewScheduler/>,
       
      },
      {
        path: "AutomatedInterviews",
        element: <AutomatedInterviews />,
      },
      {
        path: "ManualInterviews",
        element: <ManualInterviews />,
      },
    ],
  },
  {
    path:"/admin",
    element:<Admin/>,
    children:[
      {
        path:"",
        element:<AdminDashboard/>
      },
      {
        path:"dashboard",
        element:<AdminDashboard/>
      },
      {
        path:"CreateJobs",
        element:<CreateJobs/>
      },
      {
        path:"ManageUserRoles",
        element:<UserRoles/>
      },
      {
        path:"ManageAdmin",
        element:<ManageAdmin/>
      },
      {
        path:"ManageManager",
        element:<ManageManager/>
      },
      {
        path:"ManageCandidate",
        element:<ManageCandidate/>
      },
      {
        path:"SystemNotification",
        element:<SystemNotification/>
      }
    ],
  },

    {
      path:"/candidate",
      element:<Candidate/>,
      children:[
        {
          path: "",
          element: <Dashboard/>
        },
        {
          path: "jobs",
          element: <Job/>
        },
        {
          path: "interview",
          element: <Interview/>
        },
        {
          path: "prescreen",
          element: <Prescreen/>,
        },
        {
          path: "TextAssessment",
          element: <TextAssessment/>,
        },
        {
          path: "VoiceAssessment",
          element: <VoiceAssessment/>
        },
      ]
    }
  
]);

export default router;
