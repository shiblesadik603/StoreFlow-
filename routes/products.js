const express = require('express');
const router = express.Router();

//const products = require('../data/products');
const pool = require('../db/connection');

// GET /products
// router.get('/', (req, res) => {
//     res.json(products);
// });
router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
})

// GET /products/:id
// router.get('/:id', (req, res) => {
//     const id = Number(req.params.id);

//     const product = products.find((product) => product.id === id);

//     if (!product) {
//         return res.status(404).json({
//             message: "product not found."
//         });
//     }

//     res.json(product);
// });
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    const result = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "product not found."
        });
    }
    res.json(result.rows[0])
})


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


    if (result.rows.length === 0) {
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