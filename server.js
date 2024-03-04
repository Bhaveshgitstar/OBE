const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const readXlsxFile = require('read-excel-file/node');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const fs = require('fs');
const svgCaptcha = require('svg-captcha');

const app = express();
// Set EJS as the view engine
app.set('view engine', 'ejs');
// Specify the directory where your views/templates are located
app.set('views', path.join(__dirname, 'frontend'));
app.use(bodyParser.json());

// Establish the connection to the educational_platform database
const educationalPlatformDb = mongoose.createConnection('mongodb+srv://bhasha12:cLU4rWC63vJIWt3o@obedoc.yjscp0h.mongodb.net/educational_platform', { useNewUrlParser: true, useUnifiedTopology: true });

educationalPlatformDb.once('open', () => {
    console.log('Connected to educational_platform database');
});

educationalPlatformDb.on('error', (err) => {
    console.error('Error connecting to educational_platform database:', err);
});

// Session store
const store = new MongoDBSession({
    uri: 'mongodb+srv://bhasha12:cLU4rWC63vJIWt3o@obedoc.yjscp0h.mongodb.net/educational_platform_sessions',
    collection: 'sessions'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        secure: false,
        maxAge: 30 * 60 * 1000, // 30 minutes (adjust as needed)
    }
}));

function checkSessionTimeout(req, res, next) {
    console.log('Session:', req.session);
    if (req.session.user && req.session.cookie.maxAge <= 0) {
        console.log('Session has timed out');
        // Session has timed out
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.redirect('/logout'); // Redirect to the home page or login page
        });
    } else {
        next(); // Continue with the request
    }
}

const eduUserSchema = new mongoose.Schema({
    username: String,
    password: String,
    User: String,
    Role: Array,
    Course: Array,
    Department:String

});
const EduUser = educationalPlatformDb.model('User', eduUserSchema);

// Establish the connection to the course_outcome database
const courseOutcomeDb = mongoose.createConnection('mongodb+srv://bhasha12:cLU4rWC63vJIWt3o@obedoc.yjscp0h.mongodb.net/course_outcome', { useNewUrlParser: true, useUnifiedTopology: true });

courseOutcomeDb.once('open', () => {
    console.log('Connected to course_outcome database');
});

courseOutcomeDb.on('error', (err) => {
    console.error('Error connecting to course_outcome database:', err);
});

// Define module schema for course_outcome
const courseOutcomeModuleSchema = new mongoose.Schema(
    {
        ModuleNo: Number,
        ModuleTitle: String,
        Topics: String,
        NoOfLectures: Number
    },
    { versionKey: false }
);

const courseSchema = new mongoose.Schema(
    {
        coid: String,
        cotitle: String,
        colevels: String,
        PO1: Number,
        PO2: Number,
        PO3: Number,
        PO4: Number,
        PO5: Number,
        PO6: Number,
        PO7: Number,
        PO8: Number,
        PO9: Number,
        PO10: Number,
        PO11: Number,
        PO12: Number,
        PSO1: Number,
        PSO2: Number

    },
    { versionKey: false }
);
const cdSchema = new mongoose.Schema(
    {
        co_code: String,
        sem: String,
        co_name: String,
        credits: Number,
        contact_hours: String,
        coordinators: Array,
        teachers:Array
    },
    { versionKey: false }
);

const attainmentT1Schema = new mongoose.Schema(
    {
        ModuleNo: String,
        RollNo: String,
        Name: String,
        Batch: String,
        Q1: String,
        Q2: String,
        Q3: String,
        Q4: String,
        Q5: String,
        Q6: String,
        Q7: String,
        Q8: String,
        Q9: String,
        Q10: String,
        Q11: String,
        Q12: String,
        Q13: String,
        Total: Number,
        Attainment1: Number,
        Attainment2: Number,
        Attainment3: Number
    },
    { versionKey: false }
);

const copoSchema = new mongoose.Schema({
    COs: String,
    T1: Number,
    T2: Number,
    T3: Number,
    'T-AVG': Number, // Avg. of T1, T2, and T3
    Project: Number,
    Quiz: Number,
    'Assgn-AVG': Number, // Avg. of Assignments/Project
    'Direct Attainment': Number, // 60% T-AVG + 20% Assgn-AVG
    'Student Feedback': String, // Assuming this is a string, update it according to your needs
    Final: Number, // Direct + 20% Indirect
    CIE: Number,
    SIE: Number,

}, { versionKey: false });
const coposoSchema = new mongoose.Schema({
    COs: String,
    COAttainments: Number,
    PO1: Number,
    PO2: Number,
    PO3: Number,
    PO4: Number,
    PO5: Number,
    PO6: Number,
    PO7: Number,
    PO8: Number,
    PO9: Number,
    PO10: Number,
    PO11: Number,
    PO12: Number,
    PSO1: Number,
    PSO2: Number
}, { versionKey: false });
const coposoatSchema = new mongoose.Schema({
    Course: String,
    PO1: Number,
    PO2: Number,
    PO3: Number,
    PO4: Number,
    PO5: Number,
    PO6: Number,
    PO7: Number,
    PO8: Number,
    PO9: Number,
    PO10: Number,
    PO11: Number,
    PO12: Number,
    PSO1: Number,
    PSO2: Number
}, { versionKey: false });


const attainmentT1Schemaco = new mongoose.Schema(
    {
        ModuleNo: String,
        RollNo: String,
        Name: String,
        Batch: String,
        Q1: String,
        Q2: String,
        Q3: String,
        Q4: String,
        Q5: String,
        Q6: String,
        Q7: String,
        Q8: String,
        Q9: String,
        Q10: String,
        Q11: String,
        Q12: String,
        Q13: String,
        Total: Number,
        Attainment1:  String,
        Attainment2: String,
        Attainment3: String
    },
    { versionKey: false }
);

const courseschema = new mongoose.Schema({
    co_code: String,
    sem: String,
    co_name: String,
    credits: Number,
    contact_hours: String,
    coordinators: [String], // Assuming coordinators is an array of strings
    teachers: [String],
    Branch: String,
    NBAcode: String,
    Year: Number,
},
{ versionKey: false });
app.use(express.static(path.join(__dirname, 'frontend')));
const upload = multer({ dest: 'uploads/' });




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'adminlogin.html'));
});

const createSchema = (headers) => {
    const schemaFields = {
        ModuleNo: String,
        RollNo: String,
        Name: String,
        Batch: String,
        Total: Number,
        Attainment1: Number,
        Attainment2: Number,
        Attainment3: Number,
        Attainment4: Number
    };

    headers.forEach((header, index) => {
        if (header.toLowerCase().startsWith('q')) {
            const questionNumber = header.match(/Q(\d+)/i);
            if (questionNumber) {
                const fieldName = `Q${questionNumber[1]}`;
                schemaFields[fieldName] = Number; // Store as a Number
            }
        }
        if(header.match(/^Total(\d+)/i)){
                const fieldName = 'Total';
                schemaFields[fieldName] = Number; 
                console.log(fieldName)// Store as a Number
        }
    
});

    return new mongoose.Schema(schemaFields, { versionKey: false });
};
function isValidNumber(value) {
    // Check if the value is a valid number
    return !isNaN(parseFloat(value)) && isFinite(value);
}

