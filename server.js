const express = require('express');

const app = express();

//parse json req body
app.use(express.json());

//logger middleware
function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}

app.use(logger);

//product data
const products = [
    { id: 1, name: "laptop", price: 45000 },
    { id: 2, name: "mouse", price: 400 },
    { id: 3, name: "keyboard", price: 800 },
];

//get
app.get('/', (req, res) => {
    res.send("welcome to my server!");
});

//get/products
app.get('/products', (req, res) => {
    res.json(products)
});

app.get('/products/:id', (req, res) => {
    const id = Number(req.params.id);

    const product = products.find((product) => product.id === id);
    if (!product) {
        return res.status(404).json({
            message: "product not found."
        });

    }
    res.json(product);
});

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    if (!name || typeof price !== "number" || price <= 0) {
        return res.status(400).json({
            message: "Invalid name or price!"
        });
    }
    const newProduct = {
        id: products.length + 1,
        name,
        price,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

//start server
app.listen(3000, () => {
    console.log("Server is running from http://localhost:3000")
});