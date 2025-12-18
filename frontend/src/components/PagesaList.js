import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { financialAPI, orderAPI } from '../services/api';

const PagesaList = () => {
  const [pagesat, setPagesat] = useState([]);
  const [porosite, setPorosite] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPagesa, setEditingPagesa] = useState(null);
  const [formData, setFormData] = useState({ porosiaId: '', shuma: 0, metoda: 'Kartë', dataPageses: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pagesatRes, porositeRes] = await Promise.all([
        financialAPI.getPagesat(),
        orderAPI.getPorosite()
      ]);
      setPagesat(pagesatRes.data);
      setPorosite(porositeRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingPagesa) {
        await financialAPI.updatePagesa(editingPagesa.id, formData);
      } else {
        await financialAPI.createPagesa(formData);
      }
      setShowModal(false);
      setEditingPagesa(null);
      setFormData({ porosiaId: '', shuma: 0, metoda: 'Kartë', dataPageses: '' });
      loadData();
    } catch (error) {
      console.error('Error saving pagesa:', error);
      setError('Gabim në ruajtjen e pagesës');
    }
  };

  const handleEdit = (pagesa) => {
    setEditingPagesa(pagesa);
    setFormData({
      porosiaId: pagesa.porosiaId,
      shuma: pagesa.shuma,
      metoda: pagesa.metoda,
      dataPageses: pagesa.dataPageses
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeni të sigurt që dëshironi të fshini këtë pagesë?')) {
      try {
        await financialAPI.deletePagesa(id);
        loadData();
      } catch (error) {
        console.error('Error deleting pagesa:', error);
        alert('Gabim në fshirjen e pagesës');
      }
    }
  };

  const getPorosiaInfo = (porosiaId) => {
    const porosia = porosite.find(p => p.id === porosiaId);
    return porosia ? `Porosia #${porosia.id} - ${porosia.totali} ALL` : 'N/A';
  };

  const getStatusVariant = (statusi) => {
    switch (statusi) {
      case 'E kompletuar':
        return 'success';
      case 'Në pritje':
        return 'warning';
      case 'E anuluar':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingPagesa(null);
    setFormData({ porosiaId: '', shuma: 0, metoda: 'Kartë', dataPageses: '' });
    setError('');
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Pagesat</h1>
        <Button variant="primary" onClick={() => { setEditingPagesa(null); setFormData({ porosiaId: '', shuma: 0, metoda: 'Kartë', dataPageses: '' }); setShowModal(true); }}>
          + Shto Pagesë
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Porosia</th>
            <th>Shuma</th>
            <th>Metoda</th>
            <th>Data Pagesës</th>
            <th>Statusi</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {pagesat.map(pagesa => (
            <tr key={pagesa.id}>
              <td>{pagesa.id}</td>
              <td>{getPorosiaInfo(pagesa.porosiaId)}</td>
              <td>{pagesa.shuma} ALL</td>
              <td>{pagesa.metoda}</td>
              <td>{pagesa.dataPageses}</td>
              <td>
                {pagesa.statusi && <Badge bg={getStatusVariant(pagesa.statusi)}>{pagesa.statusi}</Badge>}
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(pagesa)}>Ndrysho</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(pagesa.id)}>Fshi</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingPagesa ? 'Ndrysho Pagesën' : 'Shto Pagesë të Re'}</Modal.Title>
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
              <Form.Label>Shuma</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.shuma}
                onChange={(e) => setFormData({ ...formData, shuma: parseFloat(e.target.value) })}
                required
                min="0"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Metoda</Form.Label>
              <Form.Select
                value={formData.metoda}
                onChange={(e) => setFormData({ ...formData, metoda: e.target.value })}
                required
              >
                <option value="Kartë">Kartë</option>
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data Pagesës</Form.Label>
              <Form.Control
                type="date"
                value={formData.dataPageses}
                onChange={(e) => setFormData({ ...formData, dataPageses: e.target.value })}
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

export default PagesaList;
