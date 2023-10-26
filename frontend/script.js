window.onload = function () {
    alert('Welcome to the next page!');
};

$(document).ready(() => {
    fetchSyllabusData();
    fetchCourseData();
    fetchusername();
    fetchcourse();
    fetchuserrole();
    fetchcdData();
    updateTotalLectures();

const body = document.querySelector("body");
const darkLight = document.querySelector("#darkLight");
const sidebar = document.querySelector(".sidebar");
const submenuItems = document.querySelectorAll(".submenu_item");
const sidebarOpen = document.querySelector("#sidebarOpen");
const sidebarClose = document.querySelector(".collapse_sidebar");
const sidebarExpand = document.querySelector(".expand_sidebar");

sidebarOpen.addEventListener("click", () => sidebar.classList.toggle("close"));

    $('.add-row-button').click(() => {
        addEmptyRow();
    });

    $('.add-row-buttonco').click(() => {
        addEmptyRow2();
    });


    $('.save-button').click(() => {
        saveDataToServer();
    });

    
    $('.save-buttonco').click(() => {
        saveDataToServerco();
    });

    $(document).on('input', '#syllabus-data td:nth-child(4)', function () {
        updateTotalLectures();
    });


    $('.generate-pdf-button').click(() => {
        // Send a GET request to the /generate-pdf endpoint to generate the PDF
        fetch('/generate-pdf')
            .then(response => response.blob())
            .then(blob => {
                // Create a Blob URL for the PDF
                const url = window.URL.createObjectURL(blob);
    
                // Create a link element to trigger the download
                const a = document.createElement('a');
                a.href = url;
                a.download = 'your-pdf-file.pdf'; // Set the desired file name
    
                // Trigger the click event on the link to initiate the download
                document.body.appendChild(a);
                a.click();
    
                // Clean up the Blob URL
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Error generating PDF:', error);
            });
    });
    
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
    $(document).on('click', '.update-button', function () {
        const row = $(this).closest('tr');
        const cells = row.find('td');
        cells.attr('contenteditable', 'true'); // Make cells editable
        row.find('.update-button').hide();
        row.find('.delete-button').hide();
        row.find('.save-buttonu').show();
    });
   // $(document).on('click', '.generatepdf-button', function () {
     //     generatePDF();
    //});

    $(document).on('click', '.update-buttonco', function () {
        const row = $(this).closest('tr');
        const cells = row.find('td');
        cells.attr('contenteditable', 'true'); // Make cells editable
        row.find('.update-buttonco').hide();
        row.find('.delete-buttonco').hide();
        row.find('.save-buttonuco').show();
    });
    $(document).on('click', '.save-buttonuco', function () {
        const row = $(this).closest('tr');
        const moduleId = row.data('moduleId');
        updateRowco(moduleId, row);
    });

    $(document).on('click', '.delete-buttonco', function () {
        const row = $(this).closest('tr');
        const moduleId = row.data('moduleId');
        deleteRowco(moduleId);
    });

    $(document).on('click', '.delete-button', function () {
        const row = $(this).closest('tr');
        const moduleId = row.data('moduleId');
        deleteRow(moduleId);
    });

    $(document).on('click', '.save-buttonu', function () {
        const row = $(this).closest('tr');
        const moduleId = row.data('moduleId');
        updateRow(moduleId, row);
    });


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

function updateRow(moduleId, row) {
    const cells = row.find('td');
    const updatedData = {
        ModuleNo: parseInt(cells.eq(0).text()),
        ModuleTitle: cells.eq(1).text(),
        Topics: cells.eq(2).text(),
        NoOfLectures: parseInt(cells.eq(3).text())
    };

    $.ajax({
        url: `/api/module/${moduleId}`, // Change this URL to match your Express route
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(updatedData),
        success: function (response) {
            console.log('Data updated successfully:', response);
            fetchSyllabusData();
        },
        error: function (error) {
            console.error('Error updating data:', error);
        }
    });

    // Restore UI state
    cells.attr('contenteditable', 'false');
    row.find('.save-buttonu').hide();
    row.find('.update-button').show();
    row.find('.delete-button').show();
}

function updateRowco(moduleId, row) {
    const cells = row.find('td');
    const updatedData = {
        coid: cells.eq(0).text(),
        cotitle: cells.eq(1).text(),
        colevels: cells.eq(2).text()
    };

    $.ajax({
        url: `/api/course/${moduleId}`, // Change this URL to match your Express route
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(updatedData),
        success: function (response) {
            console.log('Data updated successfully:', response);
            fetchSyllabusData();
        },
        error: function (error) {
            console.error('Error updating data:', error);
        }
    });

    // Restore UI state
    cells.attr('contenteditable', 'false');
    row.find('.save-buttonuco').hide();
    row.find('.update-buttonco').show();
    row.find('.delete-buttonco').show();
}

function deleteRowco(moduleId) {
    $.ajax({
        url: `/api/courses/${moduleId}`, // Change this URL to match your Express route
        type: 'DELETE',
        success: function () {
            console.log('Data deleted successfully');
            fetchCourseData();
        },
        error: function (error) {
            console.error('Error deleting data:', error);
        }
    });
}

function deleteRow(moduleId) {
    $.ajax({
        url: `/api/modules/${moduleId}`, // Change this URL to match your Express route
        type: 'DELETE',
        success: function () {
            console.log('Data deleted successfully');
            fetchSyllabusData();
        },
        error: function (error) {
            console.error('Error deleting data:', error);
        }
    });
}

// ... (rest of your functions, like fetchSyllabusData, addEmptyRow, saveDataToServer)

// Rename the functions to have unique names
function fetchSyllabusData() {
    $.ajax({
        url: '/api/modules', // Change this URL to match your Express route
        type: 'GET',
        dataType: 'json',
        
        success: function (data) {
            const syllabusData = $('#syllabus-data');
            syllabusData.empty();
            let totalLectures = 0; // Clear existing table data
            data.forEach(module => {
                const row = `
                    <tr data-module-id="${module._id}">
                        <td>${module.ModuleNo}</td>
                        <td>${module.ModuleTitle}</td>
                        <td>${module.Topics}</td>
                        <td>${module.NoOfLectures}</td>
                        <td class="action-buttons">
                            <button class="btn btn-info update-button">Edit</button>
                            <button class="btn btn-danger delete-button">Delete</button>
                            <button class="btn btn-primary save-buttonu" style="display: none;">Save</button>
                        </td>
                    </tr>
                `;
                syllabusData.append(row);
                totalLectures += module.NoOfLectures;

            });
            const totalRow = `
                <tr id="total-lectures-row">
                    <th colspan="3">Total Lectures</th>
                    <th>${totalLectures}</th>
                    <th></th> <!-- Empty cell for actions -->
                </tr>-
            `;

            syllabusData.append(totalRow);
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}

function fetchcdData() {
    $.ajax({
        url: '/api/cd', // Change this URL to match your Express route
        type: 'GET',
        dataType: 'json',
        
        success: function (data) {
            const cdData = $('#cd_data');
            cdData.empty(); // Clear existing table data
            data.forEach(module => {
                const row = 
                $('#co_code').val(module.co_code);
                $('#sem').val(module.sem);
                $('#co_name').val(module.co_name);
                $('#credits').val(module.credits);
                $('#contact_hours').val(module.contact_hours);
                $('#coordinators').val(module.coordinators);
                $('#teacher').val(module.teachers);
            });
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}
function fetchusername(){
    $.ajax({
        url: '/api/get-username',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const username = data.username;
            console.log('Username:', username);
            $('#username').text(username);
            $('#username1').text(username);
        },
        error: function (error) {
            console.error('Error fetching username', error);
        }
    });
}

function fetchuserrole(){
    $.ajax({
        url: '/api/get-userrole',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const userrole = data.userrole;
            console.log('Userrole:', userrole);
            $('#userrole').text(userrole);
        },
        error: function (error) {
            console.error('Error fetching userrole', error);
        }
    });
}

function fetchcourse(){
    $.ajax({
        url: '/api/get-usercourse',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const usercourse = data.usercourse;
            console.log('Userrole:', usercourse);
            $('#course_code').text(usercourse);
        },
        error: function (error) {
            console.error('Error fetching usercourse', error);
        }
    });
}
function fetchCourseData() {
    $.ajax({
        url: '/api/courses', // Change this URL to match your Express route for courses
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const courseData = $('#co_data');
            courseData.empty(); // Clear existing table data
            data.forEach(module => {
                const row = `
                    <tr data-module-id="${module._id}">
                        <td>${module.coid}</td>
                        <td>${module.cotitle}</td>
                        <td>${module.colevels}</td>
                        <td class="action-buttons">
                            <button class="btn btn-info update-buttonco">Edit</button>
                            <button class="btn btn-danger delete-buttonco">Delete</button>
                            <button class="btn btn-primary save-buttonuco" style="display: none;">Save</button>
                        </td>
                    </tr>
                `;
                courseData.append(row);
            });
        
        },
        error: function (error) {
            console.error('Error fetching course data:', error);
        }
    });
}

// Update the references to these functions in your event handlers
/*$(document).ready(() => {
    fetchSyllabusData(); // Fetch syllabus data
    fetchCourseData(); // Fetch course data
    updateTotalLectures();

    // ... (rest of your event handlers)

});*/


function updateTotalLectures() {
    const rows = $('#syllabus-data tr');
    let totalLectures = 0;

    rows.each(function () {
        const lectures = parseInt($(this).find('td').eq(3).text()) || 0;
        totalLectures += lectures;
    });

    // Update the total lectures in the UI
    $('#total-lectures').text(totalLectures);
    $('#total-lectures').data('lectures', totalLectures);
}
let newModuleNo1=0;


function addEmptyRow2() {
    const emptyRow = `
        <tr>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
        </tr>
    `;
    $('#co_data').append(emptyRow);
}


function addEmptyRow() {

    const rows = $('#syllabus-data tr');
    const lastRow = rows.last(); // Get the last row
    const cells = lastRow.find('td');
    const lastModuleNo = parseInt(rows.eq(rows.length - 2).find('td').eq(0).text()) || 0;
    newModuleNo1=lastModuleNo;
    const newModuleNo = lastModuleNo + 1;

    console.log('Last Module No:', lastModuleNo);
    console.log('New Module No:', newModuleNo);

    cells.eq(0).text(newModuleNo);

    const emptyRow = `
        <tr>
            <td contenteditable="false">${newModuleNo}</td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
        </tr>
    `;
    $('#syllabus-data').append(emptyRow);

}


function saveDataToServerco() {
    const rows = $('#co_data tr');
    const lastRow = rows.last(); // Get the last added row
    const cells = lastRow.find('td');


    const newData = {
        coid: cells.eq(0).text(),
        cotitle: cells.eq(1).text(),
        colevels: cells.eq(2).text()
    };

    $.ajax({
        url: '/api/courses', // Change this URL to match your Express route
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(newData),
        success: function (response) {
            console.log('Data saved successfully:', response);
            fetchCourseData(); // Refresh table with updated data
        },
        
        error: function (error) {
            console.error('Error saving data:', error);
        }
    });
}


function saveDataToServer() {
    if(validateTable()){
    const rows = $('#syllabus-data tr');
    const lastRow = rows.last(); // Get the last added row
    const cells = lastRow.find('td');
    const lastModuleNo = newModuleNo1;
   // const lastModuleNo = parseInt(rows.eq(rows.length - 2).find('td').eq(0).text()) || 6 ;// Get the last Module No. or 0 if none exists
    const newModuleNo = lastModuleNo + 1;

    cells.eq(0).text(newModuleNo);


    const newData = {
        ModuleNo: newModuleNo,
        ModuleTitle: cells.eq(1).text(),
        Topics: cells.eq(2).text(),
        NoOfLectures: parseInt(cells.eq(3).text())
    };

    $.ajax({
        url: '/api/modules', // Change this URL to match your Express route
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(newData),
        success: function (response) {
            console.log('Data saved successfully:', response);
            fetchSyllabusData(); // Refresh table with updated data
        },
        
        error: function (error) {
            console.error('Error saving data:', error);
        }
    });
    updateTotalLectures();
}
else
console.log("Error");
}
