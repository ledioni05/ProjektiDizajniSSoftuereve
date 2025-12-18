import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { factoryAPI } from '../services/api';

const PunetoretList = () => {
  const [punetoret, setPunetoret] = useState([]);
  const [fabrikat, setFabrikat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPunetori, setEditingPunetori] = useState(null);
  const [formData, setFormData] = useState({ emri: '', pozicioni: '', fabrikaId: '', paga: 0, dataPunesimit: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [punetoretRes, fabrikatRes] = await Promise.all([
        factoryAPI.getPunetoret(),
        factoryAPI.getFabrikat()
      ]);
      setPunetoret(punetoretRes.data);
      setFabrikat(fabrikatRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingPunetori) {
        await factoryAPI.updatePunetori(editingPunetori.id, formData);
      } else {
        await factoryAPI.createPunetori(formData);
      }
      setShowModal(false);
      setEditingPunetori(null);
      setFormData({ emri: '', pozicioni: '', fabrikaId: '', paga: 0, dataPunesimit: '' });
      loadData();
    } catch (error) {
      console.error('Error saving punetori:', error);
      setError('Gabim në ruajtjen e punëtorit');
    }
  };

  const handleEdit = (punetori) => {
    setEditingPunetori(punetori);
    setFormData({
      emri: punetori.emri,
      pozicioni: punetori.pozicioni,
      fabrikaId: punetori.fabrikaId,
      paga: punetori.paga,
      dataPunesimit: punetori.dataPunesimit
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeni të sigurt që dëshironi të fshini këtë punëtor?')) {
      try {
        await factoryAPI.deletePunetori(id);
        loadData();
      } catch (error) {
        console.error('Error deleting punetori:', error);
        alert('Gabim në fshirjen e punëtorit');
      }
    }
  };

  const getFabrikaName = (fabrikaId) => {
    const fabrika = fabrikat.find(f => f.id === fabrikaId);
    return fabrika ? fabrika.emri : 'N/A';
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingPunetori(null);
    setFormData({ emri: '', pozicioni: '', fabrikaId: '', paga: 0, dataPunesimit: '' });
    setError('');
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Punëtorët</h1>
        <Button variant="primary" onClick={() => { setEditingPunetori(null); setFormData({ emri: '', pozicioni: '', fabrikaId: '', paga: 0, dataPunesimit: '' }); setShowModal(true); }}>
          + Shto Punëtor
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Pozicioni</th>
            <th>Fabrika</th>
            <th>Paga</th>
            <th>Data Punesimit</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {punetoret.map(punetori => (
            <tr key={punetori.id}>
              <td>{punetori.id}</td>
              <td>{punetori.emri}</td>
              <td>{punetori.pozicioni}</td>
              <td>{getFabrikaName(punetori.fabrikaId)}</td>
              <td>{punetori.paga} ALL</td>
              <td>{punetori.dataPunesimit}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(punetori)}>Ndrysho</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(punetori.id)}>Fshi</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingPunetori ? 'Ndrysho Punëtorin' : 'Shto Punëtor të Ri'}</Modal.Title>
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
              <Form.Label>Pozicioni</Form.Label>
              <Form.Control
                type="text"
                value={formData.pozicioni}
                onChange={(e) => setFormData({ ...formData, pozicioni: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fabrika</Form.Label>
              <Form.Select
                value={formData.fabrikaId}
                onChange={(e) => setFormData({ ...formData, fabrikaId: parseInt(e.target.value) })}
                required
              >
                <option value="">Zgjidh Fabrikën</option>
                {fabrikat.map(fabrika => (
                  <option key={fabrika.id} value={fabrika.id}>{fabrika.emri}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Paga</Form.Label>
              <Form.Control
                type="number"
                value={formData.paga}
                onChange={(e) => setFormData({ ...formData, paga: parseInt(e.target.value) })}
                required
                min="0"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data Punesimit</Form.Label>
              <Form.Control
                type="date"
                value={formData.dataPunesimit}
                onChange={(e) => setFormData({ ...formData, dataPunesimit: e.target.value })}
                required
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

export default PunetoretList;
