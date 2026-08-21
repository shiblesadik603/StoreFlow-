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
router.post('/', async (req, res) => {
    const { name, price } = req.body;

    if (!name || typeof price !== "number" || price <= 0) {
        return res.status(400).json({
            message: "Invalid name or price!"
        });
    }

    // const newProduct = {
    //     id: products.length + 1,
    //     name,
    //     price,
    // };
    const result = await pool.query(
        'INSERT INTO products (name,price) VALUES ($1,$2) RETURNING *', [name, price]
    );

    res.status(201).json(result.rows[0]);
});


// PUT /products/:id
router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { name, price } = req.body;

    if (!name || typeof price !== "number" || price <= 0) {
        return res.status(400).json({
            message: "Invalid name or price!"
        });
    }

    const result = await pool.query(
        'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *',
        [name, price, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "product not found!"
        });
    }

    res.json(result.rows[0]);
});


// DELETE /products/:id
router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);

    const result = await pool.query(
        'DELETE FROM products WHERE ID = $1',
        [id]
    );

    if (result.rowCount === 0) {
        return res.status(404).json({
            message: "product not found."
        });
    }

    res.status(204).send();
});


module.exports = router;