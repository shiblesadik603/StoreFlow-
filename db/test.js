const pool = require('./connection');

async function main() {
    const result = await pool.query('SELECT * FROM products');
    console.log(result.rows);
    process.exit();
}

main();