import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { inventoryAPI, factoryAPI } from '../../../services/api';

const StokuList = () => {
  const [stoku, setStoku] = useState([]);
  const [produktet, setProduktet] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStoku, setEditingStoku] = useState(null);
  const [formData, setFormData] = useState({ produktId: '', sasia: 0, minimumi: 0, lokacioni: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stokuRes, produktetRes] = await Promise.all([
        inventoryAPI.getStoku(),
        factoryAPI.getProduktet()
      ]);
      setStoku(stokuRes.data);
      setProduktet(produktetRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingStoku) {
        await inventoryAPI.updateStoku(editingStoku.id, formData);
      } else {
        await inventoryAPI.createStoku(formData);
      }
      setShowModal(false);
      setEditingStoku(null);
      setFormData({ produktId: '', sasia: 0, minimumi: 0, lokacioni: '' });
      loadData();
    } catch (error) {
      console.error('Error saving stoku:', error);
      setError('Gabim në ruajtjen e stokut');
    }
  };

  const handleEdit = (stokuItem) => {
    setEditingStoku(stokuItem);
    setFormData({
      produktId: stokuItem.produktId,
      sasia: stokuItem.sasia,
      minimumi: stokuItem.minimumi,
      lokacioni: stokuItem.lokacioni
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeni të sigurt që dëshironi të fshini këtë stok?')) {
      try {
        await inventoryAPI.deleteStoku(id);
        loadData();
      } catch (error) {
        console.error('Error deleting stoku:', error);
        alert('Gabim në fshirjen e stokut');
      }
    }
  };

  const getProduktName = (produktId) => {
    const produkt = produktet.find(p => p.id === produktId);
    return produkt ? produkt.emri : 'N/A';
  };

  const isLowStock = (item) => item.sasia <= item.minimumi;

  const handleClose = () => {
    setShowModal(false);
    setEditingStoku(null);
    setFormData({ produktId: '', sasia: 0, minimumi: 0, lokacioni: '' });
    setError('');
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Stoku</h1>
        <Button variant="primary" onClick={() => { setEditingStoku(null); setFormData({ produktId: '', sasia: 0, minimumi: 0, lokacioni: '' }); setShowModal(true); }}>
          + Shto Stok
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Produkti</th>
            <th>Sasia</th>
            <th>Minimumi</th>
            <th>Lokacioni</th>
            <th>Statusi</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {stoku.map(item => (
            <tr key={item.id} className={isLowStock(item) ? 'table-warning' : ''}>
              <td>{item.id}</td>
              <td>{getProduktName(item.produktId)}</td>
              <td>{item.sasia}</td>
              <td>{item.minimumi}</td>
              <td>{item.lokacioni}</td>
              <td>
                {isLowStock(item) ? (
                  <Badge bg="danger">Stok i ulët</Badge>
                ) : (
                  <Badge bg="success">Në rregull</Badge>
                )}
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(item)}>Ndrysho</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>Fshi</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingStoku ? 'Ndrysho Stokun' : 'Shto Stok të Ri'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Produkti</Form.Label>
              <Form.Select
                value={formData.produktId}
                onChange={(e) => setFormData({ ...formData, produktId: parseInt(e.target.value) })}
                required
              >
                <option value="">Zgjidh Produktin</option>
                {produktet.map(produkt => (
                  <option key={produkt.id} value={produkt.id}>{produkt.emri}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sasia</Form.Label>
              <Form.Control
                type="number"
                value={formData.sasia}
                onChange={(e) => setFormData({ ...formData, sasia: parseInt(e.target.value) })}
                required
                min="0"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Minimumi</Form.Label>
              <Form.Control
                type="number"
                value={formData.minimumi}
                onChange={(e) => setFormData({ ...formData, minimumi: parseInt(e.target.value) })}
                required
                min="0"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lokacioni</Form.Label>
              <Form.Control
                type="text"
                value={formData.lokacioni}
                onChange={(e) => setFormData({ ...formData, lokacioni: e.target.value })}
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

export default StokuList;
