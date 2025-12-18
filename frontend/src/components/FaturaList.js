import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { financialAPI, orderAPI } from '../services/api';

const FaturaList = () => {
  const [faturat, setFaturat] = useState([]);
  const [porosite, setPorosite] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFatura, setEditingFatura] = useState(null);
  const [formData, setFormData] = useState({ porosiaId: '', data: '', statusi: 'E paguar' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [faturatRes, porositeRes] = await Promise.all([
        financialAPI.getFaturat(),
        orderAPI.getPorosite()
      ]);
      setFaturat(faturatRes.data);
      setPorosite(porositeRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingFatura) {
        await financialAPI.updateFatura(editingFatura.id, formData);
      } else {
        await financialAPI.createFatura(formData);
      }
      setShowModal(false);
      setEditingFatura(null);
      setFormData({ porosiaId: '', data: '', statusi: 'E paguar' });
      loadData();
    } catch (error) {
      console.error('Error saving fatura:', error);
      setError('Gabim në ruajtjen e faturës');
    }
  };

  const handleEdit = (fatura) => {
    setEditingFatura(fatura);
    setFormData({
      porosiaId: fatura.porosiaId,
      data: fatura.data,
      statusi: fatura.statusi
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeni të sigurt që dëshironi të fshini këtë faturë?')) {
      try {
        await financialAPI.deleteFatura(id);
        loadData();
      } catch (error) {
        console.error('Error deleting fatura:', error);
        alert('Gabim në fshirjen e faturës');
      }
    }
  };

  const getPorosiaInfo = (porosiaId) => {
    const porosia = porosite.find(p => p.id === porosiaId);
    return porosia ? `Porosia #${porosia.id}` : 'N/A';
  };

  const getStatusVariant = (statusi) => {
    switch (statusi) {
      case 'E paguar':
        return 'success';
      case 'E papaguar':
        return 'warning';
      case 'E vonuar':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingFatura(null);
    setFormData({ porosiaId: '', data: '', statusi: 'E paguar' });
    setError('');
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Faturat</h1>
        <Button variant="primary" onClick={() => { setEditingFatura(null); setFormData({ porosiaId: '', data: '', statusi: 'E paguar' }); setShowModal(true); }}>
          + Shto Faturë
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Numri</th>
            <th>Porosia</th>
            <th>Data</th>
            <th>Totali</th>
            <th>Statusi</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {faturat.map(fatura => (
            <tr key={fatura.id}>
              <td>{fatura.id}</td>
              <td>{fatura.numri}</td>
              <td>{getPorosiaInfo(fatura.porosiaId)}</td>
              <td>{fatura.data}</td>
              <td>{fatura.totali} ALL</td>
              <td>
                <Badge bg={getStatusVariant(fatura.statusi)}>{fatura.statusi}</Badge>
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(fatura)}>Ndrysho</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(fatura.id)}>Fshi</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingFatura ? 'Ndrysho Faturën' : 'Shto Faturë të Re'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Porosia</Form.Label>
              <Form.Select
                value={formData.porosiaId}
                onChange={(e) => setFormData({ ...formData, porosiaId: parseInt(e.target.value) })}
                required
              >
                <option value="">Zgjidh Porosinë</option>
                {porosite.map(porosia => (
                  <option key={porosia.id} value={porosia.id}>Porosia #{porosia.id} - {porosia.totali} ALL</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Statusi</Form.Label>
              <Form.Select
                value={formData.statusi}
                onChange={(e) => setFormData({ ...formData, statusi: e.target.value })}
                required
              >
                <option value="E paguar">E paguar</option>
                <option value="E papaguar">E papaguar</option>
                <option value="E vonuar">E vonuar</option>
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

export default FaturaList;
