
$(document).ready(() => {

    fetchusername();
    fetchcourse();
    fetchuserrole();
    
    

    const body = document.querySelector("body");
    const darkLight = document.querySelector("#darkLight");
    const sidebar = document.querySelector(".sidebar");
    const submenuItems = document.querySelectorAll(".submenu_item");
    const sidebarOpen = document.querySelector("#sidebarOpen");
    const sidebarClose = document.querySelector(".collapse_sidebar");
    const sidebarExpand = document.querySelector(".expand_sidebar");

    sidebarOpen.addEventListener("click", () => sidebar.classList.toggle("close"));

   /* function submitForm() {
        // Get values from the form inputs
        const numQuestions = $('#numQuestions').val();
        const marksPerQuestion = $('#marksPerQuestion').val();
        const numCOs = $('#numCOs').val();
        const coValues = $('#coValues').val();

        // Validate the inputs (optional, but recommended)
        if (!validateInputs(numQuestions, marksPerQuestion, numCOs, coValues)) {
            alert('Please fill in all fields correctly.');
            return;
        }

        // Prepare the data to be sent
        const data = {
            numQuestions: parseInt(numQuestions, 10),
            marksPerQuestion: parseCommaSeparatedValues(marksPerQuestion),
            numCOs: parseInt(numCOs, 10),
            coValues: parseCommaSeparatedValues(coValues)
        };

        // Send the data to the server via AJAX
        $.ajax({
            url: '/api/submiT', // Replace with your server's endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                console.log('Form data submitted successfully:', response);
                // Perform additional actions on success, if needed
            },
            error: function(error) {
                console.error('Error submitting form data:', error);
            }
        });
    }*/
    function updateco(numQuestions, coValues){
        if (numQuestions !== coValues.length) {
            alert('The number of questions does not match the number of CO values provided.');
            return;
        }
    
        // Identify and sort unique CO values
        const uniqueCOs = [...new Set(coValues)].sort();
    
        // Prepare the data to be sent
        const data = {
            ModuleNo: "0", // Set default values or fetch from other inputs
            RollNo: "0", // Set default values or fetch from other inputs
            Name: "0", // Set default values or fetch from other inputs
            Batch: "0", // Set default values or fetch from other inputs
            Total: coValues.reduce((total, mark) => total + mark, 0).toString(),
            // Dynamically create question marks
            ...Object.fromEntries(coValues.map((mark, index) => [`Q${index + 1}`, mark.toString()])),
        };
    
        // Dynamically add attainment fields for each unique and sorted CO
        uniqueCOs.forEach((co, index) => {
            data[`Attainment${index + 1}`] = co;
        });
    
    
        // Send the data to the server via AJAX
        $.ajax({
            url: '/api/submitcot1', // Replace with your server's endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                console.log('Form data submitted successfully:', response);
            },
            error: function(error) {
                console.error('Error submitting form data:', error);
            }
        });
    }
    
function updatemarks(numQuestions, marksPerQuestion,coValues){
    if (numQuestions !== marksPerQuestion.length) {
        alert('The number of questions does not match the number of marks provided.');
        return;
    }
    const uniqueCOs = [...new Set(coValues)].sort();
    // Prepare the data to be sent
    const data = {
        ModuleNo: "0", // Set default values or fetch from other inputs
        RollNo: "0", // Set default values or fetch from other inputs
        Name: "0", // Set default values or fetch from other inputs
        Batch: "0", // Set default values or fetch from other inputs
        Total: marksPerQuestion.reduce((total, mark) => total + mark, 0).toString(),
        // Dynamically create question marks
        ...Object.fromEntries(marksPerQuestion.map((mark, index) => [`Q${index + 1}`, mark.toString()])),
        // Set default attainment values
        // Add more attainments if necessary
    };
    uniqueCOs.forEach((co, index) => {
        data[`Attainment${index + 1}`] = "0";
    });

    // Send the data to the server via AJAX
    $.ajax({
        url: '/api/submitmarkst1', // Replace with your server's endpoint
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            console.log('Form data submitted successfully:', response);
        },
        error: function(error) {
            console.error('Error submitting form data:', error);
        }
    });

}
  
function submitForm() {
    // Get values from the form inputs
    const numQuestions = parseInt($('#numQuestions').val(), 10);
    const marksPerQuestion = $('#marksPerQuestion').val().split(',').map(mark => parseFloat(mark.trim()));
    const coValues= $('#coValues').val().split(',').map(mark => parseFloat(mark.trim()));

    // Validate the inputs
    if (!validateInputs(numQuestions, marksPerQuestion)) {
        alert('Please fill in all fields correctly.');
        return;
    }
    if (!validateInputs(numQuestions, coValues)) {
        alert('Please fill in all fields correctly.');
        return;
    }
    updatemarks(numQuestions, marksPerQuestion,coValues);
    updateco(numQuestions, coValues);

}
$('#submitFormButton').click(function() {
    submitForm();
});


