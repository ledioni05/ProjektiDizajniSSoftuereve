const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());


let data = {
  fabrikat: [
    { id: 1, emri: 'Plus Metal-1', adresa: 'Ferizaj, Kosove', kapaciteti: 1000 }
  ],
  produktet: [
    { id: 1, emri: 'Kaseta Metalike', tipi: 'Llamarin', cmimi: 50, fabrikaId: 1 },
    { id: 2, emri: 'Hidranti', tipi: 'LLamarin', cmimi: 30, fabrikaId: 1 }
  ],
  punetoret: [
    { id: 1, emri: 'Punëtori 1', pozicioni: 'Operator', fabrikaId: 1, paga: 50000, dataPunesimit: '2023-01-01' },
    { id: 2, emri: 'Punëtori 2', pozicioni: 'Menaxher', fabrikaId: 1, paga: 80000, dataPunesimit: '2022-06-15' }
  ]
};

const getNextId = (collection) => {
  if (collection.length === 0) return 1;
  return Math.max(...collection.map(item => item.id)) + 1;
};


app.get('/fabrikat', (req, res) => {
  res.json(data.fabrikat);
});

app.get('/fabrikat/:id', (req, res) => {
  const fabrika = data.fabrikat.find(f => f.id === parseInt(req.params.id));
  if (!fabrika) {
    return res.status(404).json({ message: 'Fabrika nuk u gjet' });
  }
  res.json(fabrika);
});

app.post('/fabrikat', (req, res) => {
  const { emri, adresa, kapaciteti } = req.body;
  if (!emri || !adresa) {
    return res.status(400).json({ message: 'Emri dhe adresa janë të detyrueshme' });
  }
  const newFabrika = {
    id: getNextId(data.fabrikat),
    emri,
    adresa,
    kapaciteti: kapaciteti || 0
  };
  data.fabrikat.push(newFabrika);
  res.status(201).json(newFabrika);
});

app.put('/fabrikat/:id', (req, res) => {
  const index = data.fabrikat.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Fabrika nuk u gjet' });
  }
  const { emri, adresa, kapaciteti } = req.body;
  data.fabrikat[index] = { ...data.fabrikat[index], ...(emri && { emri }), ...(adresa && { adresa }), ...(kapaciteti !== undefined && { kapaciteti }) };
  res.json(data.fabrikat[index]);
});

app.delete('/fabrikat/:id', (req, res) => {
  const index = data.fabrikat.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Fabrika nuk u gjet' });
  }
  data.fabrikat.splice(index, 1);
  res.json({ message: 'Fabrika u fshi me sukses' });
});


app.get('/produktet', (req, res) => {
  res.json(data.produktet);
});

app.get('/produktet/:id', (req, res) => {
  const produkt = data.produktet.find(p => p.id === parseInt(req.params.id));
  if (!produkt) {
    return res.status(404).json({ message: 'Produkti nuk u gjet' });
  }
  res.json(produkt);
});

app.get('/produktet/fabrika/:fabrikaId', (req, res) => {
  const produktet = data.produktet.filter(p => p.fabrikaId === parseInt(req.params.fabrikaId));
  res.json(produktet);
});

app.post('/produktet', (req, res) => {
  const { emri, tipi, cmimi, fabrikaId } = req.body;
  if (!emri || !tipi || !cmimi || !fabrikaId) {
    return res.status(400).json({ message: 'Të gjitha fushat janë të detyrueshme' });
  }
  const newProdukt = {
    id: getNextId(data.produktet),
    emri,
    tipi,
    cmimi,
    fabrikaId
  };
  data.produktet.push(newProdukt);
  res.status(201).json(newProdukt);
});

app.put('/produktet/:id', (req, res) => {
  const index = data.produktet.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Produkti nuk u gjet' });
  }
  const { emri, tipi, cmimi, fabrikaId } = req.body;
  data.produktet[index] = { ...data.produktet[index], ...(emri && { emri }), ...(tipi && { tipi }), ...(cmimi !== undefined && { cmimi }), ...(fabrikaId !== undefined && { fabrikaId }) };
  res.json(data.produktet[index]);
});

app.delete('/produktet/:id', (req, res) => {
  const index = data.produktet.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Produkti nuk u gjet' });
  }
  data.produktet.splice(index, 1);
  res.json({ message: 'Produkti u fshi me sukses' });
});


app.get('/punetoret', (req, res) => {
  res.json(data.punetoret);
});

app.get('/punetoret/:id', (req, res) => {
  const punetori = data.punetoret.find(p => p.id === parseInt(req.params.id));
  if (!punetori) {
    return res.status(404).json({ message: 'Punëtori nuk u gjet' });
  }
  res.json(punetori);
});

app.get('/punetoret/fabrika/:fabrikaId', (req, res) => {
  const punetoret = data.punetoret.filter(p => p.fabrikaId === parseInt(req.params.fabrikaId));
  res.json(punetoret);
});

app.post('/punetoret', (req, res) => {
  const { emri, pozicioni, fabrikaId, paga, dataPunesimit } = req.body;
  if (!emri || !pozicioni || !fabrikaId) {
    return res.status(400).json({ message: 'Emri, pozicioni dhe fabrikaId janë të detyrueshme' });
  }
  const newPunetori = {
    id: getNextId(data.punetoret),
    emri,
    pozicioni,
    fabrikaId,
    paga: paga || 0,
    dataPunesimit: dataPunesimit || new Date().toISOString().split('T')[0]
  };
  data.punetoret.push(newPunetori);
  res.status(201).json(newPunetori);
});

app.put('/punetoret/:id', (req, res) => {
  const index = data.punetoret.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Punëtori nuk u gjet' });
  }
  const { emri, pozicioni, fabrikaId, paga, dataPunesimit } = req.body;
  data.punetoret[index] = { ...data.punetoret[index], ...(emri && { emri }), ...(pozicioni && { pozicioni }), ...(fabrikaId !== undefined && { fabrikaId }), ...(paga !== undefined && { paga }), ...(dataPunesimit && { dataPunesimit }) };
  res.json(data.punetoret[index]);
});

app.delete('/punetoret/:id', (req, res) => {
  const index = data.punetoret.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Punëtori nuk u gjet' });
  }
  data.punetoret.splice(index, 1);
  res.json({ message: 'Punëtori u fshi me sukses' });
});

app.listen(PORT, () => {
  console.log(`Factory Service running on http://localhost:${PORT}`);
});

