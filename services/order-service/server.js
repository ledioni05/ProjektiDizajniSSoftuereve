const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;
const FACTORY_SERVICE_URL = process.env.FACTORY_SERVICE_URL || 'http://localhost:5001';


app.use(cors());
app.use(express.json());


let data = {
  klientet: [
    { id: 1, emri: 'Bau Market', email: 'baumarket@gmail.com', telefoni: '+383 45 111 222', adresa: 'Prishtinë' },
    { id: 2, emri: 'SABA-Group', email: 'sabagroup@gmail.com', telefoni: '+355 45 222 333', adresa: 'Gjilan' },
    { id: 2, emri: 'CTA', email: 'cta@gmail.com', telefoni: '+383 45 333 444', adresa: 'Pejë' }
  ],
  porosite: [
    { 
      id: 1, 
      klientiId: 1, 
      dataPorosise: '2024-01-15', 
      statusi: 'Aktive',
      produktet: [
        { produktId: 1, sasia: 200, cmimi: 50 },
        { produktId: 2, sasia: 100, cmimi: 30 }
      ],
      totali: 4000
    }
  ]
};

const getNextId = (collection) => {
  if (collection.length === 0) return 1;
  return Math.max(...collection.map(item => item.id)) + 1;
};


const calculateTotal = async (produktet) => {
  let total = 0;
  for (const item of produktet) {
    try {
      const response = await axios.get(`${FACTORY_SERVICE_URL}/produktet/${item.produktId}`);
      total += response.data.cmimi * item.sasia;
    } catch (error) {
      total += item.cmimi * item.sasia;
    }
  }
  return total;
};


app.get('/klientet', (req, res) => {
  res.json(data.klientet);
});

app.get('/klientet/:id', (req, res) => {
  const klienti = data.klientet.find(k => k.id === parseInt(req.params.id));
  if (!klienti) {
    return res.status(404).json({ message: 'Klienti nuk u gjet' });
  }
  res.json(klienti);
});

app.post('/klientet', (req, res) => {
  const { emri, email, telefoni, adresa } = req.body;
  if (!emri || !email) {
    return res.status(400).json({ message: 'Emri dhe email janë të detyrueshme' });
  }
  const newKlienti = {
    id: getNextId(data.klientet),
    emri,
    email,
    telefoni: telefoni || '',
    adresa: adresa || ''
  };
  data.klientet.push(newKlienti);
  res.status(201).json(newKlienti);
});

app.put('/klientet/:id', (req, res) => {
  const index = data.klientet.findIndex(k => k.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Klienti nuk u gjet' });
  }
  const { emri, email, telefoni, adresa } = req.body;
  data.klientet[index] = { ...data.klientet[index], ...(emri && { emri }), ...(email && { email }), ...(telefoni !== undefined && { telefoni }), ...(adresa !== undefined && { adresa }) };
  res.json(data.klientet[index]);
});

app.delete('/klientet/:id', (req, res) => {
  const index = data.klientet.findIndex(k => k.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Klienti nuk u gjet' });
  }
  data.klientet.splice(index, 1);
  res.json({ message: 'Klienti u fshi me sukses' });
});


app.get('/porosite', (req, res) => {
  res.json(data.porosite);
});

app.get('/porosite/:id', (req, res) => {
  const porosia = data.porosite.find(p => p.id === parseInt(req.params.id));
  if (!porosia) {
    return res.status(404).json({ message: 'Porosia nuk u gjet' });
  }
  res.json(porosia);
});

app.get('/porosite/klienti/:klientiId', (req, res) => {
  const porosite = data.porosite.filter(p => p.klientiId === parseInt(req.params.klientiId));
  res.json(porosite);
});

app.post('/porosite', async (req, res) => {
  const { klientiId, produktet, dataPorosise, statusi } = req.body;
  if (!klientiId || !produktet || !Array.isArray(produktet) || produktet.length === 0) {
    return res.status(400).json({ message: 'KlientiId dhe produktet janë të detyrueshme' });
  }
  
  const totali = await calculateTotal(produktet);
  const newPorosia = {
    id: getNextId(data.porosite),
    klientiId,
    dataPorosise: dataPorosise || new Date().toISOString().split('T')[0],
    statusi: statusi || 'Aktive',
    produktet,
    totali
  };
  data.porosite.push(newPorosia);
  res.status(201).json(newPorosia);
});

app.put('/porosite/:id', async (req, res) => {
  const index = data.porosite.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Porosia nuk u gjet' });
  }
  const { klientiId, produktet, dataPorosise, statusi } = req.body;
  let totali = data.porosite[index].totali;
  
  if (produktet && Array.isArray(produktet)) {
    totali = await calculateTotal(produktet);
  }
  
  data.porosite[index] = { 
    ...data.porosite[index], 
    ...(klientiId !== undefined && { klientiId }), 
    ...(produktet && { produktet }), 
    ...(dataPorosise && { dataPorosise }), 
    ...(statusi && { statusi }),
    totali
  };
  res.json(data.porosite[index]);
});

app.delete('/porosite/:id', (req, res) => {
  const index = data.porosite.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Porosia nuk u gjet' });
  }
  data.porosite.splice(index, 1);
  res.json({ message: 'Porosia u fshi me sukses' });
});

app.listen(PORT, () => {
  console.log(`Order Service running on http://localhost:${PORT}`);
});

