import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'fabrikat', label: 'Fabrikat', icon: '🏭' },
    { id: 'produktet', label: 'Produktet', icon: '🔩' },
    { id: 'punetoret', label: 'Punëtorët', icon: '👷' },
    { id: 'klientet', label: 'Klientët', icon: '👥' },
    { id: 'porosite', label: 'Porositë', icon: '📋' },
    { id: 'stoku', label: 'Stoku', icon: '📦' },
    { id: 'pagesat', label: 'Pagesat', icon: '💳' },
    { id: 'faturat', label: 'Faturat', icon: '🧾' },
    { id: 'dergesat', label: 'Dërgesat', icon: '🚚' },
    { id: 'raportet', label: 'Raportet', icon: '📈' },
  ];

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <Container fluid>
        <BootstrapNavbar.Brand>
          <h3 className="mb-0">Plus Metal</h3>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto flex-wrap">
            {menuItems.map(item => (
              <Nav.Link
                key={item.id}
                active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                className={activeTab === item.id ? 'active' : ''}
              >
                <span className="me-2">{item.icon}</span>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;

