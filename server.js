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
const excel = require('exceljs');



const app = express();
app.use(bodyParser.json());

// Establish the connection to the educational_platform database
const educationalPlatformDb = mongoose.createConnection('mongodb://localhost:27017/educational_platform', { useNewUrlParser: true, useUnifiedTopology: true });

educationalPlatformDb.once('open', () => {
    console.log('Connected to educational_platform database');
});

educationalPlatformDb.on('error', (err) => {
    console.error('Error connecting to educational_platform database:', err);
});

// Session store
const store = new MongoDBSession({
    uri: 'mongodb://localhost:27017/educational_platform_sessions',
    collection: 'sessions'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
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

// Apply the middleware to routes that require an active session


// User schema for educational_platform
const eduUserSchema = new mongoose.Schema({
    username: String,
    password: String,
    User: String,
    Role: String,
    Course: String,
    Department:String

});
const EduUser = educationalPlatformDb.model('User', eduUserSchema);

// Establish the connection to the course_outcome database
const courseOutcomeDb = mongoose.createConnection('mongodb://localhost:27017/course_outcome', { useNewUrlParser: true, useUnifiedTopology: true });

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
        colevels: String
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
        Attainment2: Number
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
        const c= req.session.user.Course+"_at";
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
    const c= req.session.user.Course+"_at";
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

// Express route to fetch data based on selected values
app.get('/fetch-data', async (req, res) => {
    const dept = req.query.department;
    const teacher = educationalPlatformDb.model('CourseOutcomeModule', eduUserSchema, 'users');

    try {
        const teachers = await teacher.find({ Department: dept });
        res.json(teachers); // Send the teachers as a JSON response (array of documents)
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
            if (req.session.user.Role === "Admin") {
                res.sendFile(path.join(__dirname, 'frontend', 'adminhome.html'));
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
        res.sendFile(path.join(__dirname, 'frontend', 'adminhome.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/coursehome',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'coursehome.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/courseexam',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'courseexam.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/teacherhome',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'teacherhome.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/courseoutcome',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'course.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/attainmentt1',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'attainment1.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/attainmentt2',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'attainment2.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/attainmentt3',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'attainment3.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/attainmentta',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'attainmenta.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/atcourseexit',checkSessionTimeout, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'atcourseexit.html'));
           
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
            if (req.session.user.Role === "Coordinator") {
                res.sendFile(path.join(__dirname, 'frontend', 'coursehome.html'));
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
        res.sendFile(path.join(__dirname, 'frontend', 'corlogin.html'));
    } else if (selectedRole === 'admin') {
        // Redirect the admin to their login page
        res.sendFile(path.join(__dirname, 'frontend', 'adminlogin.html'));
    } else if (selectedRole === 'teacher') {
        // Redirect the teacher to their login page
        res.sendFile(path.join(__dirname, 'frontend', 'teacherlogin.html'));
    } else {
        // Handle invalid role selection
        res.send('Invalid role selected');
    }
});

app.post('/teacher-login', async (req, res) => {
    try {
        const user = await EduUser.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            const role = req.session.user.Role;

            if (req.session.user.Role === "Teacher") {
                res.sendFile(path.join(__dirname, 'frontend', 'teacherhome.html'));
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
    const c= req.session.user.Course+"_at";
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
    const c= req.session.user.Course+"_t1co";
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
    const c= req.session.user.Course+"_t1marks";
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
        const c= req.session.user.Course+"_cd";
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
        const c= req.session.user.Course;
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
        const c= req.session.user.Course+"_at";
        const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', attainmentT1Schema, c);
        const modules = await CourseOutcomeModule.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/t1co', async (req, res) => {
    try {
        const c= req.session.user.Course+"_t1co";
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
        const c= req.session.user.Course+"_t1marks";
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
        const c= req.session.user.Course+"_co";
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
    const c= req.session.user.Course+"_co";
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
    const c= req.session.user.Course+"_at";
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

 app.post('/api/courses', async (req, res) => {
    // const { ModuleNo, ModuleTitle, Topics, NoOfLectures } = req.body;
    const c= req.session.user.Course;
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
    const c= req.session.user.Course+"_co";
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
    const c= req.session.user.Course+"_at";
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
    const c= req.session.user.Course;
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
    const c= req.session.user.Course+"_co";
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
    const c= req.session.user.Course;
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
    const c= req.session.user.Course+"_at";
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
