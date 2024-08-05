const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Endpoint per recuperare il menu
app.get('/menu', (req, res) => {
    fs.readFile(path.join(__dirname, 'menu.json'), (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Errore nel recupero del menu.' });
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint per gestire gli ordini
app.post('/orders', (req, res) => {
    const order = req.body;
    const ordersFilePath = path.join(__dirname, 'orders.json');

    fs.readFile(ordersFilePath, (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ error: 'Errore nel recupero degli ordini.' });
        }

        const orders = data ? JSON.parse(data) : [];
        orders.push(order);

        fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Errore nella scrittura dell\'ordine.' });
            }
            res.status(201).json({ message: 'Ordine inviato con successo!' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
