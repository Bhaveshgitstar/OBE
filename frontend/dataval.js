// data-validation.js

// Function to validate the entire table
    function validateTable() {
        console.log("Validation started");
    
        // Clear previous errors
    
        let isValid = true;
        const rows = document.querySelectorAll("#syllabus-data tr");
        const lastRow = rows[rows.length - 1]; // Get the last added row
    
        const cells = lastRow.querySelectorAll("td");
        const title = cells[1].textContent.trim();
        const topics = cells[2].textContent.trim();
        const lectures = cells[3].textContent.trim();
    
        // Validate Title (should not be empty)
        if (!isValidString(title)) {
            alert("Title must not be empty.");
            isValid = false;
        }
    
        // Validate Topics (should not be empty)
        if (!isValidString(topics)) {
            alert("Topics must not be empty.");
            isValid = false;
        }
    
        // Validate Lectures (should be an integer and greater than 0)
        if (!isValidLectures(lectures)) {
            alert("Lectures must be a positive integer.");
            isValid = false;
        }
    
        console.log("Validation completed, isValid:", isValid);
        return isValid;
    }
    
// Function to validate if a value is a positive integer
function isValidModuleNo(value, index) {
    if (!value.match(/^\d+$/)) {
        return false;
    }

    if (index > 0) {
        const prevModuleNo = parseInt(document.querySelectorAll("#syllabus-data tr")[index - 2].querySelector("td").textContent.trim());
        if (parseInt(value) <= prevModuleNo) {
            alert("Module no should be greater than the previous.");
            return false;
        }
    }

    return true;
}

// Function to validate if a value is a non-empty string
function isValidString(value) {
    return value !== "";
}

// Function to validate if lectures is a positive integer
function isValidLectures(value) {
    const intValue = parseInt(value);
    return !isNaN(intValue) && intValue > 0;
}

