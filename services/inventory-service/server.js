const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;


app.use(cors());
app.use(express.json());


let data = {
  stoku: [
    { id: 1, produktId: 1, sasia: 5000, minimumi: 200, lokacioni: 'PlusMetal-1' },
    { id: 2, produktId: 2, sasia: 1500, minimumi: 150, lokacioni: 'PlusMetal-1' }
  ]
};

const getNextId = (collection) => {
  if (collection.length === 0) return 1;
  return Math.max(...collection.map(item => item.id)) + 1;
};


app.get('/stoku', (req, res) => {
  res.json(data.stoku);
});

app.get('/stoku/:id', (req, res) => {
  const stoku = data.stoku.find(s => s.id === parseInt(req.params.id));
  if (!stoku) {
    return res.status(404).json({ message: 'Nuk ka stok' });
  }
  res.json(stoku);
});

app.get('/stoku/produkt/:produktId', (req, res) => {
  const stoku = data.stoku.find(s => s.produktId === parseInt(req.params.produktId));
  if (!stoku) {
    return res.status(404).json({ message: 'Nuk ka stok per kete produkt' });
  }
  res.json(stoku);
});

app.get('/stoku/low-stock', (req, res) => {
  const lowStock = data.stoku.filter(s => s.sasia <= s.minimumi);
  res.json(lowStock);
});

app.post('/stoku', (req, res) => {
  const { produktId, sasia, minimumi, lokacioni } = req.body;
  if (!produktId || sasia === undefined) {
    return res.status(400).json({ message: 'ProduktId dhe sasia janë të detyrueshme' });
  }
  const newStoku = {
    id: getNextId(data.stoku),
    produktId,
    sasia,
    minimumi: minimumi || 0,
    lokacioni: lokacioni || ''
  };
  data.stoku.push(newStoku);
  res.status(201).json(newStoku);
});

app.put('/stoku/:id', (req, res) => {
  const index = data.stoku.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Stoku nuk u gjet' });
  }
  const { produktId, sasia, minimumi, lokacioni } = req.body;
  data.stoku[index] = { 
    ...data.stoku[index], 
    ...(produktId !== undefined && { produktId }), 
    ...(sasia !== undefined && { sasia }), 
    ...(minimumi !== undefined && { minimumi }), 
    ...(lokacioni !== undefined && { lokacioni }) 
  };
  res.json(data.stoku[index]);
});

app.patch('/stoku/:id/update-quantity', (req, res) => {
  const index = data.stoku.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Stoku nuk u gjet' });
  }
  const { sasia } = req.body;
  if (sasia === undefined) {
    return res.status(400).json({ message: 'Sasia është e detyrueshme' });
  }
  data.stoku[index].sasia = sasia;
  res.json(data.stoku[index]);
});

app.delete('/stoku/:id', (req, res) => {
  const index = data.stoku.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Stoku nuk u gjet' });
  }
  data.stoku.splice(index, 1);
  res.json({ message: 'Stoku u fshi me sukses' });
});

app.listen(PORT, () => {
  console.log(`Inventory Service running on http://localhost:${PORT}`);
});

