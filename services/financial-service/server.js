const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5004;
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:5002';


app.use(cors());
app.use(express.json());


let data = {
  pagesat: [
    { id: 1, porosiaId: 1, shuma: 4000, dataPageses: '2024-01-16', metoda: 'Kartë', statusi: 'E kompletuar' }
  ],
  faturat: [
    { id: 1, porosiaId: 1, numri: 'FAT-001', data: '2024-01-15', totali: 4000, statusi: 'E paguar' }
  ]
};

const getNextId = (collection) => {
  if (collection.length === 0) return 1;
  return Math.max(...collection.map(item => item.id)) + 1;
};


const generateInvoiceNumber = () => {
  const count = data.faturat.length + 1;
  return `FAT-${count.toString().padStart(3, '0')}`;
};


app.get('/pagesat', (req, res) => {
  res.json(data.pagesat);
});

app.get('/pagesat/:id', (req, res) => {
  const pagesa = data.pagesat.find(p => p.id === parseInt(req.params.id));
  if (!pagesa) {
    return res.status(404).json({ message: 'Pagesa nuk u gjet' });
  }
  res.json(pagesa);
});

app.get('/pagesat/porosia/:porosiaId', (req, res) => {
  const pagesa = data.pagesat.find(p => p.porosiaId === parseInt(req.params.porosiaId));
  if (!pagesa) {
    return res.status(404).json({ message: 'Pagesa për këtë porosi nuk u gjet' });
  }
  res.json(pagesa);
});

app.post('/pagesat', async (req, res) => {
  const { porosiaId, shuma, metoda, dataPageses } = req.body;
  if (!porosiaId || !shuma) {
    return res.status(400).json({ message: 'PorosiaId dhe shuma janë të detyrueshme' });
  }
  

  try {
    const orderResponse = await axios.get(`${ORDER_SERVICE_URL}/porosite/${porosiaId}`);
    const porosia = orderResponse.data;
    
    if (shuma > porosia.totali) {
      return res.status(400).json({ message: 'Shuma e pagesës nuk mund të jetë më e madhe se totali i porosisë' });
    }
  } catch (error) {
    return res.status(404).json({ message: 'Porosia nuk u gjet' });
  }
  
  const newPagesa = {
    id: getNextId(data.pagesat),
    porosiaId,
    shuma,
    dataPageses: dataPageses || new Date().toISOString().split('T')[0],
    metoda: metoda || 'Kartë',
    statusi: 'E kompletuar'
  };
  data.pagesat.push(newPagesa);
  res.status(201).json(newPagesa);
});

app.put('/pagesat/:id', (req, res) => {
  const index = data.pagesat.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Pagesa nuk u gjet' });
  }
  const { porosiaId, shuma, metoda, dataPageses, statusi } = req.body;
  data.pagesat[index] = { 
    ...data.pagesat[index], 
    ...(porosiaId !== undefined && { porosiaId }), 
    ...(shuma !== undefined && { shuma }), 
    ...(metoda && { metoda }), 
    ...(dataPageses && { dataPageses }), 
    ...(statusi && { statusi }) 
  };
  res.json(data.pagesat[index]);
});

app.delete('/pagesat/:id', (req, res) => {
  const index = data.pagesat.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Pagesa nuk u gjet' });
  }
  data.pagesat.splice(index, 1);
  res.json({ message: 'Pagesa u fshi me sukses' });
});


app.get('/faturat', (req, res) => {
  res.json(data.faturat);
});

app.get('/faturat/:id', (req, res) => {
  const fatura = data.faturat.find(f => f.id === parseInt(req.params.id));
  if (!fatura) {
    return res.status(404).json({ message: 'Fatura nuk u gjet' });
  }
  res.json(fatura);
});

app.get('/faturat/porosia/:porosiaId', (req, res) => {
  const fatura = data.faturat.find(f => f.porosiaId === parseInt(req.params.porosiaId));
  if (!fatura) {
    return res.status(404).json({ message: 'Fatura për këtë porosi nuk u gjet' });
  }
  res.json(fatura);
});

app.post('/faturat', async (req, res) => {
  const { porosiaId, data, statusi } = req.body;
  if (!porosiaId) {
    return res.status(400).json({ message: 'PorosiaId është e detyrueshme' });
  }
  
  
  let totali = 0;
  try {
    const orderResponse = await axios.get(`${ORDER_SERVICE_URL}/porosite/${porosiaId}`);
    totali = orderResponse.data.totali;
  } catch (error) {
    return res.status(404).json({ message: 'Porosia nuk u gjet' });
  }
  
  const newFatura = {
    id: getNextId(data.faturat),
    porosiaId,
    numri: generateInvoiceNumber(),
    data: data || new Date().toISOString().split('T')[0],
    totali,
    statusi: statusi || 'E paguar'
  };
  data.faturat.push(newFatura);
  res.status(201).json(newFatura);
});

app.put('/faturat/:id', (req, res) => {
  const index = data.faturat.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Fatura nuk u gjet' });
  }
  const { porosiaId, data, totali, statusi } = req.body;
  data.faturat[index] = { 
    ...data.faturat[index], 
    ...(porosiaId !== undefined && { porosiaId }), 
    ...(data && { data }), 
    ...(totali !== undefined && { totali }), 
    ...(statusi && { statusi }) 
  };
  res.json(data.faturat[index]);
});

app.delete('/faturat/:id', (req, res) => {
  const index = data.faturat.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Fatura nuk u gjet' });
  }
  data.faturat.splice(index, 1);
  res.json({ message: 'Fatura u fshi me sukses' });
});

app.listen(PORT, () => {
  console.log(`Financial Service running on http://localhost:${PORT}`);
});

