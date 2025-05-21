import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './styles/global.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import SurveyTools from './pages/SurveyTools';
import ProjectsAdmin from './pages/ProjectsAdmin';
import ProjectsAdminDetail from './pages/ProjectsAdminDetail';
import ScaleTools from './pages/ScaleTools';
import Navbar from './components/Navbar';
import ToolBarAdmin from './components/ToolBarAdmin';
import { UserProvider } from './contexts/UserContext';
import { ProjectProvider } from './contexts/ProjectContext';
import SurveyAdmin from './pages/SurveyAdmin';
import Projects from './pages/Projects';
import Assessment from './pages/Assessment';
import Report from './pages/Report';
import RequestsAdmin from './pages/RequestsAdmin';
import Footer from './components/Footer';
import Reports from './pages/Reports';

const Logout = () => {
  localStorage.clear();
  return <Navigate to='/login' />;
};

const RegisterAndLogout = () => {
  localStorage.clear();
  return <Register />;
}


function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <div id="root">
          <Navbar />
          <ToolBarAdmin />
          <div className="main-content">
            <Routes>
              <Route path='/'
                element={
                  <Home />
                }
              />
              <Route path='/projects'
                element={<ProtectedRoute>
                  <ProjectProvider>
                    <Projects />
                  </ProjectProvider>
                </ProtectedRoute>}
              />
              <Route path='/assessment/' element={
                <ProtectedRoute>
                  <ProjectProvider>
                    <Assessment />
                  </ProjectProvider>
                </ProtectedRoute>
              } />
              <Route path='/assessment/:id'
                element={<ProtectedRoute>
                  <ProjectProvider>
                    <Assessment />
                  </ProjectProvider>
                </ProtectedRoute>}
              />
              <Route path='/report/:token'
                element={<ProtectedRoute>
                  <ProjectProvider>
                    <Report />
                  </ProjectProvider>
                </ProtectedRoute>}
              />
              <Route path='/reports/'
                element={<ProtectedRoute>
                  <ProjectProvider>
                    <Reports />
                  </ProjectProvider>
                </ProtectedRoute>}
              />
              <Route path='/surveytools'
                element={<ProtectedRoute>
                  <SurveyTools />
                </ProtectedRoute>}
              />
              <Route path='/projectsadmin'
                element={<ProtectedRoute>
                  <ProjectProvider>
                    <ProjectsAdmin />
                  </ProjectProvider>
                </ProtectedRoute>}
              />
              <Route path='/projectsadmin/:id'
                element={<ProtectedRoute>
                  <ProjectProvider>
                    <ProjectsAdminDetail />
                  </ProjectProvider>
                </ProtectedRoute>}
              />
               <Route path='/adminrequests'
                element={<ProtectedRoute>
                  <ProjectProvider>
                    <RequestsAdmin />
                  </ProjectProvider>
                </ProtectedRoute>}
              />
              <Route path='/surveyadmin/:id'
                element={<ProtectedRoute>
                  <SurveyAdmin />
                </ProtectedRoute>}
              />
              <Route path='/scaletools'
                element={<ProtectedRoute>
                  <ScaleTools />
                </ProtectedRoute>}
              />
              <Route path='/login' element={<Login />} />
              <Route path='/logout' element={<Logout />} />
              <Route path='/register' element={<RegisterAndLogout />} />
              <Route path='/forgotpassword' element={<ForgotPassword />} />
              <Route path='/resetpassword/:token' element={<ResetPassword />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App