app.get('/generate-sample-excel', async (req, res) => {
    try {
        const c= req.query.code+"_t1co";
        const AttainmentModel = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);
        const firstDocument = await AttainmentModel.findOne();

        if (!firstDocument) {
            throw new Error('No documents found in the collection.');
        }

        // Extract the schema fields from the first document
        const schemaFields = Object.keys(firstDocument.toObject());

        // Create an array to hold the columns in the desired order
        const columnsInOrder = [];

        // Iterate through the schema fields and add them to columnsInOrder


        // Add other fields as needed
        columnsInOrder.push('ModuleNo', 'RollNo', 'Name', 'Batch');

        schemaFields.forEach((field) => {
            // Check if the field is a "Q" field (e.g., Q1, Q2, Q3)
            if (field.match(/^Q\d+$/i)) {
                // Add the "Q" field to columnsInOrder
                columnsInOrder.push(field);
            }
        });
        
        columnsInOrder.push('Total');

        schemaFields.forEach((field) => {
            // Check if the field is a "Q" field (e.g., Q1, Q2, Q3)
            if (field.match(/^Attainment\d+$/i)) {
                // Add the "Q" field to columnsInOrder
                columnsInOrder.push(field);
            }
        });



        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('SampleData');

        // Define cell border styles
        const borderStyle = {
            style: 'thin',
            color: { argb: '000000' }, // Black color for borders
        };

        // Apply borders to header row
        const headerRow = worksheet.addRow(columnsInOrder);
        headerRow.eachCell((cell) => {
            cell.border = {
                top: borderStyle,
                left: borderStyle,
                bottom: borderStyle,
                right: borderStyle,
            };
        });

        // Add 20 empty rows to the worksheet and apply borders
        for (let i = 0; i < 20; i++) {
            const emptyRow = worksheet.addRow([]);
            emptyRow.eachCell((cell) => {
                cell.border = {
                    top: borderStyle,
                    left: borderStyle,
                    bottom: borderStyle,
                    right: borderStyle,
                };
            });
        }

        const timestamp = new Date().getTime();
        const filename = `sample_excel_${timestamp}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating sample Excel:', error);
        res.status(500).send('Error generating Excel file');
    }
});
app.get('/generate-sample-excelt2', async (req, res) => {
    try {
        const c= req.query.code+"_t2co";
        const AttainmentModel = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
        const firstDocument = await AttainmentModel.findOne();

        if (!firstDocument) {
            throw new Error('No documents found in the collection.');
        }

        // Extract the schema fields from the first document
        const schemaFields = Object.keys(firstDocument.toObject());

        // Create an array to hold the columns in the desired order
        const columnsInOrder = [];

        // Iterate through the schema fields and add them to columnsInOrder


        // Add other fields as needed
        columnsInOrder.push('ModuleNo', 'RollNo', 'Name', 'Batch');

        schemaFields.forEach((field) => {
            // Check if the field is a "Q" field (e.g., Q1, Q2, Q3)
            if (field.match(/^Q\d+$/i)) {
                // Add the "Q" field to columnsInOrder
                columnsInOrder.push(field);
            }
        });
        
        columnsInOrder.push('Total');

        schemaFields.forEach((field) => {
            // Check if the field is a "Q" field (e.g., Q1, Q2, Q3)
            if (field.match(/^Attainment\d+$/i)) {
                // Add the "Q" field to columnsInOrder
                columnsInOrder.push(field);
            }
        });



        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('SampleData');

        // Define cell border styles
        const borderStyle = {
            style: 'thin',
            color: { argb: '000000' }, // Black color for borders
        };

        // Apply borders to header row
        const headerRow = worksheet.addRow(columnsInOrder);
        headerRow.eachCell((cell) => {
            cell.border = {
                top: borderStyle,
                left: borderStyle,
                bottom: borderStyle,
                right: borderStyle,
            };
        });

        // Add 20 empty rows to the worksheet and apply borders
        for (let i = 0; i < 20; i++) {
            const emptyRow = worksheet.addRow([]);
            emptyRow.eachCell((cell) => {
                cell.border = {
                    top: borderStyle,
                    left: borderStyle,
                    bottom: borderStyle,
                    right: borderStyle,
                };
            });
        }

        const timestamp = new Date().getTime();
        const filename = `sample_excel_${timestamp}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating sample Excel:', error);
        res.status(500).send('Error generating Excel file');
    }
});
app.get('/generate-sample-excelt3', async (req, res) => {
    try {
        const c= req.query.code+"_t3co";
        const AttainmentModel = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
        const firstDocument = await AttainmentModel.findOne();

        if (!firstDocument) {
            throw new Error('No documents found in the collection.');
        }

        // Extract the schema fields from the first document
        const schemaFields = Object.keys(firstDocument.toObject());

        // Create an array to hold the columns in the desired order
        const columnsInOrder = [];

        // Iterate through the schema fields and add them to columnsInOrder


        // Add other fields as needed
        columnsInOrder.push('ModuleNo', 'RollNo', 'Name', 'Batch');

        schemaFields.forEach((field) => {
            // Check if the field is a "Q" field (e.g., Q1, Q2, Q3)
            if (field.match(/^Q\d+$/i)) {
                // Add the "Q" field to columnsInOrder
                columnsInOrder.push(field);
            }
        });
        
        columnsInOrder.push('Total');

        schemaFields.forEach((field) => {
            // Check if the field is a "Q" field (e.g., Q1, Q2, Q3)
            if (field.match(/^Attainment\d+$/i)) {
                // Add the "Q" field to columnsInOrder
                columnsInOrder.push(field);
            }
        });



        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('SampleData');

        // Define cell border styles
        const borderStyle = {
            style: 'thin',
            color: { argb: '000000' }, // Black color for borders
        };

        // Apply borders to header row
        const headerRow = worksheet.addRow(columnsInOrder);
        headerRow.eachCell((cell) => {
            cell.border = {
                top: borderStyle,
                left: borderStyle,
                bottom: borderStyle,
                right: borderStyle,
            };
        });

        // Add 20 empty rows to the worksheet and apply borders
        for (let i = 0; i < 20; i++) {
            const emptyRow = worksheet.addRow([]);
            emptyRow.eachCell((cell) => {
                cell.border = {
                    top: borderStyle,
                    left: borderStyle,
                    bottom: borderStyle,
                    right: borderStyle,
                };
            });
        }

        const timestamp = new Date().getTime();
        const filename = `sample_excel_${timestamp}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating sample Excel:', error);
        res.status(500).send('Error generating Excel file');
    }
});
app.get('/generate-sample-excelta', async (req, res) => {
    try {
        const c= req.query.code+"_taco";
        const AttainmentModel = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
        const firstDocument = await AttainmentModel.findOne();

        if (!firstDocument) {
            throw new Error('No documents found in the collection.');
        }

        // Extract the schema fields from the first document
        const schemaFields = Object.keys(firstDocument.toObject());

        // Create an array to hold the columns in the desired order
        const columnsInOrder = [];

        // Iterate through the schema fields and add them to columnsInOrder


        // Add other fields as needed
        columnsInOrder.push('ModuleNo', 'RollNo', 'Name', 'Batch');

        schemaFields.forEach((field) => {
            // Check if the field is a "Q" field (e.g., Q1, Q2, Q3)
            if (field.match(/^Q\d+$/i)) {
                // Add the "Q" field to columnsInOrder
                columnsInOrder.push(field);
            }
        });
        
        columnsInOrder.push('Total');

        schemaFields.forEach((field) => {
            // Check if the field is a "Q" field (e.g., Q1, Q2, Q3)
            if (field.match(/^Attainment\d+$/i)) {
                // Add the "Q" field to columnsInOrder
                columnsInOrder.push(field);
            }
        });



        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('SampleData');

        // Define cell border styles
        const borderStyle = {
            style: 'thin',
            color: { argb: '000000' }, // Black color for borders
        };

        // Apply borders to header row
        const headerRow = worksheet.addRow(columnsInOrder);
        headerRow.eachCell((cell) => {
            cell.border = {
                top: borderStyle,
                left: borderStyle,
                bottom: borderStyle,
                right: borderStyle,
            };
        });

        // Add 20 empty rows to the worksheet and apply borders
        for (let i = 0; i < 20; i++) {
            const emptyRow = worksheet.addRow([]);
            emptyRow.eachCell((cell) => {
                cell.border = {
                    top: borderStyle,
                    left: borderStyle,
                    bottom: borderStyle,
                    right: borderStyle,
                };
            });
        }

        const timestamp = new Date().getTime();
        const filename = `sample_excel_${timestamp}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating sample Excel:', error);
        res.status(500).send('Error generating Excel file');
    }
});
app.post('/upload', upload.single('file'), (req, res) => {
    const c= req.query.code+"_at";
    readXlsxFile(req.file.path)
        .then(async (rows) => {
            try {

                await courseOutcomeDb.collection(c).deleteMany({});

                let headerIndex = -1;
                let headers = [];
                let foundHeader = false;

                // Find the header row with the "SRMO" column
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];

                    if (!row) {
                        // Skip null or empty rows
                        continue;
                    }

                    if (row.includes('ModuleNo') && row.includes('RollNo') && row.includes('Name')) {
                        // Save the index of the header row
                        headerIndex = i;
                        headers = row.map((header) => header.trim());
                        foundHeader = true;
                        break;
                    }
                }

                if (!foundHeader) {
                    throw new Error('Header row not found in the Excel file.');
                }

                const AttainmentModel = courseOutcomeDb.model('CourseOutcomeModule', createSchema(headers), c);

                const documents = [];

                for (let i = headerIndex + 1; i < rows.length; i++) {
                    const row = rows[i];

                    if (!row) {
                        // Skip null or empty rows
                        continue;
                    }

                    const rowData = {};
// ...
    headers.forEach((header, index) => {
    const questionNumber = header.match(/Q(\d+)/i);
    const total = header.match(/^Total(\d+)/i); // Check for "Total" at the beginning

    if (questionNumber) {
        const fieldName = `Q${questionNumber[1]}`;
        rowData[fieldName] = isValidNumber(row[index]) ? parseFloat(row[index]) : 0;
    } else if (total) {
        const fieldName = 'Total';
        rowData[fieldName] = isValidNumber(row[index]) ? parseFloat(row[index]) : 0;
    } else if (header.toLowerCase() === 'sr.no.') {
        rowData['ModuleNo'] = row[index];
    } else if (header.toLowerCase() === 'roll no.') {
        rowData['RollNo'] = row[index];
    } else {
        rowData[header] = row[index];
    }
    });
// ...
                    documents.push(rowData);
                }

                console.log('Documents:', documents);

                const insertResult = await AttainmentModel.insertMany(documents);


                res.send({ rowCount: insertResult.length });
            } catch (error) {
                console.error('MongoDB Error:', error);
                res.status(500).send('Error inserting data into MongoDB');
            }
        })
        .catch((error) => {
            console.error('Excel Parsing Error:', error);
            res.status(500).send('Error parsing Excel file');
        });
});


