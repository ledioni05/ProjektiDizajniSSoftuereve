import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Badge, InputGroup } from 'react-bootstrap';
import { orderAPI, factoryAPI } from '../services/api';

const PorosiaList = () => {
  const [porosite, setPorosite] = useState([]);
  const [klientet, setKlientet] = useState([]);
  const [produktet, setProduktet] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPorosia, setEditingPorosia] = useState(null);
  const [formData, setFormData] = useState({ klientiId: '', dataPorosise: '', statusi: 'Aktive', produktet: [] });
  const [currentProduct, setCurrentProduct] = useState({ produktId: '', sasia: 1 });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [porositeRes, klientetRes, produktetRes] = await Promise.all([
        orderAPI.getPorosite(),
        orderAPI.getKlientet(),
        factoryAPI.getProduktet()
      ]);
      setPorosite(porositeRes.data);
      setKlientet(klientetRes.data);
      setProduktet(produktetRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.produktet.length === 0) {
      setError('Ju lutem shtoni të paktën një produkt');
      return;
    }
    try {
      if (editingPorosia) {
        await orderAPI.updatePorosia(editingPorosia.id, formData);
      } else {
        await orderAPI.createPorosia(formData);
      }
      setShowModal(false);
      setEditingPorosia(null);
      setFormData({ klientiId: '', dataPorosise: '', statusi: 'Aktive', produktet: [] });
      setCurrentProduct({ produktId: '', sasia: 1 });
      loadData();
    } catch (error) {
      console.error('Error saving porosia:', error);
      setError('Gabim në ruajtjen e porosisë');
    }
  };

  const handleEdit = (porosia) => {
    setEditingPorosia(porosia);
    setFormData({
      klientiId: porosia.klientiId,
      dataPorosise: porosia.dataPorosise,
      statusi: porosia.statusi,
      produktet: porosia.produktet || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeni të sigurt që dëshironi të fshini këtë porosi?')) {
      try {
        await orderAPI.deletePorosia(id);
        loadData();
      } catch (error) {
        console.error('Error deleting porosia:', error);
        alert('Gabim në fshirjen e porosisë');
      }
    }
  };

  const addProduct = () => {
    if (currentProduct.produktId && currentProduct.sasia > 0) {
      const produkt = produktet.find(p => p.id === parseInt(currentProduct.produktId));
      setFormData({
        ...formData,
        produktet: [...formData.produktet, {
          produktId: parseInt(currentProduct.produktId),
          sasia: parseInt(currentProduct.sasia),
          cmimi: produkt.cmimi
        }]
      });
      setCurrentProduct({ produktId: '', sasia: 1 });
    }
  };

  const removeProduct = (index) => {
    setFormData({
      ...formData,
      produktet: formData.produktet.filter((_, i) => i !== index)
    });
  };

  const getKlientiName = (klientiId) => {
    const klienti = klientet.find(k => k.id === klientiId);
    return klienti ? klienti.emri : 'N/A';
  };

  const getProduktName = (produktId) => {
    const produkt = produktet.find(p => p.id === produktId);
    return produkt ? produkt.emri : 'N/A';
  };

  const getStatusVariant = (statusi) => {
    switch (statusi) {
      case 'Aktive':
        return 'primary';
      case 'E kompletuar':
        return 'success';
      case 'E anuluar':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingPorosia(null);
    setFormData({ klientiId: '', dataPorosise: '', statusi: 'Aktive', produktet: [] });
    setCurrentProduct({ produktId: '', sasia: 1 });
    setError('');
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Porositë</h1>
        <Button variant="primary" onClick={() => { setEditingPorosia(null); setFormData({ klientiId: '', dataPorosise: '', statusi: 'Aktive', produktet: [] }); setShowModal(true); }}>
          + Shto Porosi
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Klienti</th>
            <th>Data</th>
            <th>Statusi</th>
            <th>Totali</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {porosite.map(porosia => (
            <tr key={porosia.id}>
              <td>{porosia.id}</td>
              <td>{getKlientiName(porosia.klientiId)}</td>
              <td>{porosia.dataPorosise}</td>
              <td>
                <Badge bg={getStatusVariant(porosia.statusi)}>{porosia.statusi}</Badge>
              </td>
              <td>{porosia.totali} ALL</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(porosia)}>Ndrysho</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(porosia.id)}>Fshi</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingPorosia ? 'Ndrysho Porosinë' : 'Shto Porosi të Re'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Klienti</Form.Label>
              <Form.Select
                value={formData.klientiId}
                onChange={(e) => setFormData({ ...formData, klientiId: parseInt(e.target.value) })}
                required
              >
                <option value="">Zgjidh Klientin</option>
                {klientet.map(klienti => (
                  <option key={klienti.id} value={klienti.id}>{klienti.emri}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data Porosisë</Form.Label>
              <Form.Control
                type="date"
                value={formData.dataPorosise}
                onChange={(e) => setFormData({ ...formData, dataPorosise: e.target.value })}
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
                <option value="Aktive">Aktive</option>
                <option value="E kompletuar">E kompletuar</option>
                <option value="E anuluar">E anuluar</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Produktet</Form.Label>
              <InputGroup className="mb-2">
                <Form.Select
                  value={currentProduct.produktId}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, produktId: e.target.value })}
                >
                  <option value="">Zgjidh Produktin</option>
                  {produktet.map(produkt => (
                    <option key={produkt.id} value={produkt.id}>{produkt.emri} - {produkt.cmimi} ALL</option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="number"
                  value={currentProduct.sasia}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, sasia: parseInt(e.target.value) })}
                  placeholder="Sasia"
                  style={{ maxWidth: '120px' }}
                  min="1"
                />
                <Button variant="outline-secondary" onClick={addProduct}>Shto</Button>
              </InputGroup>
              <div>
                {formData.produktet.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded">
                    <span>{getProduktName(item.produktId)} - {item.sasia} x {item.cmimi} ALL</span>
                    <Button variant="outline-danger" size="sm" onClick={() => removeProduct(index)}>Fshi</Button>
                  </div>
                ))}
              </div>
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

export default PorosiaList;
