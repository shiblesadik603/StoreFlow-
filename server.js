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


app.put('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ message: "product not found!" })
    }
    const { name, price } = req.body;
    if (!name || typeof price !== "number" || price <= 0) {
        return res.status(400).json({ message: "Invalid name or price!" })
    }
    product.name = name;
    product.price = price;
    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "product not found." });
    }
    products.splice(index, 1);
    res.status(204).send();
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

//test error route
app.get('/crash-sync', (req, res) => {
    throw new Error("sync-crash!");
})

app.get('/crash-async', async (req, res) => {
    await Promise.reject(new Error("async crash!"));
})

// Error-handling middleware — MUST BE LAST
app.use((err, req, res, next) => {
    console.log(err.message)
    res.status(500).json({
        message: "Internal server error!"
    });
});

//start server
app.listen(3000, () => {
    console.log("Server is running from http://localhost:3000")
});