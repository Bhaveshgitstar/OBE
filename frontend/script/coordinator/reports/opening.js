console.log('Selected Subject:', window.selectedSubject);
window.onload = function () {
    //alert('Welcome to the next page!');
};

$(document).ready(() => {
    fetchSyllabusData();
    fetchCourseData();
    fetchCourseData2();
    fetchusername();
    fetchcourse();
    fetchuserrole();
    fetchcdData();
    fetchBookData();
    fetchrefBookData();
    updateTotalLectures();

const body = document.querySelector("body");
const darkLight = document.querySelector("#darkLight");
const sidebar = document.querySelector(".sidebar");
$(".sidebar").addClass("close hoverable");

const submenuItems = document.querySelectorAll(".submenu_item");
const sidebarOpen = document.querySelector("#sidebarOpen");
const sidebarClose = document.querySelector(".collapse_sidebar");
const sidebarExpand = document.querySelector(".expand_sidebar");

sidebarOpen.addEventListener("click", () => sidebar.classList.toggle("close"));

    $('.add-row-button').click(() => {
        addEmptyRow();
    });

    $('.add-row-button-book').click(() => {
        addEmptyRowBook();
    });
    $('.add-row-button-refBook').click(() => {
        addEmptyRowrefBook();
    });

    $('.add-row-buttonco').click(() => {
        addEmptyRow2();
    });


    $('.save-button').click(() => {
        saveDataToServer();
    });

    $('.save-button-book').click(() => {
        saveDataToServerBook();
    });

    $('.save-button-refBook').click(() => {
        saveDataToServerrefBook();
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
        url: `/api/module/${moduleId}?code=${window.selectedSubject}`, // Change this URL to match your Express route
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
        colevels: cells.eq(2).text(),
        PO1: parseInt(cells.eq(3).text()),
        PO2: parseInt(cells.eq(4).text()),
        PO3: parseInt(cells.eq(5).text()),
        PO4: parseInt(cells.eq(6).text()),
        PO5: parseInt(cells.eq(7).text()),
        PO6: parseInt(cells.eq(8).text()),
        PO7: parseInt(cells.eq(9).text()),
        PO8: parseInt(cells.eq(10).text()),
        PO9: parseInt(cells.eq(11).text()),
        PO10: parseInt(cells.eq(12).text()),
        PO11: parseInt(cells.eq(13).text()),
        PO12: parseInt(cells.eq(14).text()),
        PSO1: parseInt(cells.eq(15).text()),
        PSO2: parseInt(cells.eq(16).text())
    };

    $.ajax({
        url: `/api/course/${moduleId}?code=${window.selectedSubject}`, // Change this URL to match your Express route
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
        url: `/api/courses/${moduleId}?code=${window.selectedSubject}`, // Change this URL to match your Express route
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
        url: `/api/modules/${moduleId}?code=${window.selectedSubject}`, // Change this URL to match your Express route
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
        url: `/api/modules?code=${window.selectedSubject}`, // Change this URL to match your Express route
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
        url:`/api/cd?code=${window.selectedSubject}`, // Change this URL to match your Express route
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
        url: `/api/courses?code=${window.selectedSubject}`, // Change this URL to match your Express route for courses
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
function fetchCourseData2() {
  $.ajax({
      url: `/api/courses?code=${window.selectedSubject}`, // Change this URL to match your Express route for courses
      type: 'GET',
      dataType: 'json',
      success: function (data) {
          const courseData = $('#co_data2');
          courseData.empty(); // Clear existing table data
          var avg=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
          var count=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
          data.forEach(module => {
              avg[1]+=parseInt(module.PO1);
              avg[2]+=parseInt(module.PO2);
              avg[3]+=parseInt(module.PO3);
              avg[4]+=parseInt(module.PO4);
              avg[5]+=parseInt(module.PO5);
              avg[6]+=parseInt(module.PO6);
              avg[7]+=parseInt(module.PO7);
              avg[8]+=parseInt(module.PO8);
              avg[9]+=parseInt(module.PO9);
              avg[10]+=parseInt(module.PO10);
              avg[11]+=parseInt(module.PO11);
              avg[12]+=parseInt(module.PO12);          
              avg[13]+=parseInt(module.PSO1);
              avg[14]+=parseInt(module.PSO2);

              if(parseInt(module.PO1)!=0){
                count[1]+=1;
              }
              if(parseInt(module.PO2)!=0){
                count[2]+=1;
              }
              if(parseInt(module.PO3)!=0){
                count[3]+=1;
              }
              if(parseInt(module.PO4)!=0){
                count[4]+=1;
              }
              if(parseInt(module.PO5)!=0){
                count[5]+=1;
              }
              if(parseInt(module.PO6)!=0){
                count[6]+=1;
              }
              if(parseInt(module.PO7)!=0){
                count[7]+=1;
              }
              if(parseInt(module.PO8)!=0){
                count[8]+=1;
              }
              if(parseInt(module.PO9)!=0){
                count[9]+=1;
              }
              if(parseInt(module.PO10)!=0){
                count[10]+=1;
              }
              if(parseInt(module.PO11)!=0){
                count[11]+=1;
              }
              if(parseInt(module.PO12)!=0){
                count[12]+=1;
              }
              if(parseInt(module.PSO1)!=0){
                count[13]+=1;
              }
              if(parseInt(module.PSO2)!=0){
                count[14]+=1;
              }
   
              const row = `
                  <tr data-module-id="${module._id}">
                      <td>${module.coid}</td>
                      <td>${module.PO1}</td>
                      <td>${module.PO2}</td>
                      <td>${module.PO3}</td>
                      <td>${module.PO4}</td>
                      <td>${module.PO5}</td>
                      <td>${module.PO6}</td>
                      <td>${module.PO7}</td>
                      <td>${module.PO8}</td>
                      <td>${module.PO9}</td>
                      <td>${module.PO10}</td>
                      <td>${module.PO11}</td>
                      <td>${module.PO12}</td>
                      <td>${module.PSO1}</td>
                      <td>${module.PSO2}</td>
                  </tr>
              `;
              courseData.append(row);
          }        
        );
        var row = `
        <tr data-module-id="100">
        <td>Avg</td>`
        for(var i=1;i<=14;i++){
          row+=`<td>${(Math.round((avg[i]/count[i]) ||0))}</td>`   
        }
        row+=`</tr>`
        courseData.append(row);
        
      
      },
      error: function (error) {
          console.error('Error fetching course data:', error);
      }
  });
}

function fetchBookData() {
    $.ajax({
        url: `/api/bookEntry?code=${window.selectedSubject}`, // Change this URL to match your Express route for courses
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            const courseData = $('#book_data');
            courseData.empty(); // Clear existing table data
            data.forEach(module => {
                const row = `
                    <tr data-module-id="${module._id}">
                        <td>${module.Sr_No}</td>
                        <td>${module.Detail}</td>
                        <td class="action-buttons">
                        <button class="btn btn-info update-button-book">Edit</button>
                        <button class="btn btn-danger delete-button-book">Delete</button>
                        <button class="btn btn-primary save-buttonu-book" style="display: none;">Save</button>
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
function fetchrefBookData() {
    $.ajax({
        url: `/api/refBookEntry?code=${window.selectedSubject}`, // Change this URL to match your Express route for courses
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            const courseData = $('#refBook_data');
            courseData.empty(); // Clear existing table data
            data.forEach(module => {
                const row = `
                    <tr data-module-id="${module._id}">
                        <td>${module.Sr_No}</td>
                        <td>${module.Detail}</td>
                        <td class="action-buttons">
                        <button class="btn btn-info update-button-refBook">Edit</button>
                        <button class="btn btn-danger delete-button-refBook">Delete</button>
                        <button class="btn btn-primary save-buttonu-refBook" style="display: none;">Save</button>
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
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>

        </tr>
    `;
    $('#co_data').append(emptyRow);
}
function addEmptyRowBook() {
    const rows = $('#book_data tr');
    const lastRow = rows.last(); // Get the last row
    const cells = lastRow.find('td');
    const lastModuleNo = parseInt(rows.eq(rows.length - 1).find('td').eq(0).text()) || 0;
    newModuleNo1=lastModuleNo;
    const newModuleNo = lastModuleNo + 1;
    const emptyRow = `
        <tr>
            <td contenteditable="false">${newModuleNo}</td>
            <td contenteditable="true"></td>
        </tr>
    `;
    $('#book_data').append(emptyRow);
}
function addEmptyRowrefBook() {
    const rows = $('#refBook_data tr');
    const lastRow = rows.last(); // Get the last row
    const cells = lastRow.find('td');
    const lastModuleNo = parseInt(rows.eq(rows.length - 1).find('td').eq(0).text()) || 0;
    newModuleNo1=lastModuleNo;
    const newModuleNo = lastModuleNo + 1;
    const emptyRow = `
        <tr>
            <td contenteditable="false">${newModuleNo}</td>
            <td contenteditable="true"></td>
        </tr>
    `;
    $('#refBook_data').append(emptyRow);
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
        colevels: cells.eq(2).text(),
        PO1: parseInt(cells.eq(3).text()),
        PO2: parseInt(cells.eq(4).text()),
        PO3: parseInt(cells.eq(5).text()),
        PO4: parseInt(cells.eq(6).text()),
        PO5: parseInt(cells.eq(7).text()),
        PO6: parseInt(cells.eq(8).text()),
        PO7: parseInt(cells.eq(9).text()),
        PO8: parseInt(cells.eq(10).text()),
        PO9: parseInt(cells.eq(11).text()),
        PO10: parseInt(cells.eq(12).text()),
        PO11: parseInt(cells.eq(13).text()),
        PO12: parseInt(cells.eq(14).text()),
        PSO1: parseInt(cells.eq(15).text()),
        PSO2: parseInt(cells.eq(16).text())

    };

    $.ajax({
        url: `/api/courses?code=${window.selectedSubject}`, // Change this URL to match your Express route
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

function saveDataToServerrefBook() {
    const rows = $('#refBook-data tr');
    const lastRow = rows.last(); // Get the last added row
    const cells = lastRow.find('td');


    const newData = {
        Sr_No:  parseInt(cells.eq(0).text()),
        Detail: cells.eq(1).text()

    };

    $.ajax({
        url: `/api/refBookEntry?code=${window.selectedSubject}`, // Change this URL to match your Express route
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

function saveDataToServerBook() {
    const rows = $('#book_data tr');
    const lastRow = rows.last(); // Get the last added row
    const cells = lastRow.find('td');
    const lastModuleNo = newModuleNo1;
   // const lastModuleNo = parseInt(rows.eq(rows.length - 2).find('td').eq(0).text()) || 6 ;// Get the last Module No. or 0 if none exists
    const newModuleNo = lastModuleNo + 1;

    cells.eq(0).text(newModuleNo);


    const newData = {
        Sr_No:  newModuleNo,
        Detail: cells.eq(1).text()

    };

    $.ajax({
        url: `/api/bookEntry?code=${window.selectedSubject}`, // Change this URL to match your Express route
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
        url: `/api/modules?code=${window.selectedSubject}`, // Change this URL to match your Express route
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
