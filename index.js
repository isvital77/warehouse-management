const express = require('express'); // ייבוא Express
const bodyParser = require('body-parser'); // ייבוא Body Parser
const path = require('path'); // לעבודה עם נתיבי קבצים
const xlsx = require('xlsx'); // לעבודה עם אקסל

const app = express();
const PORT = 5001; // הגדרת פורט השרת

// שימוש ב-bodyParser לפורמט JSON
app.use(bodyParser.json());

// מסלול ברירת מחדל
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// רשימה לשמירת המוצרים
const products = [];

// מסלול POST להוספת מוצר
app.post('/add-product', (req, res) => {
    const { id, name, price } = req.body;
    if (!id || !name || !price) {
        res.status(400).send('Missing fields: id, name, or price');
        return;
    }

    const product = { id, name, price };
    products.push(product);
    console.log('New product added:', product);
    res.status(201).send(`Product added: ${JSON.stringify(product)}`);
});

// מסלול GET להחזרת כל המוצרים
app.get('/products', (req, res) => {
    res.json(products);
});

// מסלול DELETE למחיקת מוצר לפי ID
app.delete('/delete-product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(product => product.id === productId);

    if (index !== -1) {
        products.splice(index, 1);
        res.send(`Product with ID ${productId} deleted`);
    } else {
        res.status(404).send(`Product with ID ${productId} not found`);
    }
});

// קריאת נתונים מקובץ אקסל
const filePath = path.join(__dirname, 'inventory_data.xlsx');
try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log('Loaded data from Excel:', data);
} catch (error) {
    console.error('Error reading Excel file:', error.message);
}

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
