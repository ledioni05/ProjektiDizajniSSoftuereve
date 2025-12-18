const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5006;


const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:5002';
const FINANCIAL_SERVICE_URL = process.env.FINANCIAL_SERVICE_URL || 'http://localhost:5004';
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:5003';
const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL || 'http://localhost:5005';


app.use(cors());
app.use(express.json());


let data = {
  raportet: []
};

const getNextId = (collection) => {
  if (collection.length === 0) return 1;
  return Math.max(...collection.map(item => item.id)) + 1;
};


app.get('/raportet', (req, res) => {
  res.json(data.raportet);
});

app.get('/raportet/:id', (req, res) => {
  const raporti = data.raportet.find(r => r.id === parseInt(req.params.id));
  if (!raporti) {
    return res.status(404).json({ message: 'Raporti nuk u gjet' });
  }
  res.json(raporti);
});


app.post('/raportet/sales', async (req, res) => {
  try {
    const { dataNga, dataDeri } = req.body;
    
    
    const ordersResponse = await axios.get(`${ORDER_SERVICE_URL}/porosite`);
    const porosite = ordersResponse.data;
    
    
    const paymentsResponse = await axios.get(`${FINANCIAL_SERVICE_URL}/pagesat`);
    const pagesat = paymentsResponse.data;
    
    let filteredOrders = porosite;
    if (dataNga && dataDeri) {
      filteredOrders = porosite.filter(p => 
        p.dataPorosise >= dataNga && p.dataPorosise <= dataDeri
      );
    }
    
    const totaliPorosive = filteredOrders.reduce((sum, p) => sum + p.totali, 0);
    const numriPorosive = filteredOrders.length;
    const totaliPagesave = pagesat
      .filter(p => filteredOrders.some(o => o.id === p.porosiaId))
      .reduce((sum, p) => sum + p.shuma, 0);
    
    const raporti = {
      id: getNextId(data.raportet),
      tipi: 'Raport Shitjesh',
      dataNga: dataNga || null,
      dataDeri: dataDeri || null,
      dataGjenerimit: new Date().toISOString().split('T')[0],
      teDhenat: {
        numriPorosive,
        totaliPorosive,
        totaliPagesave,
        porosite: filteredOrders
      }
    };
    
    data.raportet.push(raporti);
    res.status(201).json(raporti);
  } catch (error) {
    res.status(500).json({ message: 'Gabim në gjenerimin e raportit', error: error.message });
  }
});


app.post('/raportet/inventory', async (req, res) => {
  try {
    const inventoryResponse = await axios.get(`${INVENTORY_SERVICE_URL}/stoku`);
    const stoku = inventoryResponse.data;
    
    const lowStock = stoku.filter(s => s.sasia <= s.minimumi);
    const totaliProdukteve = stoku.length;
    const totaliSasise = stoku.reduce((sum, s) => sum + s.sasia, 0);
    
    const raporti = {
      id: getNextId(data.raportet),
      tipi: 'Raport Stoku',
      dataGjenerimit: new Date().toISOString().split('T')[0],
      teDhenat: {
        totaliProdukteve,
        totaliSasise,
        lowStockCount: lowStock.length,
        stoku,
        lowStock
      }
    };
    
    data.raportet.push(raporti);
    res.status(201).json(raporti);
  } catch (error) {
    res.status(500).json({ message: 'Gabim në gjenerimin e raportit', error: error.message });
  }
});


app.post('/raportet/delivery', async (req, res) => {
  try {
    const deliveryResponse = await axios.get(`${DELIVERY_SERVICE_URL}/dergesat`);
    const dergesat = deliveryResponse.data;
    
    const statusCounts = {};
    dergesat.forEach(d => {
      statusCounts[d.statusi] = (statusCounts[d.statusi] || 0) + 1;
    });
    
    const raporti = {
      id: getNextId(data.raportet),
      tipi: 'Raport Dërgesash',
      dataGjenerimit: new Date().toISOString().split('T')[0],
      teDhenat: {
        totaliDergesave: dergesat.length,
        statusCounts,
        dergesat
      }
    };
    
    data.raportet.push(raporti);
    res.status(201).json(raporti);
  } catch (error) {
    res.status(500).json({ message: 'Gabim në gjenerimin e raportit', error: error.message });
  }
});


app.post('/raportet/comprehensive', async (req, res) => {
  try {
    const { dataNga, dataDeri } = req.body;
    
   
    const [ordersRes, paymentsRes, inventoryRes, deliveryRes] = await Promise.all([
      axios.get(`${ORDER_SERVICE_URL}/porosite`),
      axios.get(`${FINANCIAL_SERVICE_URL}/pagesat`),
      axios.get(`${INVENTORY_SERVICE_URL}/stoku`),
      axios.get(`${DELIVERY_SERVICE_URL}/dergesat`)
    ]);
    
    const porosite = ordersRes.data;
    const pagesat = paymentsRes.data;
    const stoku = inventoryRes.data;
    const dergesat = deliveryRes.data;
    
    let filteredOrders = porosite;
    if (dataNga && dataDeri) {
      filteredOrders = porosite.filter(p => 
        p.dataPorosise >= dataNga && p.dataPorosise <= dataDeri
      );
    }
    
    const raporti = {
      id: getNextId(data.raportet),
      tipi: 'Raport Komprehensiv',
      dataNga: dataNga || null,
      dataDeri: dataDeri || null,
      dataGjenerimit: new Date().toISOString().split('T')[0],
      teDhenat: {
        porosite: {
          totali: filteredOrders.length,
          totaliVleres: filteredOrders.reduce((sum, p) => sum + p.totali, 0),
          porosite: filteredOrders
        },
        pagesat: {
          totali: pagesat.length,
          totaliShumes: pagesat.reduce((sum, p) => sum + p.shuma, 0),
          pagesat
        },
        stoku: {
          totaliProdukteve: stoku.length,
          totaliSasise: stoku.reduce((sum, s) => sum + s.sasia, 0),
          lowStock: stoku.filter(s => s.sasia <= s.minimumi).length,
          stoku
        },
        dergesat: {
          totali: dergesat.length,
          dergesat
        }
      }
    };
    
    data.raportet.push(raporti);
    res.status(201).json(raporti);
  } catch (error) {
    res.status(500).json({ message: 'Gabim në gjenerimin e raportit', error: error.message });
  }
});

app.delete('/raportet/:id', (req, res) => {
  const index = data.raportet.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Raporti nuk u gjet' });
  }
  data.raportet.splice(index, 1);
  res.json({ message: 'Raporti u fshi me sukses' });
});

app.listen(PORT, () => {
  console.log(`Report Service running on http://localhost:${PORT}`);
});

