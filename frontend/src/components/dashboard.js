import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { factoryAPI, orderAPI, inventoryAPI, financialAPI, deliveryAPI } from '../../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    fabrikat: 0,
    produktet: 0,
    punetoret: 0,
    klientet: 0,
    porosite: 0,
    stoku: 0,
    pagesat: 0,
    faturat: 0,
    dergesat: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          fabrikatRes,
          produktetRes,
          punetoretRes,
          klientetRes,
          porositeRes,
          stokuRes,
          pagesatRes,
          faturatRes,
          dergesatRes,
        ] = await Promise.all([
          factoryAPI.getFabrikat(),
          factoryAPI.getProduktet(),
          factoryAPI.getPunetoret(),
          orderAPI.getKlientet(),
          orderAPI.getPorosite(),
          inventoryAPI.getStoku(),
          financialAPI.getPagesat(),
          financialAPI.getFaturat(),
          deliveryAPI.getDergesat(),
        ]);

        setStats({
          fabrikat: fabrikatRes.data.length,
          produktet: produktetRes.data.length,
          punetoret: punetoretRes.data.length,
          klientet: klientetRes.data.length,
          porosite: porositeRes.data.length,
          stoku: stokuRes.data.length,
          pagesat: pagesatRes.data.length,
          faturat: faturatRes.data.length,
          dergesat: dergesatRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  const statCards = [
    { title: 'Fabrikat', value: stats.fabrikat, icon: '🏭', color: 'primary' },
    { title: 'Produktet', value: stats.produktet, icon: '🔩', color: 'info' },
    { title: 'Punëtorët', value: stats.punetoret, icon: '👷', color: 'success' },
    { title: 'Klientët', value: stats.klientet, icon: '👥', color: 'warning' },
    { title: 'Porositë', value: stats.porosite, icon: '📋', color: 'danger' },
    { title: 'Stoku', value: stats.stoku, icon: '📦', color: 'secondary' },
    { title: 'Pagesat', value: stats.pagesat, icon: '💳', color: 'primary' },
    { title: 'Faturat', value: stats.faturat, icon: '🧾', color: 'info' },
    { title: 'Dërgesat', value: stats.dergesat, icon: '🚚', color: 'success' },
  ];

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Dashboard - Plus Metal</h1>
      <Row className="g-4">
        {statCards.map((stat, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3}>
            <Card className={`text-center border-${stat.color} shadow-sm h-100`}>
              <Card.Body>
                <div className="fs-1 mb-2">{stat.icon}</div>
                <Card.Title className="text-muted small text-uppercase">{stat.title}</Card.Title>
                <Card.Text className="display-6 fw-bold text-primary">{stat.value}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;

