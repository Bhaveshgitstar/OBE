const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

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
    store: store
}));

// User schema for educational_platform
const eduUserSchema = new mongoose.Schema({
    username: String,
    password: String,
    User: String,
    Role: String,
    Course: String
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
        coordinators:String,
        teachers:String
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
app.use(express.static(path.join(__dirname, 'frontend')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'adminlogin.html'));
});


app.post('/admin-login', async (req, res) => {
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

app.get('/adminhome', async (req, res) => {
    try {
                res.sendFile(path.join(__dirname, 'frontend', 'adminhome.html'));
           
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/adminmapping', async (req, res) => {
    try {
                res.sendFile(path.join(__dirname, 'frontend', 'admincontrol.html'));
           
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
                res.sendFile(path.join(__dirname, 'frontend', 'course.html'));
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
                res.sendFile(path.join(__dirname, 'frontend', 'attainment1.html'));
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
