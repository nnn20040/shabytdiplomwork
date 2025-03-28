
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import RequireAuth from "./components/auth/RequireAuth";

// Pages
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
import AIAssistant from "./pages/AIChatPage";
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
import Forum from "./pages/Forum";
import ForumDetails from "./pages/ForumDetails";
import NewForumTopic from "./pages/NewForumTopic";
import Tests from "./pages/Tests";
import StudentProgress from "./pages/StudentProgress";
import QuestionDetails from "./pages/QuestionDetails";
import LessonView from "./pages/LessonView";
import StudentMessage from "./pages/StudentMessage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";

// Components
import AIAssistantComponent from "./components/ui/AIAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfUse />} />
              
              {/* Protected routes - requires authentication */}
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/student-dashboard" element={<RequireAuth><StudentDashboard /></RequireAuth>} />
              <Route path="/teacher-dashboard" element={<RequireAuth><TeacherDashboard /></RequireAuth>} />
              
              {/* Course routes - all protected */}
              <Route path="/course/:id" element={<RequireAuth><CourseDetails /></RequireAuth>} />
              <Route path="/course/:id/learn" element={<RequireAuth><CourseLearn /></RequireAuth>} />
              <Route path="/course/:courseId/lesson/:id" element={<RequireAuth><LessonView /></RequireAuth>} />
              <Route path="/course/:courseId/test/create" element={<RequireAuth><CreateTest /></RequireAuth>} />
              <Route path="/course/:courseId/test/:testId" element={<RequireAuth><TakeTest /></RequireAuth>} />
              <Route path="/course/:courseId/test/:testId/edit" element={<RequireAuth><EditTest /></RequireAuth>} />
              <Route path="/course/:courseId/test/:testId/results" element={<RequireAuth><TestResults /></RequireAuth>} />
              <Route path="/course/:courseId/lesson/create" element={<RequireAuth><CreateLesson /></RequireAuth>} />
              <Route path="/course/:courseId/lesson/:lessonId/edit" element={<RequireAuth><EditLesson /></RequireAuth>} />
              <Route path="/course/:courseId/manage" element={<RequireAuth><TeacherCourseManage /></RequireAuth>} />
              <Route path="/course/:courseId/analytics" element={<RequireAuth><CourseAnalytics /></RequireAuth>} />
              <Route path="/course/:courseId/discussions" element={<RequireAuth><CourseDiscussions /></RequireAuth>} />
              <Route path="/course/:courseId/discussions/:discussionId" element={<RequireAuth><DiscussionDetails /></RequireAuth>} />
              <Route path="/course/:courseId/discussions/create" element={<RequireAuth><CreateDiscussion /></RequireAuth>} />
              
              {/* Subject pages */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:subject" element={<SubjectPage />} />
              
              {/* User pages - all protected */}
              <Route path="/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
              <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
              <Route path="/ai-assistant" element={<RequireAuth><AIAssistant /></RequireAuth>} />
              
              {/* Forum pages */}
              <Route path="/forum" element={<RequireAuth><Forum /></RequireAuth>} />
              <Route path="/forum/:id" element={<RequireAuth><ForumDetails /></RequireAuth>} />
              <Route path="/forum/new" element={<RequireAuth><NewForumTopic /></RequireAuth>} />
              
              {/* Tests page */}
              <Route path="/tests" element={<RequireAuth><Tests /></RequireAuth>} />
              
              {/* Student progress and messaging */}
              <Route path="/student/:id/progress" element={<RequireAuth><StudentProgress /></RequireAuth>} />
              <Route path="/student/:id/message" element={<RequireAuth><StudentMessage /></RequireAuth>} />
              
              {/* Question details */}
              <Route path="/questions/:id" element={<RequireAuth><QuestionDetails /></RequireAuth>} />
              
              {/* Not found page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Global AI Assistant component */}
            <AIAssistantComponent />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
