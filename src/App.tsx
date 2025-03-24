
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import CourseDetails from "./pages/CourseDetails";
import CourseLearn from "./pages/CourseLearn";
import Courses from "./pages/Courses";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import AIAssistant from "./components/ui/AIAssistant";
import AIChatPage from "./pages/AIChatPage";
import CreateTest from "./pages/CreateTest";
import TakeTest from "./pages/TakeTest";
import TeacherCourseManage from "./pages/TeacherCourseManage";
import CreateLesson from "./pages/CreateLesson";
import EditLesson from "./pages/EditLesson";
import EditTest from "./pages/EditTest";
import TestResults from "./pages/TestResults";
import CourseDiscussions from "./pages/CourseDiscussions";
import DiscussionDetails from "./pages/DiscussionDetails";
import CreateDiscussion from "./pages/CreateDiscussion";
import CourseAnalytics from "./pages/CourseAnalytics";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SubjectPage from "./pages/SubjectPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          
          {/* Course routes */}
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/course/:id/learn" element={<CourseLearn />} />
          <Route path="/course/:courseId/test/create" element={<CreateTest />} />
          <Route path="/course/:courseId/test/:testId" element={<TakeTest />} />
          <Route path="/course/:courseId/test/:testId/edit" element={<EditTest />} />
          <Route path="/course/:courseId/test/:testId/results" element={<TestResults />} />
          <Route path="/course/:courseId/lesson/create" element={<CreateLesson />} />
          <Route path="/course/:courseId/lesson/:lessonId/edit" element={<EditLesson />} />
          <Route path="/course/:courseId/manage" element={<TeacherCourseManage />} />
          <Route path="/course/:courseId/analytics" element={<CourseAnalytics />} />
          <Route path="/course/:courseId/discussions" element={<CourseDiscussions />} />
          <Route path="/course/:courseId/discussions/:discussionId" element={<DiscussionDetails />} />
          <Route path="/course/:courseId/discussions/create" element={<CreateDiscussion />} />
          
          {/* Subject pages */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:subject" element={<SubjectPage />} />
          
          {/* User pages */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/ai-assistant" element={<AIChatPage />} />
          
          {/* Static pages */}
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          
          {/* Catch-all route - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIAssistant />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
