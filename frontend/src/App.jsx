import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import SurveyTools from './pages/SurveyTools';
import ScaleTools from './pages/ScaleTools';
import Navbar from './components/Navbar';
import { UserProvider } from './contexts/UserContext';
import { ProjectProvider } from './contexts/ProjectContext';
import SurveyAdmin from './pages/SurveyAdmin';
import Projects from './pages/Projects';
import Assessment from './pages/Assessment';
import Report from './pages/Report';

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
        <Navbar />
        <Routes>
          <Route path='/'
            element={
              <Home />
            }
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
          <Route path='/report/:id'
            element={<ProtectedRoute>
              <ProjectProvider>
                <Report />
              </ProjectProvider>
            </ProtectedRoute>}
          />
          <Route path='/surveytools'
            element={<ProtectedRoute>
              <SurveyTools />
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
          <Route path='/projects'
            element={<ProtectedRoute>
              <ProjectProvider>
                <Projects />
              </ProjectProvider>
            </ProtectedRoute>}
          />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/register' element={<RegisterAndLogout />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App
