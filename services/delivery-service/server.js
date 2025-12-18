const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:5002';


app.use(cors());
app.use(express.json());


let data = {
  dergesat: [
    { id: 1, porosiaId: 1, dataDergeses: '2024-01-17', statusi: 'Në rrugë', adresa: 'Prishtinë', transportuesi: 'Furgon-i mesem' }
  ]
};

const getNextId = (collection) => {
  if (collection.length === 0) return 1;
  return Math.max(...collection.map(item => item.id)) + 1;
};


app.get('/dergesat', (req, res) => {
  res.json(data.dergesat);
});

app.get('/dergesat/:id', (req, res) => {
  const dergesa = data.dergesat.find(d => d.id === parseInt(req.params.id));
  if (!dergesa) {
    return res.status(404).json({ message: 'Dërgesa nuk u gjet' });
  }
  res.json(dergesa);
});

app.get('/dergesat/porosia/:porosiaId', (req, res) => {
  const dergesa = data.dergesat.find(d => d.porosiaId === parseInt(req.params.porosiaId));
  if (!dergesa) {
    return res.status(404).json({ message: 'Dërgesa për këtë porosi nuk u gjet' });
  }
  res.json(dergesa);
});

app.get('/dergesat/status/:statusi', (req, res) => {
  const dergesat = data.dergesat.filter(d => d.statusi === req.params.statusi);
  res.json(dergesat);
});

app.post('/dergesat', async (req, res) => {
  const { porosiaId, dataDergeses, statusi, adresa, transportuesi } = req.body;
  if (!porosiaId) {
    return res.status(400).json({ message: 'PorosiaId është e detyrueshme' });
  }
  
  
  try {
    const orderResponse = await axios.get(`${ORDER_SERVICE_URL}/porosite/${porosiaId}`);
    const porosia = orderResponse.data;
    const clientResponse = await axios.get(`${ORDER_SERVICE_URL}/klientet/${porosia.klientiId}`);
    const klienti = clientResponse.data;
    
    const newDergesa = {
      id: getNextId(data.dergesat),
      porosiaId,
      dataDergeses: dataDergeses || new Date().toISOString().split('T')[0],
      statusi: statusi || 'Në përgatitje',
      adresa: adresa || klienti.adresa,
      transportuesi: transportuesi || 'Furgon-i mesem'
    };
    data.dergesat.push(newDergesa);
    res.status(201).json(newDergesa);
  } catch (error) {
    return res.status(404).json({ message: 'Porosia ose klienti nuk u gjet' });
  }
});

app.put('/dergesat/:id', (req, res) => {
  const index = data.dergesat.findIndex(d => d.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Dërgesa nuk u gjet' });
  }
  const { porosiaId, dataDergeses, statusi, adresa, transportuesi } = req.body;
  data.dergesat[index] = { 
    ...data.dergesat[index], 
    ...(porosiaId !== undefined && { porosiaId }), 
    ...(dataDergeses && { dataDergeses }), 
    ...(statusi && { statusi }), 
    ...(adresa && { adresa }), 
    ...(transportuesi && { transportuesi }) 
  };
  res.json(data.dergesat[index]);
});

app.patch('/dergesat/:id/update-status', (req, res) => {
  const index = data.dergesat.findIndex(d => d.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Dërgesa nuk u gjet' });
  }
  const { statusi } = req.body;
  if (!statusi) {
    return res.status(400).json({ message: 'Statusi është i detyrueshëm' });
  }
  data.dergesat[index].statusi = statusi;
  res.json(data.dergesat[index]);
});

app.delete('/dergesat/:id', (req, res) => {
  const index = data.dergesat.findIndex(d => d.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Dërgesa nuk u gjet' });
  }
  data.dergesat.splice(index, 1);
  res.json({ message: 'Dërgesa u fshi me sukses' });
});

app.listen(PORT, () => {
  console.log(`Delivery Service running on http://localhost:${PORT}`);
});

