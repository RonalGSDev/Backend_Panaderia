const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ENRUTAMIENTO EXACTO
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/pan', require('./routes/pan'));
app.use('/api/locales', require('./routes/locales'));
app.use('/api/dias', require('./routes/dias'));

app.listen(3000, () => console.log('🚀 Backend funcionando en http://localhost:3000'));