app.post('/uploadt2', upload.single('file'), (req, res) => {
    const c= req.query.code+"_at2";
    readXlsxFile(req.file.path)
        .then(async (rows) => {
            try {

                await courseOutcomeDb.collection(c).deleteMany({});

                let headerIndex = -1;
                let headers = [];
                let foundHeader = false;

                // Find the header row with the "SRMO" column
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];

                    if (!row) {
                        // Skip null or empty rows
                        continue;
                    }

                    if (row.includes('Sr.No.') && row.includes('Roll No.') && row.includes('Name')) {
                        // Save the index of the header row
                        headerIndex = i;
                        headers = row.map((header) => header.trim());
                        foundHeader = true;
                        break;
                    }
                }

                if (!foundHeader) {
                    throw new Error('Header row not found in the Excel file.');
                }

                const AttainmentModel = courseOutcomeDb.model('CourseOutcomeModule', createSchema(headers), c);

                const documents = [];

                for (let i = headerIndex + 1; i < rows.length; i++) {
                    const row = rows[i];

                    if (!row) {
                        // Skip null or empty rows
                        continue;
                    }

                    const rowData = {};
// ...
    headers.forEach((header, index) => {
    const questionNumber = header.match(/Q(\d+)/i);
    const total = header.match(/^Total(\d+)/i); // Check for "Total" at the beginning

    if (questionNumber) {
        const fieldName = `Q${questionNumber[1]}`;
        rowData[fieldName] = isValidNumber(row[index]) ? parseFloat(row[index]) : 0;
    } else if (total) {
        const fieldName = 'Total';
        rowData[fieldName] = isValidNumber(row[index]) ? parseFloat(row[index]) : 0;
    } else if (header.toLowerCase() === 'sr.no.') {
        rowData['ModuleNo'] = row[index];
    } else if (header.toLowerCase() === 'roll no.') {
        rowData['RollNo'] = row[index];
    } else {
        rowData[header] = row[index];
    }
    });
// ...
                    documents.push(rowData);
                }

                console.log('Documents:', documents);

                const insertResult = await AttainmentModel.insertMany(documents);


                res.send({ rowCount: insertResult.length });
            } catch (error) {
                console.error('MongoDB Error:', error);
                res.status(500).send('Error inserting data into MongoDB');
            }
        })
        .catch((error) => {
            console.error('Excel Parsing Error:', error);
            res.status(500).send('Error parsing Excel file');
        });
});

