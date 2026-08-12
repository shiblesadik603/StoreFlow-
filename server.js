const express = require('express');
const app = express();

// //GET
// app.get('/', (req, res) => {
//     res.send("welcome to the express server.")
// });

// //GET/products
// app.get("/products", (req, res) => {
//     const products = [
//         { id: 1, name: "laptop", price: 1200 },
//         { id: 2, name: "mouse", price: 200 }
//     ];
//     res.json(products);
// });

// //start server
// app.listen(3000, () => {
//     console.log("Server is running on http://localhost:3000");
// });

const products = [
    { id: 1, name: "laptop", price: 1200 },
    { id: 2, name: "mouse", price: 200 }
];
app.get("/products", (req, res) => {

    res.json(products);
});

app.get("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find((product) => product.id === id);

    if (!product) {
        return res.status(404).json({
            message: "product not found."
        })
    }
    res.json(product);
})



app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});