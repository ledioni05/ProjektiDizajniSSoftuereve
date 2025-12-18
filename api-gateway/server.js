const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const SERVICES = {
  factory: process.env.FACTORY_SERVICE_URL || 'http://localhost:5001',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:5002',
  inventory: process.env.INVENTORY_SERVICE_URL || 'http://localhost:5003',
  financial: process.env.FINANCIAL_SERVICE_URL || 'http://localhost:5004',
  delivery: process.env.DELIVERY_SERVICE_URL || 'http://localhost:5005',
  report: process.env.REPORT_SERVICE_URL || 'http://localhost:5006'
};


app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Gateway is running' });
});


app.use('/api/factory', createProxyMiddleware({
  target: SERVICES.factory,
  changeOrigin: true,
  pathRewrite: { '^/api/factory': '' }
}));

app.use('/api/order', createProxyMiddleware({
  target: SERVICES.order,
  changeOrigin: true,
  pathRewrite: { '^/api/order': '' }
}));

app.use('/api/inventory', createProxyMiddleware({
  target: SERVICES.inventory,
  changeOrigin: true,
  pathRewrite: { '^/api/inventory': '' }
}));

app.use('/api/financial', createProxyMiddleware({
  target: SERVICES.financial,
  changeOrigin: true,
  pathRewrite: { '^/api/financial': '' }
}));

app.use('/api/delivery', createProxyMiddleware({
  target: SERVICES.delivery,
  changeOrigin: true,
  pathRewrite: { '^/api/delivery': '' }
}));

app.use('/api/report', createProxyMiddleware({
  target: SERVICES.report,
  changeOrigin: true,
  pathRewrite: { '^/api/report': '' }
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});