app.post('/uploadt3', upload.single('file'), (req, res) => {
    const c= req.query.code+"_at3";
    readXlsxFile(req.file.path)
        .then(async (rows) => {
            try {

                await courseOutcomeDb.collection(c).deleteMany({});

                let headerIndex = -1;
                let headers = [];
                let foundHeader = false;

                // Find the header row with the "SRMO" column
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];

                    if (!row) {
                        // Skip null or empty rows
                        continue;
                    }

                    if (row.includes('Sr.No.') && row.includes('Roll No.') && row.includes('Name')) {
                        // Save the index of the header row
                        headerIndex = i;
                        headers = row.map((header) => header.trim());
                        foundHeader = true;
                        break;
                    }
                }

                if (!foundHeader) {
                    throw new Error('Header row not found in the Excel file.');
                }

                const AttainmentModel = courseOutcomeDb.model('CourseOutcomeModule', createSchema(headers), c);

                const documents = [];

                for (let i = headerIndex + 1; i < rows.length; i++) {
                    const row = rows[i];

                    if (!row) {
                        // Skip null or empty rows
                        continue;
                    }

                    const rowData = {};
// ...
    headers.forEach((header, index) => {
    const questionNumber = header.match(/Q(\d+)/i);
    const total = header.match(/^Total(\d+)/i); // Check for "Total" at the beginning

    if (questionNumber) {
        const fieldName = `Q${questionNumber[1]}`;
        rowData[fieldName] = isValidNumber(row[index]) ? parseFloat(row[index]) : 0;
    } else if (total) {
        const fieldName = 'Total';
        rowData[fieldName] = isValidNumber(row[index]) ? parseFloat(row[index]) : 0;
    } else if (header.toLowerCase() === 'sr.no.') {
        rowData['ModuleNo'] = row[index];
    } else if (header.toLowerCase() === 'roll no.') {
        rowData['RollNo'] = row[index];
    } else {
        rowData[header] = row[index];
    }
    });
// ...
                    documents.push(rowData);
                }

                console.log('Documents:', documents);

                const insertResult = await AttainmentModel.insertMany(documents);


                res.send({ rowCount: insertResult.length });
            } catch (error) {
                console.error('MongoDB Error:', error);
                res.status(500).send('Error inserting data into MongoDB');
            }
        })
        .catch((error) => {
            console.error('Excel Parsing Error:', error);
            res.status(500).send('Error parsing Excel file');
        });
});
app.post('/uploadta', upload.single('file'), (req, res) => {
    const c= req.query.code+"_ata";
    readXlsxFile(req.file.path)
        .then(async (rows) => {
            try {

                await courseOutcomeDb.collection(c).deleteMany({});

                let headerIndex = -1;
                let headers = [];
                let foundHeader = false;

                // Find the header row with the "SRMO" column
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];

                    if (!row) {
                        // Skip null or empty rows
                        continue;
                    }

                    if (row.includes('Sr.No.') && row.includes('Roll No.') && row.includes('Name')) {
                        // Save the index of the header row
                        headerIndex = i;
                        headers = row.map((header) => header.trim());
                        foundHeader = true;
                        break;
                    }
                }

                if (!foundHeader) {
                    throw new Error('Header row not found in the Excel file.');
                }

                const AttainmentModel = courseOutcomeDb.model('CourseOutcomeModule', createSchema(headers), c);

                const documents = [];

                for (let i = headerIndex + 1; i < rows.length; i++) {
                    const row = rows[i];

                    if (!row) {
                        // Skip null or empty rows
                        continue;
                    }

                    const rowData = {};
// ...
    headers.forEach((header, index) => {
    const questionNumber = header.match(/Q(\d+)/i);
    const total = header.match(/^Total(\d+)/i); // Check for "Total" at the beginning

    if (questionNumber) {
        const fieldName = `Q${questionNumber[1]}`;
        rowData[fieldName] = isValidNumber(row[index]) ? parseFloat(row[index]) : 0;
    } else if (total) {
        const fieldName = 'Total';
        rowData[fieldName] = isValidNumber(row[index]) ? parseFloat(row[index]) : 0;
    } else if (header.toLowerCase() === 'sr.no.') {
        rowData['ModuleNo'] = row[index];
    } else if (header.toLowerCase() === 'roll no.') {
        rowData['RollNo'] = row[index];
    } else {
        rowData[header] = row[index];
    }
    });
// ...
                    documents.push(rowData);
                }

                console.log('Documents:', documents);

                const insertResult = await AttainmentModel.insertMany(documents);


                res.send({ rowCount: insertResult.length });
            } catch (error) {
                console.error('MongoDB Error:', error);
                res.status(500).send('Error inserting data into MongoDB');
            }
        })
        .catch((error) => {
            console.error('Excel Parsing Error:', error);
            res.status(500).send('Error parsing Excel file');
        });
});

