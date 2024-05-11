import React, { useEffect, useState } from 'react';
import NavBar from './components/Navbar/NavBar';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import NotesPage from './pages/NotesPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import Register from './components/Modal/Register';
import Login from './components/Modal/Login';
import { User } from './types';
import styles from './styles/App.module.css';
import * as NotesApi from './api';

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await NotesApi.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <div>
      <NavBar
        loggedInUser={loggedInUser}
        onLoginClicked={() => setShowLoginModal(true)}
        onSignUpClicked={() => setShowSignUpModal(true)}
        onLogoutSuccessful={() => setLoggedInUser(null)}
      />
      <Container className={styles.pageContainer}>
        <Routes>
          <Route path='/' element={<NotesPage loggedInUser={loggedInUser} />} />
          <Route path='/privacy' element={<PrivacyPage />} />
          <Route path='/*' element={<NotFoundPage />} />
        </Routes>
      </Container>
      {showSignUpModal && (
        <Register
          onDismiss={() => setShowSignUpModal(false)}
          onSignUpSuccessful={(user) => {
            setLoggedInUser(user);
            setShowSignUpModal(false);
          }}
        />
      )}
      {showLoginModal && (
        <Login
          onDismiss={() => setShowLoginModal(false)}
          onLoginSuccessful={(user) => {
            setLoggedInUser(user);
            setShowLoginModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