$('#semesterDropdown').change(function() {
    // Get the selected values
    const selectedYear = $('#academicYearDropdown').val();
    const selectedSemester = $(this).val(); // 'this' refers to the semester dropdown

    // Call the fetchSubjects function to fetch subjects and data
    fetchSubjects(selectedYear, selectedSemester);
});

$('#setteacherButton').click(function() {
    // Get the selected teacher IDs from the checkboxes
    const selectedSubject = $('#subjectDropdown').val();
    const selectedTeacherIds = $('input[name="coordinatorCheckbox"]:checked').map(function() {
        return $(this).val();
    }).get();

    // Make an AJAX request to update the teachers as coordinators
    $.post('/set-teachers', { name: selectedTeacherIds, courseid: selectedSubject }, function(response) {
        if (response.success) {
            alert('Teachers set as teachers successfully!');
            // You can also update the UI or perform any other actions as needed.
        } else {
            alert('Failed to set teachers.');
        }
    });

});

    // Add a click event handler for the "Set as Coordinators" button



    sidebarClose.addEventListener("click", () => {
        sidebar.classList.add("close", "hoverable");
    });
    sidebarExpand.addEventListener("click", () => {
        sidebar.classList.remove("close", "hoverable");
    });

    sidebar.addEventListener("mouseenter", () => {
        if (sidebar.classList.contains("hoverable")) {
            sidebar.classList.remove("close");
        }
    });
    sidebar.addEventListener("mouseleave", () => {
        if (sidebar.classList.contains("hoverable")) {
            sidebar.classList.add("close");
        }
    });

    darkLight.addEventListener("click", () => {
        body.classList.toggle("dark");
        if (body.classList.contains("dark")) {
            document.setI
            darkLight.classList.replace("bx-sun", "bx-moon");
        } else {
            darkLight.classList.replace("bx-moon", "bx-sun");
        }
    });

    // Define a function to fetch subjects based on selected year and semester
    function fetchSubjects(selectedYear, selectedSemester) {
        $.get(`/subjects?year=${selectedYear}&semester=${selectedSemester}`, function(subjectData) {
            const subjectDropdown = $('#subjectDropdown');
            subjectDropdown.empty(); // Clear existing .
            console.log(subjectData);
            subjectDropdown.append('<option value="" disabled selected>Select Subject Code</option>');
            subjectData.forEach(subject => {
                subjectDropdown.append($('<option></option>').attr('value', subject.co_code).text(subject.co_code));
            });
        });
    }

    submenuItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            item.classList.toggle("show_submenu");
            submenuItems.forEach((item2, index2) => {
                if (index !== index2) {
                    item2.classList.remove("show_submenu");
                }
            });
        });
    });

    if (window.innerWidth < 768) {
        sidebar.classList.add("close");
    } else {
        sidebar.classList.remove("close");
    }

});

function fetchusername() {
    $.ajax({
        url: '/api/get-username',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            const username = data.username;
            console.log('Username:', username);
            $('#username').text(username);
            $('#username1').text(username);
        },
        error: function(error) {
            console.error('Error fetching username', error);
        }
    });
}

function parseCommaSeparatedValues(input) {
    return input.split(',').map(item => item.trim());
}

// Utility function for basic input validation
function validateInputs(numQuestions, marksPerQuestion, numCOs, coValues) {
    // Add your validation logic here (e.g., check if values are not empty)
    // This is a basic example
    return numQuestions && marksPerQuestion && numCOs && coValues;
}

// Bind the submitForm function to the submit button
$('#inputForm').on('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission
    submitForm();
});

function fetchuserrole() {
    $.ajax({
        url: '/api/get-userrole',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            const userrole = data.userrole;
            console.log('Userrole:', userrole);
            $('#userrole').text(userrole);
        },
        error: function(error) {
            console.error('Error fetching userrole', error);
        }
    });
}

function validateInputs(numQuestions, marksPerQuestion) {
    // Validation logic here
    return numQuestions && marksPerQuestion.length === numQuestions;
}

function fetchcourse() {
    $.ajax({
        url: '/api/get-usercourse',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            const usercourse = data.usercourse;
            console.log('Userrole:', usercourse);
            $('#course_code').text(usercourse);
        },
        error: function(error) {
            console.error('Error fetching usercourse', error);
        }
    });
}