// Express route to fetch subject options based on selected year and semester
app.get('/subjects', async(req, res) => {
    const selectedYear = parseInt(req.query.year, 10); // Parse the query parameter as an integer
    const selectedSemester = req.query.semester;
    const course = educationalPlatformDb.model('CourseOutcomeModule',courseschema,"courses");

    try {
        // Query the database for subjects matching the selected year and semester
        const subjectOptions = await course.find({
            Year: selectedYear,
            sem: selectedSemester
        });

        res.json(subjectOptions); // Send the subject options as a JSON response
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/subjectsopt', async(req, res) => {
    //const selectedYear = parseInt(req.query.year, 10); // Parse the query parameter as an integer
    const username = req.query.user;
    const course = educationalPlatformDb.model('CourseOutcomeModule',courseschema,"courses");

    try {
        // Query the database for subjects matching the selected year and semester
        const subjectOptions = await course.find({});
        const usercourse = await EduUser.findOne({ User: username });

        res.json({usercourse,subjectOptions}); // Send the subject options as a JSON response
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/addsubjects', async(req, res) => {
    try{
    const selectedYear = parseInt(req.query.year, 10); // Parse the query parameter as an integer
    const selectedSemester = req.query.semester;
    const c=courseId+"_cd";
    const cd = courseOutcomeDb.model('CourseOutcomeModule',cdSchema,c);
    const course = educationalPlatformDb.model('CourseOutcomeModule',courseschema,"courses");

    const newcd = new cd({
        co_code: req.body.co_code,
        sem: req.body.selectedSemester,
        co_name: req.body.credits,
        credits: req.body.credits,
        contact_hours: req.body.contact_hours,
        coordinators: [], // Assuming coordinators is an array of strings
        teachers: [],
        Branch: req.body.branch,
        NBAcode: req.body.nbacode,
        Year: req.body.year
    });
    const newcourse = new course({
        co_code: req.body.co_code,
        sem: req.body.selectedSemester,
        co_name: req.body.credits,
        credits: req.body.credits,
        contact_hours: req.body.contact_hours,
        coordinators: [], // Assuming coordinators is an array of strings
        teachers: [],
        Branch: req.body.branch,
        NBAcode: req.body.nbacode,
        Year: req.body.year

    });
    await newcd.save();
    await newcourse.save();
    res.redirect('/login');
} catch (error) {
    res.status(500).send(error.message);
}
});

// Express route to fetch data based on selected values
app.get('/fetch-data', async (req, res) => {
    const dept = req.query.department;
    const teacher = educationalPlatformDb.model('CourseOutcomeModule', eduUserSchema, 'users');

    try {
        if(dept!="alldept"){
        const teachers = await teacher.find({ Department: dept });
        res.json(teachers);}
        else{
            const teachers = await teacher.find({ });
            res.json(teachers);

        }
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/fetch-datacm', async (req, res) => {
    const dept = req.query.department;
    const sem = req.query.semester;
    const year = parseInt(req.query.year, 10);
    const courses = educationalPlatformDb.model('CourseOutcomeModule', eduUserSchema, 'courses');

    try {
        if(year!=0){
        if(dept!="alldept"){
        const teachers = await courses.find({ Year: year,Branch: dept,sem: sem }).sort({ Year: 1 });;
        res.json(teachers);}
        else{
            const teachers = await courses.find({Year: year,sem: sem}).sort({ Year: 1 });;
            res.json(teachers);} }
        else{
            if(dept!="alldept"){
            const teachers = await courses.find({ Branch: dept ,sem: sem}).sort({ Year: 1 });;
            res.json(teachers);}
            else{
                const teachers = await courses.find({sem: sem}).sort({ Year: 1 });;
                res.json(teachers);
    
            } }
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/set-teachers', async (req, res) => {
    const teacherNames = req.body.name; // An array of selected teacher names
    const courseId = req.body.courseid; // The ID of the course to update
    const courses = educationalPlatformDb.model('CourseOutcomeModule',courseschema,"courses");
    const c=courseId+"_cd";
    const cd = courseOutcomeDb.model('CourseOutcomeModule',cdSchema,c);


    try {

        // Find the course by its ID
        const course = await courses.findOne({ co_code: courseId });
        const cd1 = await cd.findOne({ co_code: courseId });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }

        cd1.teachers = course.teachers.concat(teacherNames);


        // Add the selected teacher names to the "coordinators" array
        course.teachers = course.teachers.concat(teacherNames);

        // Save the updated course document
        await course.save();
        await cd1.save()/

        res.json({ success: true, message: 'teachers added successfully.' });
    } catch (error) {
        console.error('Error adding teachers:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.post('/set-coordinators', async (req, res) => {
    const teacherNames = req.body.name; // An array of selected teacher names
    const courseId = req.body.courseid; // The ID of the course to update
    const courses = educationalPlatformDb.model('CourseOutcomeModule',courseschema,"courses");
    const c=courseId+"_cd";
    const cd = courseOutcomeDb.model('CourseOutcomeModule',cdSchema,c);


    try {

        // Find the course by its ID
        const course = await courses.findOne({ co_code: courseId });
        const cd1 = await cd.findOne({ co_code: courseId });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }

        cd1.coordinators = course.coordinators.concat(teacherNames);


        // Add the selected teacher names to the "coordinators" array
        course.coordinators = course.coordinators.concat(teacherNames);

        // Save the updated course document
        await course.save();
        await cd1.save()/

        res.json({ success: true, message: 'Coordinators added successfully.' });
    } catch (error) {
        console.error('Error adding coordinators:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        } else {
            res.redirect('/'); // Redirect the user to the home page or another appropriate page
        }
    });
});


app.post('/admin-login',checkSessionTimeout, async (req, res) => {
    try {
        const user = await EduUser.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            if (req.session.user.Role.includes("Admin")) {
                res.sendFile(path.join(__dirname, 'frontend', 'adminHtml/home/adminhome.html'));
            } else {
                res.send("Invalid User");
            }
        } else {
            res.send('Invalid login credentials');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/adminhome',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'adminHtml/home/adminhome.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/coursehome',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'coordinatorHtml/home/coursehome.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/courseexamt1',checkSessionTimeout, async (req, res) => {
    try {
        const selectedSubject = req.query.subject;
        console.log(selectedSubject);
        res.render('/coordinatorHtml/rights/exam/courseexam', { selectedSubject });
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('courseexamt1opt',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'option/coordiantor/courseexamt1opt.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('courseexamt1teaopt',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'option/teacher/courseexamt1opt.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/courseexamt2',checkSessionTimeout, async (req, res) => {
    try {
        const selectedSubject = req.query.subject;
        console.log(selectedSubject);
        res.render('/coordinatorHtml/rights/exam/courseexamt2', { selectedSubject });
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('courseexamt2opt',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'option/coordiantor/courseexamt2opt.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('courseexamt2teaopt',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'option/teacher/courseexamt2opt.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/courseexamt3',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', '/coordinatorHtml/rights/exam/courseexamt3.ejs'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/courseexamta',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', '/coordinatorHtml/rights/exam/courseexamta.ejs'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/teacherhome',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'teacheHtml/home/teacherhome.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/courseoutcome',checkSessionTimeout, async (req, res) => {
    try {
        const selectedSubject = req.query.subject;
        console.log(selectedSubject);
        res.render('coordinatorHtml/rights/co/course', { selectedSubject });
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/courseoutcomeopt',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'options/coordinator/courseopt.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/attainmentt1',checkSessionTimeout, async (req, res) => {
    try {
        const selectedSubject = req.query.subject;
        console.log(selectedSubject);
        res.render('attainment1', { selectedSubject });
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/attainmentt1opt',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'options/attainmentt1opt.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/attainmentt2',checkSessionTimeout, async (req, res) => {
    try {
        const selectedSubject = req.query.subject;
        console.log(selectedSubject);
        res.render('attainment2', { selectedSubject });
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/attainmentt2opt',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'options/attainmentt2opt.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/attainmentt3',checkSessionTimeout, async (req, res) => {
    try {
        const selectedSubject = req.query.subject;
        console.log(selectedSubject);
        res.render('attainment3', { selectedSubject });
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/attainmentt3opt',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'options/attainmentt3opt.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/attainmentta',checkSessionTimeout, async (req, res) => {
    try {
        const selectedSubject = req.query.subject;
        console.log(selectedSubject);
        res.render('attainmenta', { selectedSubject });
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/attainmenttaopt',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'options/attainmenttaopt.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/atcourseexit',checkSessionTimeout, async (req, res) => {
    try {
        const selectedSubject = req.query.subject;
        console.log(selectedSubject);
        res.render('atcourseexit', { selectedSubject });
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/atcourseexitopt',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'options/atcourseexitopt.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/atcopsomap',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'atcopsomap.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/adminmapping',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'admincontrol.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/coursemapping',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'coursemapping.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/adminmapping2',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'admincontrol2.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/coordinator-login', async (req, res) => {
    try {
        const user = await EduUser.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            if (req.session.user.Role.includes("Coordinator")) {
                res.sendFile(path.join(__dirname, 'frontend', 'coordinatorHtml/home/coursehome.html'));
            } else {
                res.send("Invalid User");
            }
            
        } else {
            res.send('Invalid login credentials');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
    
});

app.post('/forgot-password', (req, res) => {
    // Handle the logic for forgot password here
    // You can send an email with a reset password link, for example
    res.send('Forgot Password Page');
});

app.post('/username-recovery', (req, res) => {
    // Handle the logic for username recovery here
    // You can send an email with the username or display it on this page
    res.send('Username Recovery Page');
});

app.post('/create-account', (req, res) => {
    // Handle the logic for username recovery here
    // You can send an email with the username or display it on this page
    res.send('Username Recovery Page');
});


app.post('/login', (req, res) => {
    const selectedRole = req.body.role;

    // You can add logic here to redirect the user based on the selected role
    if (selectedRole === 'coordinator') {
        // Redirect the coordinator to their login page
        res.sendFile(path.join(__dirname, 'frontend', 'coordinatorHtml/login/corlogin.html'));
    } else if (selectedRole === 'admin') {
        // Redirect the admin to their login page
        res.sendFile(path.join(__dirname, 'frontend', 'adminHtml/login/adminlogin.html'));
    } else if (selectedRole === 'teacher') {
        // Redirect the teacher to their login page
        res.sendFile(path.join(__dirname, 'frontend', 'teacherHtml/login/teacherlogin.html'));
    } else {
        // Handle invalid role selection
        res.send('Invalid role selected');
    }
});

app.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text; // Store the CAPTCHA value in session
    res.type('svg').send(captcha.data);
  });

app.post('/teacher-login', async (req, res) => {
    try {
        const user = await EduUser.findOne({ username: req.body.username });
        const userInput = req.body.captchaInput;
        const storedCaptcha = req.session.captcha;
        if (user && await bcrypt.compare(req.body.password, user.password) && userInput===storedCaptcha) {
            req.session.user = user;
            const role = req.session.user.Role;

            if (req.session.user.Role.includes("Teacher")||req.session.user.Role("Coordinator")) {
                res.sendFile(path.join(__dirname, 'frontend', 'teacherHtml/home/teacherhome.html'));
            } else {
                res.send("Invalid User");
            }
        } else {
            res.send('Invalid login credentials');
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send(error.message);
    }
});



app.get('/api/get-username', async (req, res) => {
    try {
        const username = req.session.user.User;
        res.json({ username });
    } catch (error) {
        console.error('Error fetching username:', error);
        res.status(500).json({ error: 'Error fetching username' });
    }
});

app.get('/api/get-userrole', async (req, res) => {
    try {
        const userrole = req.session.user.Role;
        res.json({ userrole });
    } catch (error) {
        console.error('Error fetching userrole:', error);
        res.status(500).json({ error: 'Error fetching userrole' });
    }
});

app.post('/api/updatedb', async (req, res) => {
    const { columnName } = req.body;
    const c= req.query.code+"_at";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);

    // Create an update object for the single column name
    const updateObject = {};
    updateObject[columnName] = "0";

    // Use updateMany to update all documents in the collection for this column
    CourseOutcomeModule.collection.updateMany({}, { $set: updateObject })
        .then(result => {
            // Handle the result if needed
            res.json({ message: "Update successful" });
        })
        .catch(error => {
            // Handle the error if something goes wrong
            console.error(error);
            res.status(500).json({ error: "Update failed" });
        });
});
app.post('/api/updatedbt2', async (req, res) => {
    const { columnName } = req.body;
    const c= req.query.code+"_at2";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);

    // Create an update object for the single column name
    const updateObject = {};
    updateObject[columnName] = "0";

    // Use updateMany to update all documents in the collection for this column
    CourseOutcomeModule.collection.updateMany({}, { $set: updateObject })
        .then(result => {
            // Handle the result if needed
            res.json({ message: "Update successful" });
        })
        .catch(error => {
            // Handle the error if something goes wrong
            console.error(error);
            res.status(500).json({ error: "Update failed" });
        });
});
app.post('/api/updatedbt3', async (req, res) => {
    const { columnName } = req.body;
    const c= req.query.code+"_at3";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);

    // Create an update object for the single column name
    const updateObject = {};
    updateObject[columnName] = "0";

    // Use updateMany to update all documents in the collection for this column
    CourseOutcomeModule.collection.updateMany({}, { $set: updateObject })
        .then(result => {
            // Handle the result if needed
            res.json({ message: "Update successful" });
        })
        .catch(error => {
            // Handle the error if something goes wrong
            console.error(error);
            res.status(500).json({ error: "Update failed" });
        });
});
app.post('/api/updatedbta', async (req, res) => {
    const { columnName } = req.body;
    const c= req.query.code+"_ata";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);

    // Create an update object for the single column name
    const updateObject = {};
    updateObject[columnName] = "0";

    // Use updateMany to update all documents in the collection for this column
    CourseOutcomeModule.collection.updateMany({}, { $set: updateObject })
        .then(result => {
            // Handle the result if needed
            res.json({ message: "Update successful" });
        })
        .catch(error => {
            // Handle the error if something goes wrong
            console.error(error);
            res.status(500).json({ error: "Update failed" });
        });
});



app.post('/api/updatedbco', async (req, res) => {
    const { columnName,co } = req.body;
    const c= req.query.code+"_t1co";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);

    // Create an update object for the single column name
    const updateObject = {};
    updateObject[columnName] = co;

    // Use updateMany to update all documents in the collection for this column
    CourseOutcomeModule.collection.updateMany({}, { $set: updateObject })
        .then(result => {
            // Handle the result if needed
            res.json({ message: "Update successful" });
        })
        .catch(error => {
            // Handle the error if something goes wrong
            console.error(error);
            res.status(500).json({ error: "Update failed" });
        });
});
app.post('/api/updatedbcot2', async (req, res) => {
    const { columnName,co } = req.body;
    const c= req.query.code+"_t2co";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);

    // Create an update object for the single column name
    const updateObject = {};
    updateObject[columnName] = co;

    // Use updateMany to update all documents in the collection for this column
    CourseOutcomeModule.collection.updateMany({}, { $set: updateObject })
        .then(result => {
            // Handle the result if needed
            res.json({ message: "Update successful" });
        })
        .catch(error => {
            // Handle the error if something goes wrong
            console.error(error);
            res.status(500).json({ error: "Update failed" });
        });
});
app.post('/api/updatedbcot3', async (req, res) => {
    const { columnName,co } = req.body;
    const c= req.query.code+"_t3co";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);

    // Create an update object for the single column name
    const updateObject = {};
    updateObject[columnName] = co;

    // Use updateMany to update all documents in the collection for this column
    CourseOutcomeModule.collection.updateMany({}, { $set: updateObject })
        .then(result => {
            // Handle the result if needed
            res.json({ message: "Update successful" });
        })
        .catch(error => {
            // Handle the error if something goes wrong
            console.error(error);
            res.status(500).json({ error: "Update failed" });
        });
});
app.post('/api/updatedbcota', async (req, res) => {
    const { columnName,co } = req.body;
    const c= req.query.code+"_taco";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);

    // Create an update object for the single column name
    const updateObject = {};
    updateObject[columnName] = co;

    // Use updateMany to update all documents in the collection for this column
    CourseOutcomeModule.collection.updateMany({}, { $set: updateObject })
        .then(result => {
            // Handle the result if needed
            res.json({ message: "Update successful" });
        })
        .catch(error => {
            // Handle the error if something goes wrong
            console.error(error);
            res.status(500).json({ error: "Update failed" });
        });
});
app.post('/api/updatedbmarks', async (req, res) => {
    const { columnName,marks } = req.body;
    const c= req.query.code+"_t1marks";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);

    // Create an update object for the single column name
    const updateObject = {};
    updateObject[columnName] = marks;

    // Use updateMany to update all documents in the collection for this column
    CourseOutcomeModule.collection.updateMany({}, { $set: updateObject })
        .then(result => {
            // Handle the result if needed
            res.json({ message: "Update successful" });
        })
        .catch(error => {
            // Handle the error if something goes wrong
            console.error(error);
            res.status(500).json({ error: "Update failed" });
        });
});
app.post('/api/updatedbmarkst2', async (req, res) => {
    const { columnName,marks } = req.body;
    const c= req.query.code+"_t2marks";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);

    // Create an update object for the single column name
    const updateObject = {};
    updateObject[columnName] = marks;

    // Use updateMany to update all documents in the collection for this column
    CourseOutcomeModule.collection.updateMany({}, { $set: updateObject })
        .then(result => {
            // Handle the result if needed
            res.json({ message: "Update successful" });
        })
        .catch(error => {
            // Handle the error if something goes wrong
            console.error(error);
            res.status(500).json({ error: "Update failed" });
        });
});
app.post('/api/updatedbmarkst3', async (req, res) => {
    const { columnName,marks } = req.body;
    const c= req.query.code+"_t3marks";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);

    // Create an update object for the single column name
    const updateObject = {};
    updateObject[columnName] = marks;

    // Use updateMany to update all documents in the collection for this column
    CourseOutcomeModule.collection.updateMany({}, { $set: updateObject })
        .then(result => {
            // Handle the result if needed
            res.json({ message: "Update successful" });
        })
        .catch(error => {
            // Handle the error if something goes wrong
            console.error(error);
            res.status(500).json({ error: "Update failed" });
        });
});
app.post('/api/updatedbmarksta', async (req, res) => {
    const { columnName,marks } = req.body;
    const c= req.query.code+"_tamarks";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);

    // Create an update object for the single column name
    const updateObject = {};
    updateObject[columnName] = marks;

    // Use updateMany to update all documents in the collection for this column
    CourseOutcomeModule.collection.updateMany({}, { $set: updateObject })
        .then(result => {
            // Handle the result if needed
            res.json({ message: "Update successful" });
        })
        .catch(error => {
            // Handle the error if something goes wrong
            console.error(error);
            res.status(500).json({ error: "Update failed" });
        });
});


app.get('/api/get-usercourse', async (req, res) => {
    try {
        const usercourse = req.session.user.Course;
        res.json({ usercourse });
    } catch (error) {
        console.error('Error fetching userrole:', error);
        res.status(500).json({ error: 'Error fetching usercourse' });
    }
});


app.get('/api/cd', async (req, res) => {
    try {
        const c= req.query.code+"_cd";
        const cd = courseOutcomeDb.model('CourseOutcomeModule', cdSchema, c);
        const modules = await cd.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/courses', async (req, res) => {
    try {
        const c= req.query.code;
        const course = courseOutcomeDb.model('CourseOutcomeModule', courseSchema, c);
        const modules = await course.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/t1attainment', async (req, res) => {
    try {
        const c= req.query.code+"_at";
        const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
        const modules = await CourseOutcomeModule.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/t2attainment', async (req, res) => {
    try {
        const c= req.query.code+"_at2";
        const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
        const modules = await CourseOutcomeModule.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/t3attainment', async (req, res) => {
    try {
        const c= req.query.code+"_at3";
        const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
        const modules = await CourseOutcomeModule.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});
app.get('/api/taattainment', async (req, res) => {
    try {
        const c= req.query.code+"_ata";
        const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
        const modules = await CourseOutcomeModule.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/copo', async(req, res) => {
    try {
        const c= req.query.code + "_copo";
        const copoModule = courseOutcomeDb.model('CourseOutcomeModule', copoSchema, c);

        const modules = await copoModule.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});
app.get('/api/coposo', async(req, res) => {
    try {
        const c= req.query.code + "_coposo";
        const copoModule = courseOutcomeDb.model('CourseOutcomeModule', coposoSchema, c);

        const modules = await copoModule.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});
app.get('/api/coposoat', async(req, res) => {
    try {
        const c= req.query.code + "_coposoat";
        const copoModule = courseOutcomeDb.model('CourseOutcomeModule', coposoatSchema, c);

        const modules = await copoModule.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.post('/api/copo', async(req, res) => {
    // const { ModuleNo, ModuleTitle, Topics, NoOfLectures } = req.body;
    const c= req.query.code + "_copo";
    const copoModule = courseOutcomeDb.model('CourseOutcomeModule', copoSchema, c);
    const newModule = new copoModule(req.body);
    try {
        await newModule.save();
        res.json(newModule);
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Error saving data' });
    }
});
app.post('/api/coposo', async(req, res) => {
    // const { ModuleNo, ModuleTitle, Topics, NoOfLectures } = req.body;
    const c= req.query.code + "_coposo";
    const copoModule = courseOutcomeDb.model('CourseOutcomeModule', coposoSchema, c);
    const newModule = new copoModule(req.body);
    try {
        await newModule.save();
        res.json(newModule);
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Error saving data' });
    }
});
app.post('/api/coposoat', async(req, res) => {
    // const { ModuleNo, ModuleTitle, Topics, NoOfLectures } = req.body;
    const c= req.query.code + "_coposoat";
    const copoModule = courseOutcomeDb.model('CourseOutcomeModule', coposoatSchema, c);
    const newModule = new copoModule(req.body);
    try {
        await newModule.save();
        res.json(newModule);
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Error saving data' });
    }
});
app.get('/api/t1co', async (req, res) => {
    try {
        const c= req.query.code+"_t1co";
        const attainmentT1Schemac = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);
        const modules = await attainmentT1Schemac.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/t2co', async (req, res) => {
    try {
        const c= req.query.code+"_t2co";
        const attainmentT1Schemac = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);
        const modules = await attainmentT1Schemac.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});
app.get('/api/t3co', async (req, res) => {
    try {
        const c= req.query.code+"_t3co";
        const attainmentT1Schemac = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);
        const modules = await attainmentT1Schemac.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});
app.get('/api/taco', async (req, res) => {
    try {
        const c= req.query.code+"_taco";
        const attainmentT1Schemac = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);
        const modules = await attainmentT1Schemac.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});
app.get('/api/t1marks', async (req, res) => {
    try {
        const c= req.query.code+"_t1marks";
        const attainmentT1Schemamarks = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);
        const modules = await attainmentT1Schemamarks.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/t2marks', async (req, res) => {
    try {
        const c= req.query.code+"_t2marks";
        const attainmentT1Schemamarks = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);
        const modules = await attainmentT1Schemamarks.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});
app.get('/api/t3marks', async (req, res) => {
    try {
        const c= req.query.code+"_t3marks";
        const attainmentT1Schemamarks = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);
        const modules = await attainmentT1Schemamarks.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});
app.get('/api/tamarks', async (req, res) => {
    try {
        const c= req.query.code+"_tamarks";
        const attainmentT1Schemamarks = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schemaco, c);
        const modules = await attainmentT1Schemamarks.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/modules', async (req, res) => {
    try {
        const c= req.query.code+"_co";
        const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', courseOutcomeModuleSchema, c);
        const modules = await CourseOutcomeModule.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.post('/api/modules', async (req, res) => {
    // const { ModuleNo, ModuleTitle, Topics, NoOfLectures } = req.body;
    const c= req.query.code+"_co";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', courseOutcomeModuleSchema, c);
    const newModule = new CourseOutcomeModule(req.body);
     try {
         await newModule.save();
         res.json(newModule);
     } catch (error) {
         console.error('Error saving data:', error);
         res.status(500).json({ error: 'Error saving data' });
     }
 });

 app.post('/api/t1attainment', async (req, res) => {
    // const { ModuleNo, ModuleTitle, Topics, NoOfLectures } = req.body;
    const c= req.query.code+"_at";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
    const newModule = new CourseOutcomeModule(req.body);
     try {
         await newModule.save();
         res.json(newModule);
     } catch (error) {
         console.error('Error saving data:', error);
         res.status(500).json({ error: 'Error saving data' });
     }
 });
 app.post('/api/t2attainment', async (req, res) => {
    // const { ModuleNo, ModuleTitle, Topics, NoOfLectures } = req.body;
    const c= req.query.code+"_at2";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
    const newModule = new CourseOutcomeModule(req.body);
     try {
         await newModule.save();
         res.json(newModule);
     } catch (error) {
         console.error('Error saving data:', error);
         res.status(500).json({ error: 'Error saving data' });
     }
 });
 app.post('/api/t3attainment', async (req, res) => {
    // const { ModuleNo, ModuleTitle, Topics, NoOfLectures } = req.body;
    const c= req.query.code+"_at3";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
    const newModule = new CourseOutcomeModule(req.body);
     try {
         await newModule.save();
         res.json(newModule);
     } catch (error) {
         console.error('Error saving data:', error);
         res.status(500).json({ error: 'Error saving data' });
     }
 });
 app.post('/api/taattainment', async (req, res) => {
    // const { ModuleNo, ModuleTitle, Topics, NoOfLectures } = req.body;
    const c= req.query.code+"_ata";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
    const newModule = new CourseOutcomeModule(req.body);
     try {
         await newModule.save();
         res.json(newModule);
     } catch (error) {
         console.error('Error saving data:', error);
         res.status(500).json({ error: 'Error saving data' });
     }
 });

 const FormSchema = new mongoose.Schema({
    numQuestions: Number,
    marksPerQuestion: [Number],
    numCOs: Number,
    coValues: [Number]
});

app.post('/api/submitcot1', async (req, res) => {
    const c= req.query.code+"_t1co";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule',attainmentT1Schemaco, c);
    await CourseOutcomeModule.deleteMany({});
    const formData = new CourseOutcomeModule(req.body);
    try {
        await formData.save();
        res.status(201).send({ message: 'Data saved successfully', data: formData });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send({ message: 'Error saving data', error: error });
    }
});
app.post('/api/submitcot2', async (req, res) => {
    const c= req.query.code+"_t2co";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule',attainmentT1Schema, c);
    await CourseOutcomeModule.deleteMany({});
    const formData = new CourseOutcomeModule(req.body);
    try {
        await formData.save();
        res.status(201).send({ message: 'Data saved successfully', data: formData });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send({ message: 'Error saving data', error: error });
    }
});
app.post('/api/submitcot3', async (req, res) => {
    const c= req.query.code+"_t2co";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule',attainmentT1Schema, c);
    await CourseOutcomeModule.deleteMany({});
    const formData = new CourseOutcomeModule(req.body);
    try {
        await formData.save();
        res.status(201).send({ message: 'Data saved successfully', data: formData });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send({ message: 'Error saving data', error: error });
    }
});
app.post('/api/submitcota', async (req, res) => {
    const c= req.query.code+"_taco";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule',attainmentT1Schema, c);
    await CourseOutcomeModule.deleteMany({});
    const formData = new CourseOutcomeModule(req.body);
    try {
        await formData.save();
        res.status(201).send({ message: 'Data saved successfully', data: formData });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send({ message: 'Error saving data', error: error });
    }
});
app.post('/api/submitmarkst1', async (req, res) => {
    const c= req.query.code+"_t1marks";
    
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule',attainmentT1Schema, c);
    await CourseOutcomeModule.deleteMany({});
    const formData = new CourseOutcomeModule(req.body);
    try {
        await formData.save();
        res.status(201).send({ message: 'Data saved successfully', data: formData });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send({ message: 'Error saving data', error: error });
    }
});
app.post('/api/submitmarkst2', async (req, res) => {
    const c= req.query.code+"_t2marks";
    
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule',attainmentT1Schema, c);
    await CourseOutcomeModule.deleteMany({});
    const formData = new CourseOutcomeModule(req.body);
    try {
        await formData.save();
        res.status(201).send({ message: 'Data saved successfully', data: formData });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send({ message: 'Error saving data', error: error });
    }
});
app.post('/api/submitmarkst3', async (req, res) => {
    const c= req.query.code+"_t3marks";
    
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule',attainmentT1Schema, c);
    await CourseOutcomeModule.deleteMany({});
    const formData = new CourseOutcomeModule(req.body);
    try {
        await formData.save();
        res.status(201).send({ message: 'Data saved successfully', data: formData });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send({ message: 'Error saving data', error: error });
    }
});
app.post('/api/submitmarksta', async (req, res) => {
    const c= req.query.code+"_tamarks";
    
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule',attainmentT1Schema, c);
    await CourseOutcomeModule.deleteMany({});
    const formData = new CourseOutcomeModule(req.body);
    try {
        await formData.save();
        res.status(201).send({ message: 'Data saved successfully', data: formData });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send({ message: 'Error saving data', error: error });
    }
});
 app.post('/api/courses', async (req, res) => {
    // const { ModuleNo, ModuleTitle, Topics, NoOfLectures } = req.body;
    const c= req.query.code;
    const course = courseOutcomeDb.model('CourseOutcomeModule', courseSchema, c);
    const newModule = new course(req.body);
     try {
         await newModule.save();
         res.json(newModule);
     } catch (error) {
         console.error('Error saving data:', error);
         res.status(500).json({ error: 'Error saving data' });
     }
 });

app.put('/api/module/:id', async (req, res) => {
    const c= req.query.code+"_co";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', courseOutcomeModuleSchema, c);
    const moduleId = req.params.id;
    const updatedModule = req.body;
    
    try {
        await CourseOutcomeModule.findByIdAndUpdate(moduleId, updatedModule);
        res.json(updatedModule);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Error updating data' });
    }
});
app.put('/api/t1attainment/:id', async (req, res) => {
    const c= req.query.code+"_at";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
    const moduleId = req.params.id;
    const updatedModule = req.body;
    
    try {
        await CourseOutcomeModule.findByIdAndUpdate(moduleId, updatedModule);
        res.json(updatedModule);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Error updating data' });
    }
});

app.put('/api/t2attainment/:id', async (req, res) => {
    const c= req.query.code+"_at2";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
    const moduleId = req.params.id;
    const updatedModule = req.body;
    
    try {
        await CourseOutcomeModule.findByIdAndUpdate(moduleId, updatedModule);
        res.json(updatedModule);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Error updating data' });
    }
});
app.put('/api/t3attainment/:id', async (req, res) => {
    const c= req.query.code+"_at3";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
    const moduleId = req.params.id;
    const updatedModule = req.body;
    
    try {
        await CourseOutcomeModule.findByIdAndUpdate(moduleId, updatedModule);
        res.json(updatedModule);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Error updating data' });
    }
});
app.put('/api/taattainment/:id', async (req, res) => {
    const c= req.query.code+"_ata";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
    const moduleId = req.params.id;
    const updatedModule = req.body;
    
    try {
        await CourseOutcomeModule.findByIdAndUpdate(moduleId, updatedModule);
        res.json(updatedModule);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Error updating data' });
    }
});
app.put('/api/course/:id', async (req, res) => {
    const c= req.query.code;
    const course = courseOutcomeDb.model('CourseOutcomeModule', courseSchema, c);
    const moduleId = req.params.id;
    const updatedModule = req.body;
    
    try {
        await course.findByIdAndUpdate(moduleId, updatedModule);
        res.json(updatedModule);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Error updating data' });
    }
});


app.delete('/api/modules/:id', async (req, res) => {
    const c= req.query.code+"_co";
    const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', courseOutcomeModuleSchema, c);
    const moduleId = req.params.id;
    
    try {
        await CourseOutcomeModule.findByIdAndDelete(moduleId);
        res.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Error deleting data' });
    }
});

app.delete('/api/courses/:id', async (req, res) => {
    const c= req.query.code;
    const course = courseOutcomeDb.model('CourseOutcomeModule', courseSchema, c);
    const moduleId = req.params.id;
    
    try {
        await course.findByIdAndDelete(moduleId);
        res.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Error deleting data' });
    }
});

app.delete('/api/t1attainment/:id', async (req, res) => {
    const c= req.query.code+"_at";
    const course = courseOutcomeDb.model('CourseOutcomeModule', courseSchema, c);
    const moduleId = req.params.id;
    
    try {
        await course.findByIdAndDelete(moduleId);
        res.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Error deleting data' });
    }
});
app.delete('/api/t2attainment/:id', async (req, res) => {
    const c= req.query.code+"_at2";
    const course = courseOutcomeDb.model('CourseOutcomeModule', courseSchema, c);
    const moduleId = req.params.id;
    
    try {
        await course.findByIdAndDelete(moduleId);
        res.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Error deleting data' });
    }
});
app.delete('/api/t3attainment/:id', async (req, res) => {
    const c= req.query.code+"_at3";
    const course = courseOutcomeDb.model('CourseOutcomeModule', courseSchema, c);
    const moduleId = req.params.id;
    
    try {
        await course.findByIdAndDelete(moduleId);
        res.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Error deleting data' });
    }
});
app.delete('/api/taattainment/:id', async (req, res) => {
    const c= req.query.code+"_ata";
    const course = courseOutcomeDb.model('CourseOutcomeModule', courseSchema, c);
    const moduleId = req.params.id;
    
    try {
        await course.findByIdAndDelete(moduleId);
        res.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Error deleting data' });
    }
});
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
