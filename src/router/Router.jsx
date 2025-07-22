import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "../context/PrivateRoute";

// Layouts
import Main from "../layout/Main";
import Manager from "../layout/Manager";
import Admin from "../layout/Admin";
import Candidate from "../layout/Candidate";

// Common Pages
import Home from "../pages/Common/Home";
import Login from "../pages/Common/Login";
import SignUp from "../pages/Common/Signup";
import AboutUs from "../pages/Common/AboutUs";
import Job from "../pages/Common/Job";
import JobShow from "../pages/Candidate/JobShow";
import Unauthorized from "../pages/Common/Unauthorized";
import EmailVerificationStatus from "../pages/Common/EmailVerificationStatus";
import ForgotPasswordRequest from "../pages/Common/ForgotPasswordRequest";
import ResetPassword from "../pages/Common/ResetPassword";

// Manager Pages
import ManagerDashboard from "../pages/Manager/ManagerDashboard";
import CreateQuestions from "../pages/Manager/CreateQuestions";
import ManageQuestions from "../pages/Manager/ManageQuestions";
import SetupVacancy from "../pages/Manager/SetupVacancy";
import ManageVacancy from "../pages/Manager/ManageVacancy";
import LongList from "../pages/Manager/LongList";
import View_LongList from "../pages/Manager/View_LongList";
import ViewDetails from "../pages/Manager/ViewDetails";
import NotifyCandidates from "../pages/Manager/NotifyCandidates";
import InterviewScheduler from "../pages/Manager/InterviewScheduler";
import LongListInterviewScheduler from "../pages/Manager/LongListInterviewSheduler";
import AutomatedInterviews from "../pages/Manager/AutomatedInterviews";
import ManualInterviews from "../pages/Manager/ManualInterviews";
import ManagerApplication from "../pages/Manager/ManagerApplication";

// Admin Pages
import AdminDashboard from "../pages/Admin/AdminDashboard";
import CreateJobs from "../pages/Admin/CreateJobs";
import ManageAdmin from "../pages/Admin/ManageAdmin";
import UserRoles from "../pages/Admin/UserRoles";
import ManageManager from "../pages/Admin/ManageManager";
import ManageCandidate from "../pages/Admin/ManageCandidate";
import SystemNotification from "../pages/Admin/SystemNotification";

// Candidate Pages
import CandidateDashboard from "../pages/Candidate/CandidateDashboard";
import Prescreen from "../pages/Candidate/Prescreen";
import TextAssessment from "../pages/Candidate/TextAssessment";
import VoiceAssessment from "../pages/Candidate/VoiceAssessment";
import Interview from "../pages/Candidate/Interview";
import CVUpload from "../pages/Candidate/CVUpload";
import CongratulationsCard2 from "../components/CandidateComponants/CongratulationCard2";

import SupportHelpPage from "../pages/Common/SupportHelpPage";


const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: (
      <AuthProvider>
        <Main />
      </AuthProvider>
    ),
    children: [
      { path: "", element: <Home /> },
      { path: "aboutus", element: <AboutUs /> },
      { path: "jobs", element: <Job /> },
      { path: "job/:id", element: <JobShow /> },
    ],
  },

  // Manager Routes
  {
    path: "/manager",
    element: (
      <AuthProvider>
        <PrivateRoute roleRequired="Manager">
          <Manager />
        </PrivateRoute>
      </AuthProvider>
    ),
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
        element: <InterviewScheduler />,
      },
      {
        path: "AutomatedInterviews",
        element: <AutomatedInterviews />,
      },
      {
        path: "ManualInterviews",
        element: <ManualInterviews />,
      },
      {
        path: "Support",
        element: <SupportHelpPage/>
      },
      {
        path: "ManagerApplication",
        element: <ManagerApplication />
      },

    ],
  },

  // Admin Routes
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <PrivateRoute roleRequired="Admin">
          <Admin />
        </PrivateRoute>
      </AuthProvider>
    ),
    children: [

      {
        path: "",
        element: <AdminDashboard />
      },
      {
        path: "dashboard",
        element: <AdminDashboard />
      },
      {
        path: "CreateJobs",
        element: <CreateJobs />
      },
      {
        path: "ManageUserRoles",
        element: <UserRoles />
      },
      {
        path: "ManageAdmin",
        element: <ManageAdmin />
      },
      {
        path: "ManageManager",
        element: <ManageManager />
      },
      {
        path: "ManageCandidate",
        element: <ManageCandidate />
      },
      {
        path: "SystemNotification",
        element: <SystemNotification />
      },
      {
        path: "Support",
        element: <SupportHelpPage/>
      }
    ]

  },

  // Candidate Routes
  {
    path: "/candidate",
    element: (
      <AuthProvider>
        <PrivateRoute roleRequired="Candidate">
          <Candidate />
        </PrivateRoute>
      </AuthProvider>
    ),
    children: [
      { path: "", element: <CandidateDashboard /> },
      { path: "interview", element: <Interview /> },
      { path: "prescreen", element: <Prescreen /> },
      { path: "TextAssessment/:applicationId", element: <TextAssessment /> },
      { path: "VoiceAssessment/:applicationId", element: <VoiceAssessment /> },
      { path: "CVupload/:id", element: <CVUpload /> },
      { path: "congratulations/:applicationId", element: <CongratulationsCard2 /> },
    ],
  },

  // Auth and Utility Pages
  {
    path: "/unauthorized",
    element: (
      <AuthProvider>
        <Unauthorized />
      </AuthProvider>
    ),
  },
  {
    path: "login",
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
  },
  {
    path: "signup",
    element: (
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    ),
  },

  // Email Verification & Password Reset Routes
  {
    path: "verify-email-status",
    element: <EmailVerificationStatus />,
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordRequest />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  },
]);

export default router;
