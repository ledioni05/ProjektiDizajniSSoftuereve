import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { deliveryAPI, orderAPI } from '../services/api';

const DergesaList = () => {
  const [dergesat, setDergesat] = useState([]);
  const [porosite, setPorosite] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDergesa, setEditingDergesa] = useState(null);
  const [formData, setFormData] = useState({ porosiaId: '', dataDergeses: '', statusi: 'Në përgatitje', adresa: '', transportuesi: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dergesatRes, porositeRes] = await Promise.all([
        deliveryAPI.getDergesat(),
        orderAPI.getPorosite()
      ]);
      setDergesat(dergesatRes.data);
      setPorosite(porositeRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingDergesa) {
        await deliveryAPI.updateDergesa(editingDergesa.id, formData);
      } else {
        await deliveryAPI.createDergesa(formData);
      }
      setShowModal(false);
      setEditingDergesa(null);
      setFormData({ porosiaId: '', dataDergeses: '', statusi: 'Në përgatitje', adresa: '', transportuesi: '' });
      loadData();
    } catch (error) {
      console.error('Error saving dergesa:', error);
      setError('Gabim në ruajtjen e dërgesës');
    }
  };

  const handleEdit = (dergesa) => {
    setEditingDergesa(dergesa);
    setFormData({
      porosiaId: dergesa.porosiaId,
      dataDergeses: dergesa.dataDergeses,
      statusi: dergesa.statusi,
      adresa: dergesa.adresa,
      transportuesi: dergesa.transportuesi
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeni të sigurt që dëshironi të fshini këtë dërgesë?')) {
      try {
        await deliveryAPI.deleteDergesa(id);
        loadData();
      } catch (error) {
        console.error('Error deleting dergesa:', error);
        alert('Gabim në fshirjen e dërgesës');
      }
    }
  };

  const handleStatusUpdate = async (id, statusi) => {
    try {
      await deliveryAPI.updateStatus(id, statusi);
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gabim në përditësimin e statusit');
    }
  };

  const getPorosiaInfo = (porosiaId) => {
    const porosia = porosite.find(p => p.id === porosiaId);
    return porosia ? `Porosia #${porosia.id}` : 'N/A';
  };

  const getStatusVariant = (statusi) => {
    switch (statusi) {
      case 'E dërguar':
        return 'success';
      case 'Në rrugë':
        return 'warning';
      case 'Në përgatitje':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingDergesa(null);
    setFormData({ porosiaId: '', dataDergeses: '', statusi: 'Në përgatitje', adresa: '', transportuesi: '' });
    setError('');
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dërgesat</h1>
        <Button variant="primary" onClick={() => { setEditingDergesa(null); setFormData({ porosiaId: '', dataDergeses: '', statusi: 'Në përgatitje', adresa: '', transportuesi: '' }); setShowModal(true); }}>
          + Shto Dërgesë
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Porosia</th>
            <th>Data Dërgesës</th>
            <th>Statusi</th>
            <th>Adresa</th>
            <th>Transportuesi</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {dergesat.map(dergesa => (
            <tr key={dergesa.id}>
              <td>{dergesa.id}</td>
              <td>{getPorosiaInfo(dergesa.porosiaId)}</td>
              <td>{dergesa.dataDergeses}</td>
              <td>
                <Badge bg={getStatusVariant(dergesa.statusi)}>{dergesa.statusi}</Badge>
              </td>
              <td>{dergesa.adresa}</td>
              <td>{dergesa.transportuesi}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(dergesa)}>Ndrysho</Button>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleStatusUpdate(dergesa.id, 'E dërguar')}>Shëno si Dërguar</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(dergesa.id)}>Fshi</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingDergesa ? 'Ndrysho Dërgesën' : 'Shto Dërgesë të Re'}</Modal.Title>
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
                  <option key={porosia.id} value={porosia.id}>Porosia #{porosia.id}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data Dërgesës</Form.Label>
              <Form.Control
                type="date"
                value={formData.dataDergeses}
                onChange={(e) => setFormData({ ...formData, dataDergeses: e.target.value })}
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
                <option value="Në përgatitje">Në përgatitje</option>
                <option value="Në rrugë">Në rrugë</option>
                <option value="E dërguar">E dërguar</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Adresa</Form.Label>
              <Form.Control
                type="text"
                value={formData.adresa}
                onChange={(e) => setFormData({ ...formData, adresa: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Transportuesi</Form.Label>
              <Form.Control
                type="text"
                value={formData.transportuesi}
                onChange={(e) => setFormData({ ...formData, transportuesi: e.target.value })}
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

export default DergesaList;
