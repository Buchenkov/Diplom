
// src/components/Layout.js
import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleAuthButtonClick = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Логотип</Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link onClick={handleAuthButtonClick}>
              {isAuthenticated ? 'Выход' : 'Авторизация'}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-4">
        {children}
      </Container>
      <footer className="bg-dark text-white text-center mt-auto py-3">
        <Container>
          <p>Футер</p>
        </Container>
      </footer>
    </>
  );
};

export default Layout;
