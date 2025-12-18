import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { orderAPI } from '../../../services/api';

const KlientiList = () => {
  const [klientet, setKlientet] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingKlienti, setEditingKlienti] = useState(null);
  const [formData, setFormData] = useState({ emri: '', email: '', telefoni: '', adresa: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadKlientet();
  }, []);

  const loadKlientet = async () => {
    try {
      const response = await orderAPI.getKlientet();
      setKlientet(response.data);
    } catch (error) {
      console.error('Error loading klientet:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingKlienti) {
        await orderAPI.updateKlienti(editingKlienti.id, formData);
      } else {
        await orderAPI.createKlienti(formData);
      }
      setShowModal(false);
      setEditingKlienti(null);
      setFormData({ emri: '', email: '', telefoni: '', adresa: '' });
      loadKlientet();
    } catch (error) {
      console.error('Error saving klienti:', error);
      setError('Gabim në ruajtjen e klientit');
    }
  };

  const handleEdit = (klienti) => {
    setEditingKlienti(klienti);
    setFormData({ emri: klienti.emri, email: klienti.email, telefoni: klienti.telefoni, adresa: klienti.adresa });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeni të sigurt që dëshironi të fshini këtë klient?')) {
      try {
        await orderAPI.deleteKlienti(id);
        loadKlientet();
      } catch (error) {
        console.error('Error deleting klienti:', error);
        alert('Gabim në fshirjen e klientit');
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingKlienti(null);
    setFormData({ emri: '', email: '', telefoni: '', adresa: '' });
    setError('');
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Klientët</h1>
        <Button variant="primary" onClick={() => { setEditingKlienti(null); setFormData({ emri: '', email: '', telefoni: '', adresa: '' }); setShowModal(true); }}>
          + Shto Klient
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Email</th>
            <th>Telefoni</th>
            <th>Adresa</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {klientet.map(klienti => (
            <tr key={klienti.id}>
              <td>{klienti.id}</td>
              <td>{klienti.emri}</td>
              <td>{klienti.email}</td>
              <td>{klienti.telefoni}</td>
              <td>{klienti.adresa}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(klienti)}>Ndrysho</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(klienti.id)}>Fshi</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingKlienti ? 'Ndrysho Klientin' : 'Shto Klient të Ri'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Emri</Form.Label>
              <Form.Control
                type="text"
                value={formData.emri}
                onChange={(e) => setFormData({ ...formData, emri: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefoni</Form.Label>
              <Form.Control
                type="text"
                value={formData.telefoni}
                onChange={(e) => setFormData({ ...formData, telefoni: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Adresa</Form.Label>
              <Form.Control
                type="text"
                value={formData.adresa}
                onChange={(e) => setFormData({ ...formData, adresa: e.target.value })}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>Anulo</Button>
              <Button variant="success" type="submit">Ruaj</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default KlientiList;
