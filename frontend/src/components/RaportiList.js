import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { reportAPI } from '../../../services/api';

const RaportiList = () => {
  const [raportet, setRaportet] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState({ dataNga: '', dataDeri: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadRaportet();
  }, []);

  const loadRaportet = async () => {
    try {
      const response = await reportAPI.getRaportet();
      setRaportet(response.data);
    } catch (error) {
      console.error('Error loading raportet:', error);
    }
  };

  const generateReport = async () => {
    setError('');
    setSuccess('');
    try {
      let response;
      switch (reportType) {
        case 'sales':
          response = await reportAPI.generateSalesReport(dateRange);
          break;
        case 'inventory':
          response = await reportAPI.generateInventoryReport();
          break;
        case 'delivery':
          response = await reportAPI.generateDeliveryReport();
          break;
        case 'comprehensive':
          response = await reportAPI.generateComprehensiveReport(dateRange);
          break;
        default:
          return;
      }
      setShowModal(false);
      setDateRange({ dataNga: '', dataDeri: '' });
      loadRaportet();
      setSuccess('Raporti u gjenerua me sukses!');
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Gabim në gjenerimin e raportit');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeni të sigurt që dëshironi të fshini këtë raport?')) {
      try {
        await reportAPI.deleteRaporti(id);
        loadRaportet();
      } catch (error) {
        console.error('Error deleting raporti:', error);
        alert('Gabim në fshirjen e raportit');
      }
    }
  };

  const formatData = (data) => {
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  const handleClose = () => {
    setShowModal(false);
    setReportType('sales');
    setDateRange({ dataNga: '', dataDeri: '' });
    setError('');
    setSuccess('');
  };

  return (
    <Container className="mt-4">
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Raportet</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Gjenero Raport
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipi</th>
            <th>Data Gjenerimit</th>
            <th>Data Nga</th>
            <th>Data Deri</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {raportet.map(raporti => (
            <tr key={raporti.id}>
              <td>{raporti.id}</td>
              <td>{raporti.tipi}</td>
              <td>{raporti.dataGjenerimit}</td>
              <td>{raporti.dataNga || 'N/A'}</td>
              <td>{raporti.dataDeri || 'N/A'}</td>
              <td>
                <Button variant="outline-info" size="sm" className="me-2" onClick={() => {
                  const details = window.open('', '_blank');
                  details.document.write(`
                    <html>
                      <head><title>${raporti.tipi}</title></head>
                      <body>
                        <h1>${raporti.tipi}</h1>
                        <pre>${formatData(raporti.teDhenat)}</pre>
                      </body>
                    </html>
                  `);
                }}>Shiko Detajet</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(raporti.id)}>Fshi</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Gjenero Raport</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={(e) => { e.preventDefault(); generateReport(); }}>
            <Form.Group className="mb-3">
              <Form.Label>Tipi i Raportit</Form.Label>
              <Form.Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                required
              >
                <option value="sales">Raport Shitjesh</option>
                <option value="inventory">Raport Stoku</option>
                <option value="delivery">Raport Dërgesash</option>
                <option value="comprehensive">Raport Komprehensiv</option>
              </Form.Select>
            </Form.Group>
            {(reportType === 'sales' || reportType === 'comprehensive') && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Data Nga</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.dataNga}
                    onChange={(e) => setDateRange({ ...dateRange, dataNga: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Data Deri</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.dataDeri}
                    onChange={(e) => setDateRange({ ...dateRange, dataDeri: e.target.value })}
                  />
                </Form.Group>
              </>
            )}
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>Anulo</Button>
              <Button variant="success" type="submit">Gjenero</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default RaportiList;
