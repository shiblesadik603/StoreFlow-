const express = require('express');
const router = express.Router();

const products = require('../data/products');


// GET /products
router.get('/', (req, res) => {
    res.json(products);
});


// GET /products/:id
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);

    const product = products.find((product) => product.id === id);

    if (!product) {
        return res.status(404).json({
            message: "product not found."
        });
    }

    res.json(product);
});


// POST /products
router.post('/', (req, res) => {
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


// PUT /products/:id
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "product not found!"
        });
    }

    const { name, price } = req.body;

    if (!name || typeof price !== "number" || price <= 0) {
        return res.status(400).json({
            message: "Invalid name or price!"
        });
    }

    product.name = name;
    product.price = price;

    res.json(product);
});


// DELETE /products/:id
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "product not found."
        });
    }

    products.splice(index, 1);

    res.status(204).send();
});


module.exports = router;