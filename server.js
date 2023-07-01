const express = require('express');
const path = require('path');
const app = express();

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