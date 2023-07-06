const express = require('express');
const path = require('path');
const app = express();
// const {result, a} = require('../JOSAA/josaa.js')

// console.log(a)

// Server configuration and routes will be added here

// Start the server
const port = 3000; // or any other port number
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, '/public/index.html');
    res.sendFile(htmlPath);
});

const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
];



// Get all items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// Get a single item by ID
app.get('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = items.find(item => item.id === itemId);

    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
});




