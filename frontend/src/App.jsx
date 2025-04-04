import React from 'react';
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
import Assessment from './pages/Assessment';
import SurveyAdmin from './pages/SurveyAdmin';


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
    <>
      <UserProvider>
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route path='/'
              element={<ProtectedRoute>
                <Home />
              </ProtectedRoute>}
            />
            <Route path='/assessment'
              element={<ProtectedRoute>
                <ProjectProvider>
                  <Assessment />
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
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/register' element={<RegisterAndLogout />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  )
}

export default App
