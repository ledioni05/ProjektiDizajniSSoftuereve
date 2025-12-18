import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { factoryAPI } from '../services/api';

const FabrikaList = () => {
  const [fabrikat, setFabrikat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFabrika, setEditingFabrika] = useState(null);
  const [formData, setFormData] = useState({ emri: '', adresa: '', kapaciteti: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    loadFabrikat();
  }, []);

  const loadFabrikat = async () => {
    try {
      const response = await factoryAPI.getFabrikat();
      setFabrikat(response.data);
    } catch (error) {
      console.error('Error loading fabrikat:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingFabrika) {
        await factoryAPI.updateFabrika(editingFabrika.id, formData);
      } else {
        await factoryAPI.createFabrika(formData);
      }
      setShowModal(false);
      setEditingFabrika(null);
      setFormData({ emri: '', adresa: '', kapaciteti: 0 });
      loadFabrikat();
    } catch (error) {
      console.error('Error saving fabrika:', error);
      setError('Gabim në ruajtjen e fabrikës');
    }
  };

  const handleEdit = (fabrika) => {
    setEditingFabrika(fabrika);
    setFormData({ emri: fabrika.emri, adresa: fabrika.adresa, kapaciteti: fabrika.kapaciteti });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeni të sigurt që dëshironi të fshini këtë fabrikë?')) {
      try {
        await factoryAPI.deleteFabrika(id);
        loadFabrikat();
      } catch (error) {
        console.error('Error deleting fabrika:', error);
        alert('Gabim në fshirjen e fabrikës');
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingFabrika(null);
    setFormData({ emri: '', adresa: '', kapaciteti: 0 });
    setError('');
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Fabrikat</h1>
        <Button variant="primary" onClick={() => { setEditingFabrika(null); setFormData({ emri: '', adresa: '', kapaciteti: 0 }); setShowModal(true); }}>
          + Shto Fabrikë
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Adresa</th>
            <th>Kapaciteti</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {fabrikat.map(fabrika => (
            <tr key={fabrika.id}>
              <td>{fabrika.id}</td>
              <td>{fabrika.emri}</td>
              <td>{fabrika.adresa}</td>
              <td>{fabrika.kapaciteti}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(fabrika)}>Ndrysho</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(fabrika.id)}>Fshi</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingFabrika ? 'Ndrysho Fabrikën' : 'Shto Fabrikë të Re'}</Modal.Title>
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
              <Form.Label>Adresa</Form.Label>
              <Form.Control
                type="text"
                value={formData.adresa}
                onChange={(e) => setFormData({ ...formData, adresa: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kapaciteti</Form.Label>
              <Form.Control
                type="number"
                value={formData.kapaciteti}
                onChange={(e) => setFormData({ ...formData, kapaciteti: parseInt(e.target.value) })}
                required
                min="0"
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

export default FabrikaList;

