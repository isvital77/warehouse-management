// טעינת ספריות נדרשות
const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');

// יצירת אפליקציית Express
const app = express();
const PORT = process.env.PORT || 5000; // פורט ברירת מחדל או הפורט של הסביבה

// הגדרת שימוש ב-body-parser לטיפול ב-JSON
app.use(bodyParser.json());

// קריאה לקובץ Excel (נתיב לדוגמה)
const workbook = xlsx.readFile('inventory_data.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// המרת נתונים מקובץ ה-Excel למבנה JSON
const inventoryData = xlsx.utils.sheet_to_json(worksheet);

// **Routes - נתיבי ה-API**

// ברירת מחדל - דף הבית
app.get('/', (req, res) => {
  res.send('מערכת ניהול מחסנים פועלת בהצלחה!');
});

// הצגת כל הנתונים מהמחסן
app.get('/api/inventory', (req, res) => {
  res.json(inventoryData);
});

// חיפוש מוצר לפי שם
app.get('/api/inventory/search', (req, res) => {
  const { name } = req.query;
  const filteredData = inventoryData.filter(item =>
    item['product Name'] && item['product Name'].includes(name)
  );

  if (filteredData.length > 0) {
    res.json(filteredData);
  } else {
    res.status(404).send('המוצר לא נמצא');
  }
});

// הוספת פריט חדש
app.post('/api/inventory', (req, res) => {
  const newItem = req.body;
  if (newItem && newItem['product Name']) {
    inventoryData.push(newItem);
    res.status(201).send('המוצר נוסף בהצלחה');
  } else {
    res.status(400).send('הנתונים שגויים');
  }
});

// הרצת השרת
app.listen(PORT, () => {
  console.log(`🔥 השרת פעיל בכתובת: http://localhost:${PORT}`);
});
