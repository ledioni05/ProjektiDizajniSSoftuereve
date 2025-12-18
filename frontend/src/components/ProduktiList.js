import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { factoryAPI } from '../../../services/api';

const ProduktiList = () => {
  const [produktet, setProduktet] = useState([]);
  const [fabrikat, setFabrikat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProdukt, setEditingProdukt] = useState(null);
  const [formData, setFormData] = useState({ emri: '', tipi: '', cmimi: 0, fabrikaId: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [produktetRes, fabrikatRes] = await Promise.all([
        factoryAPI.getProduktet(),
        factoryAPI.getFabrikat()
      ]);
      setProduktet(produktetRes.data);
      setFabrikat(fabrikatRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingProdukt) {
        await factoryAPI.updateProdukt(editingProdukt.id, formData);
      } else {
        await factoryAPI.createProdukt(formData);
      }
      setShowModal(false);
      setEditingProdukt(null);
      setFormData({ emri: '', tipi: '', cmimi: 0, fabrikaId: '' });
      loadData();
    } catch (error) {
      console.error('Error saving produkt:', error);
      setError('Gabim në ruajtjen e produktit');
    }
  };

  const handleEdit = (produkt) => {
    setEditingProdukt(produkt);
    setFormData({ emri: produkt.emri, tipi: produkt.tipi, cmimi: produkt.cmimi, fabrikaId: produkt.fabrikaId });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeni të sigurt që dëshironi të fshini këtë produkt?')) {
      try {
        await factoryAPI.deleteProdukt(id);
        loadData();
      } catch (error) {
        console.error('Error deleting produkt:', error);
        alert('Gabim në fshirjen e produktit');
      }
    }
  };

  const getFabrikaName = (fabrikaId) => {
    const fabrika = fabrikat.find(f => f.id === fabrikaId);
    return fabrika ? fabrika.emri : 'N/A';
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingProdukt(null);
    setFormData({ emri: '', tipi: '', cmimi: 0, fabrikaId: '' });
    setError('');
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Produktet</h1>
        <Button variant="primary" onClick={() => { setEditingProdukt(null); setFormData({ emri: '', tipi: '', cmimi: 0, fabrikaId: '' }); setShowModal(true); }}>
          + Shto Produkt
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Tipi</th>
            <th>Çmimi</th>
            <th>Fabrika</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {produktet.map(produkt => (
            <tr key={produkt.id}>
              <td>{produkt.id}</td>
              <td>{produkt.emri}</td>
              <td>{produkt.tipi}</td>
              <td>{produkt.cmimi} ALL</td>
              <td>{getFabrikaName(produkt.fabrikaId)}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(produkt)}>Ndrysho</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(produkt.id)}>Fshi</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingProdukt ? 'Ndrysho Produktin' : 'Shto Produkt të Ri'}</Modal.Title>
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
              <Form.Label>Tipi</Form.Label>
              <Form.Control
                type="text"
                value={formData.tipi}
                onChange={(e) => setFormData({ ...formData, tipi: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Çmimi</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.cmimi}
                onChange={(e) => setFormData({ ...formData, cmimi: parseFloat(e.target.value) })}
                required
                min="0"
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

export default ProduktiList;

