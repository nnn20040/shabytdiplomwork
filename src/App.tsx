
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider as NextThemesProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';

import Index from './pages/Index';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Courses from './pages/Courses';
import Forum from './pages/Forum';
import ForumDetails from './pages/ForumDetails';
import NewForumTopic from './pages/NewForumTopic';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import CourseDetails from './pages/CourseDetails';
import CourseLearn from './pages/CourseLearn';
import LessonView from './pages/LessonView';
import TakeTest from './pages/TakeTest';
import TestResults from './pages/TestResults';
import CourseDiscussions from './pages/CourseDiscussions';
import DiscussionDetails from './pages/DiscussionDetails';
import CreateDiscussion from './pages/CreateDiscussion';
import StudentDashboard from './pages/StudentDashboard';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import QuestionDetails from './pages/QuestionDetails';
import StudentProgress from './pages/StudentProgress';
import StudentMessage from './pages/StudentMessage';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherCourseManage from './pages/TeacherCourseManage';
import CourseAnalytics from './pages/CourseAnalytics';
import CreateCourse from './pages/CreateCourse';
import CreateLesson from './pages/CreateLesson';
import EditLesson from './pages/EditLesson';
import CreateTest from './pages/CreateTest';
import EditTest from './pages/EditTest';
import SubjectPage from './pages/SubjectPage';
import RequireAuth from './components/auth/RequireAuth';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AIAssistant from '@/components/ui/AIAssistant';
import Students from './pages/Students';
import AIChatPage from './pages/AIChatPage';
import Tests from './pages/Tests';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const location = useLocation();

  useEffect(() => {
    // Track page view
    console.log('Page view:', location.pathname);
  }, [location]);
  
  return (
    <NextThemesProvider>
      <ThemeProvider>
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <div className="app">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/forum/:id" element={<ForumDetails />} />
                <Route path="/forum/new" element={<NewForumTopic />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/ai-assistant" element={<AIChatPage />} />
                <Route path="/tests" element={<Tests />} />
                
                {/* Course routes */}
                <Route path="/course/:courseId" element={<CourseDetails />} />
                <Route path="/course/:courseId/learn" element={<CourseLearn />} />
                <Route path="/course/:courseId/lessons/:lessonId" element={<LessonView />} />
                <Route path="/course/:courseId/tests/:testId" element={<TakeTest />} />
                <Route path="/course/:courseId/tests/:testId/results" element={<TestResults />} />
                <Route path="/course/:courseId/discussions" element={<CourseDiscussions />} />
                <Route path="/course/:courseId/discussions/:discussionId" element={<DiscussionDetails />} />
                <Route path="/course/:courseId/discussions/new" element={<CreateDiscussion />} />
                
                {/* Protected student routes */}
                <Route path="/dashboard" element={<RequireAuth><StudentDashboard /></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                <Route path="/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
                <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
                <Route path="/questions" element={<RequireAuth><QuestionDetails /></RequireAuth>} />
                <Route path="/student/progress" element={<RequireAuth><StudentProgress /></RequireAuth>} />
                <Route path="/student/message" element={<RequireAuth><StudentMessage /></RequireAuth>} />
                
                {/* Protected teacher routes */}
                <Route path="/teacher/dashboard" element={<RequireAuth><TeacherDashboard /></RequireAuth>} />
                <Route path="/teacher/courses" element={<RequireAuth><TeacherCourseManage /></RequireAuth>} />
                <Route path="/teacher/students" element={<RequireAuth><Students /></RequireAuth>} />
                <Route path="/course/:courseId/analytics" element={<RequireAuth><CourseAnalytics /></RequireAuth>} />
                <Route path="/course/:courseId/manage" element={<RequireAuth><TeacherCourseManage /></RequireAuth>} />
                <Route path="/create-course" element={<RequireAuth><CreateCourse /></RequireAuth>} />
                <Route path="/course/:courseId/create-lesson" element={<RequireAuth><CreateLesson /></RequireAuth>} />
                <Route path="/course/:courseId/edit-lesson/:lessonId" element={<RequireAuth><EditLesson /></RequireAuth>} />
                <Route path="/course/:courseId/create-test" element={<RequireAuth><CreateTest /></RequireAuth>} />
                <Route path="/course/:courseId/edit-test/:testId" element={<RequireAuth><EditTest /></RequireAuth>} />
                
                {/* Subject routes */}
                <Route path="/subject/:subjectId" element={<SubjectPage />} />
                
                {/* Redirect from old paths to new paths */}
                <Route path="/student-dashboard" element={<Navigate to="/dashboard" replace />} />
                <Route path="/teacher-dashboard" element={<Navigate to="/teacher/dashboard" replace />} />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <AIAssistant />
            </div>
          </QueryClientProvider>
        </LanguageProvider>
      </ThemeProvider>
    </NextThemesProvider>
  );
}

export default App;
