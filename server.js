const express = require('express');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');

const app = express();

//parse json req body
app.use(express.json());

app.use(logger);

app.use('/auth', authRouter);


//logger middleware
function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}
app.use('/products', productsRouter);


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