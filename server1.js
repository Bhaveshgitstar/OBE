const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017';
const dbName = 'course_outcome';
const collectionName = '21B12CS318_t1';

async function getDataFromMongoDB() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const data = await collection.find().toArray();
        return data;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    } finally {
        client.close();
    }
}

app.get('/', async (req, res) => {
    const data = await getDataFromMongoDB();

    if (data.length === 0) {
        res.send('No data found in the database.');
        return;
    }

    // Extract unique CO_codes and sort them
    const coCodes = [...new Set(data.map(item => item.CO_code))].sort();

    // Create arrays to hold Quesno, Marks, and CO_code values
    const quesnoDisplay = [];
    const marks = [];
    const coCode = [];

    // Populate the arrays with data
    coCodes.forEach(coCode => {
        const coData = data.filter(item => item.CO_code === coCode);
        quesnos.push(coData.map(item => item.Quesno).join(' '));
        quesnos.push(coData.map(item => item.Quesno).join(' '));
        coCode.push(coData.map(item => item.Marks).join(' '));
        coCodesDisplay.push(coCode);
    });

    // Generate the table dynamically
    let tableHtml = '<table style="border-collapse: collapse; width: 100%; border: 1px solid #000;">';

    // Add Quesno row
    tableHtml += '<tr>';
    tableHtml += `<td style="border: 1px solid #000; padding: 8px;">QUESNO</td>`;
    tableHtml += `<td style="border: 1px solid #000; padding: 8px; border-left: 1px solid #000;">${quesnos.join('</td><td style="border: 1px solid #000; padding: 8px; border-left: 1px solid #000;">')}</td>`;
    tableHtml += '</tr>';

    // Add Marks row
    tableHtml += '<tr>';
    tableHtml += `<td style="border: 1px solid #000; padding: 8px;">MARKS</td>`;
    tableHtml += `<td style="border: 1px solid #000; padding: 8px; border-left: 1px solid #000;">${marks.join('</td><td style="border: 1px solid #000; padding: 8px; border-left: 1px solid #000;">')}</td>`;
    tableHtml += '</tr>';

    // Add CO_code row
    tableHtml += '<tr>';
    tableHtml += `<td style="border: 1px solid #000; padding: 8px;">CO_CODE</td>`;
    tableHtml += `<td style="border: 1px solid #000; padding: 8px; border-left: 1px solid #000;">${coCodesDisplay.join('</td><td style="border: 1px solid #000; padding: 8px; border-left: 1px solid #000;">')}</td>`;
    tableHtml += '</tr>';

    tableHtml += '</table>';

    res.send(tableHtml);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
