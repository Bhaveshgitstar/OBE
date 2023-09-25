window.onload = function() {
    alert('Welcome to the next page!');
};

$(document).ready(() => {
    fetchT1attainmentData();
    fetchcdData();
    fetchusername();
    fetchcourse();
    fetchuserrole();

    const menuIcon = document.getElementById("menu-icon");
    const menuopt = document.getElementById("menu-option1");
    const menuOptions1 = document.getElementById("menu-options1");

    const menuOptions = document.getElementById("menu-options");

    menuIcon.addEventListener("click", () => {
        if (menuOptions.style.display === "block") {
            menuOptions.style.display = "none";
        } else {
            menuOptions.style.display = "block";
        }
    });
    
    menuopt.addEventListener("click", () => {
        if (menuOptions1.style.display === "block") {
            menuOptions1.style.display = "none";
        } else {
            menuOptions1.style.display = "block";
        }
    });

    $(document).on('input', '.q-input', function () {
        const row = $(this).closest('tr');
        calculateAttainment1ForRow(row);
    });

    $('.add-row-buttonat').click(() => {
        addEmptyRow3();
    });

    $('.save-buttonat').click(() => {
        saveDataToServer3();
    });

    $(document).on('click', '.update-buttonat', function() {
        const row = $(this).closest('tr');
        const cells = row.find('td');
        cells.attr('contenteditable', 'true'); // Make cells editable
        row.find('.update-buttonat').hide();
        row.find('.delete-buttonat').hide();
        row.find('.save-buttonatu').show();
    });

    $(document).on('click', '.save-buttonatu', function() {
        const row = $(this).closest('tr');
        const moduleId = row.data('recordId');
        updateRowat(moduleId, row);
    });

    $(document).on('click', '.delete-buttonat', function() {
        const row = $(this).closest('tr');
        const moduleId = row.data('recordId');
        deleteRowat(moduleId);
    });
});

// ... (rest of your functions, like updateRow, deleteRow, fetchSyllabusData, addEmptyRow, saveDataToServer)

function updateRowat(recordId, row) {
    const cells = row.find('td');
    const updatedData = {
        ModuleNo: parseInt(cells.eq(0).text()),
        RollNo: parseInt(cells.eq(1).text()),
        Name: cells.eq(2).text(),
        Batch: cells.eq(3).text(),
        Q1: isNaN(parseFloat(cells.eq(4).text())) ? cells.eq(4).text() : parseFloat(cells.eq(4).text()),
        Q2: isNaN(parseFloat(cells.eq(5).text())) ? cells.eq(5).text() : parseFloat(cells.eq(5).text()),
        Q3: isNaN(parseFloat(cells.eq(6).text())) ? cells.eq(6).text() : parseFloat(cells.eq(6).text()),
        Q4: isNaN(parseFloat(cells.eq(7).text())) ? cells.eq(7).text() : parseFloat(cells.eq(7).text()),
        Q5: isNaN(parseFloat(cells.eq(8).text())) ? cells.eq(8).text() : parseFloat(cells.eq(8).text()),
        Q6: isNaN(parseFloat(cells.eq(9).text())) ? cells.eq(9).text() : parseFloat(cells.eq(9).text()),
        Total: 0, // Initialize Total to 0
        Attainment1: parseFloat(cells.eq(11).text()),
        Attainment2: parseFloat(cells.eq(12).text()) // Assuming the calculation for Attainment2 is in cell 12
    };

    // Calculate at1 and at2 values
    const at1 = [updatedData.Q1, updatedData.Q2, updatedData.Q3].reduce((acc, val) => isNaN(val) ? acc : acc + val, 0);
    const at2 = [updatedData.Q4, updatedData.Q5, updatedData.Q6].reduce((acc, val) => isNaN(val) ? acc : acc + val, 0);

    // Calculate attainment1 and attainment2 values
    const attainment1 = isNaN(at1) ? "N/A" : ((at1 / 11) * 100).toFixed(1);
    const attainment2 = isNaN(at2) ? "N/A" : ((at2 / 9) * 100).toFixed(1);

    // Calculate Total based on Q1 to Q6 values
    const total = [updatedData.Q1, updatedData.Q2, updatedData.Q3, updatedData.Q4, updatedData.Q5, updatedData.Q6].reduce((acc, val) => isNaN(val) ? acc : acc + val, 0);

    // Update the UI with new values
    cells.eq(10).text(total);
    cells.eq(11).text(attainment1);
    cells.eq(12).text(attainment2);

    // Update the Total in the updatedData object
    updatedData.Total = total;

    // Update the data and trigger an input event to handle saving the updated data
    updatedData.Attainment1 = parseFloat(attainment1);
    updatedData.Attainment2 = parseFloat(attainment2);

    $.ajax({
        url: `/api/t1attainment/${recordId}`, // Update the URL to match your Express route for T1attainment data
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(updatedData),
        success: function(response) {
            console.log('Data updated successfully:', response);
            fetchT1attainmentData();
            row.find('.q-input').trigger('input');
        },
        error: function(error) {
            console.error('Error updating data:', error);
        }
    });

    // Restore UI state
    cells.attr('contenteditable', 'false');
    row.find('.save-buttonuat').hide();
    row.find('.update-buttonat').show();
    row.find('.delete-buttonat').show();
}



function calculateAttainment1ForRow(row) {
    const cells = row.find('td');
    const q1 = parseFloat(cells.eq(4).text()) || 0;
    const q2 = parseFloat(cells.eq(5).text()) || 0;
    const q3 = parseFloat(cells.eq(6).text()) || 0;
    const q4 = parseFloat(cells.eq(7).text()) || 0;
    const q5 = parseFloat(cells.eq(8).text()) || 0;
    const q6 = parseFloat(cells.eq(9).text()) || 0;
    
    const total = q1 + q2 + q3 + q4 + q5 + q6;
    
    cells.eq(10).text(total.toFixed(2));
    const at1=q1 + q2 + q3;
    const at2=q4 + q5 + q6;
    const attainment1 = (at1 / 11 * 100).toFixed(1); 
    const attainment2 = (at2 / 9 * 100).toFixed(1); 

    cells.eq(11).text(attainment1);
    cells.eq(12).text(attainment2);

}
function deleteRowat(moduleId) {
    $.ajax({
        url: `/api/t1attainment/${moduleId}`, // Change this URL to match your Express route
        type: 'DELETE',
        success: function() {
            console.log('Data deleted successfully');
            fetchT1attainmentData();
        },
        error: function(error) {
            console.error('Error deleting data:', error);
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

function fetchusername(){
    $.ajax({
        url: '/api/get-username',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const username = data.username;
            console.log('Username:', username);
            $('#username').text(username);
        },
        error: function (error) {
            console.error('Error fetching username', error);
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

function fetchT1attainmentData() {
    $.ajax({
        url: '/api/t1attainment', // Update the URL to match your Express route for T1attainment data
        type: 'GET',
        dataType: 'json',

        success: function(data) {
            const attainmentData = $('#attainment-data');
            attainmentData.empty();
            let totalstudents=0;
            let absentstudent=0;
            let presentstudent=0;
            let avgmarks=0;
            let totalmarks=0;
            let coat1=0;
            let coat2=0;
            let totalat1student=0;
            let totalat2student=0;
            let pertotalat1student=0;
            let pertotalat2student=0;
            


            data.forEach(record => {
                const row = `
                    <tr data-record-id="${record._id}">
                        <td>${record.ModuleNo}</td>
                        <td>${record.RollNo}</td>
                        <td>${record.Name}</td>
                        <td>${record.Batch}</td>
                        <td>${record.Q1}</td>
                        <td>${record.Q2}</td>+
                        <td>${record.Q3}</td>
                        <td>${record.Q4}</td>
                        <td>${record.Q5}</td>
                        <td>${record.Q6}</td>
                        <td>${record.Total}</td>
                        <td>${record.Attainment1}</td>
                        <td>${record.Attainment2}</td>
                        <td class="action-buttons">
                            <button class="btn btn-info update-buttonat">Edit</button>
                            <button class="btn btn-danger delete-buttonat">Delete</button>
                            <button class="btn btn-primary save-buttonatu" style="display: none;">Save</button>
                        </td>
                    </tr>
                `;
                totalstudents=totalstudents+1;
                totalmarks=totalmarks+record.Total;
                if(record.Total===0){
                    absentstudent=absentstudent+1;
                }
                if(record.Attainment1>=50){
                    totalat1student=totalat1student+1;
                }
                if(record.Attainment2>=50){
                    totalat2student=totalat2student+1;
                }
                attainmentData.append(row);
            });

            presentstudent=totalstudents-absentstudent;
            avgmarks=totalmarks/totalstudents;
            pertotalat1student=(totalat1student/totalstudents)*100;
            pertotalat2student=(totalat2student/totalstudents)*100;

            if(pertotalat1student>=80){
                coat1=3;
            }
            else if(pertotalat1student<80 && pertotalat1student>=70){
                coat1=2;
            }
            else if(pertotalat1student<70 && pertotalat1student>=60){
                coat1=1;
            }
            else{
                coat1=0;
            }

            if(pertotalat2student>=80){
                coat2=3;
            }
            else if(pertotalat2student<80 && pertotalat2student>=70){
                coat2=2;
            }
            else if(pertotalat2student<70 && pertotalat2student>=60){
                coat2=1;
            }
            else{
                coat2=0;
            }

       /*     const totalRow = `
            <tr id="total-lectures-row">
                <th colspan="10">Average Marks</th>
                <th>${avgmarks}</th>
                <th></th> 
                <th></th>
                <th></th><!-- Empty cell for actions -->
            </tr>-
            <tr id="total-lectures-row">
            <th colspan="11">No. of Students Scored > = Target % (50%)</th>
            <th>${totalat1student}</th>
            <th>${totalat2student}</th>
            <th></th> <!-- Empty cell for actions -->
            </tr>-
            <tr id="total-lectures-row">
            <th colspan="11">% of Students Scored > = Target % (50%)</th>
            <th>${pertotalat1student}</th>
            <th>${pertotalat2student}</th>
            <th></th> <!-- Empty cell for actions -->
            </tr>-
            <tr id="total-lectures-row">
            <th colspan="11">CO Attainment Levels}</th>
            <th>${coat1}</th>
            <th>${coat2}</th>
            <th></th> <!-- Empty cell for actions -->
           </tr>-
           <tr id="total-lectures-row">
           <th colspan="11">Total Students </th>
           <th>${totalstudents}</th>
           <th>${totalstudents}</th>
           <th></th> <!-- Empty cell for actions -->
           </tr>-
            <tr id="total-lectures-row">
            <th colspan="11">No. of Students Appeared in T1</th>
            <th>${presentstudent}</th>
            <th>${presentstudent}</th>
            <th></th> <!-- Empty cell for actions -->
            </tr>-

        `;

         attainmentData.append(totalRow);*/
        },
        
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}

function addColumns() {
    // Get the number of columns to add from the input field.
    const numColumns = document.getElementById('num-columns').value;

    // Create an array of column names.
    const columnNames = [];
    for (let i = 0; i < numColumns; i++) {
        columnNames.push(prompt(`Enter the name of column ${i + 1}: `));
    }

    // Get the table element.
    const table = document.getElementById('attainment-table');

    // Get the Q6 column header.
    const q6ColumnHeader = table.querySelector('thead th:nth-child(10)');

    // Add new columns to the table header after the Q6 column header.
    const headerRow = table.querySelector('thead tr');
    for (const columnName of columnNames) {
        const headerCell = document.createElement('th');
        headerCell.textContent = columnName;
        headerRow.insertBefore(headerCell, q6ColumnHeader.nextSibling);
    }

    // Add new columns to the table body after the Q6 column.
    const tableBody = table.querySelector('tbody');
    for (const row of tableBody.querySelectorAll('tr')) {
        const q6Cell = row.querySelector('td:nth-child(10)');
        for (const columnName of columnNames) {
            const cell = document.createElement('td');
            cell.textContent = '0';
            row.insertBefore(cell, q6Cell.nextSibling);
        }
    }
    $.ajax({
        url: '/api/updatedb', // Update the URL to match your Express route for T1attainment data
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ columnNames }), // Send columnNames as JSON data
        success: function(response) {
            console.log('Data saved successfully:', response);
            // You can add code here to handle the success response
            // and update your table as needed.
        },
        error: function(xhr, status, error) {
            console.error('Error saving data:', error);
            console.log('Status:', status);
            console.log('Response:', xhr.responseText);
            // You can add error handling code here if needed.
        }
    });
    //   addColumnsToSchema(columnNames);
}



function fetchcdData() {
    $.ajax({
        url: '/api/cd', // Change this URL to match your Express route
        type: 'GET',
        dataType: 'json',
        
        success: function (data) {
            data.forEach(module => {
                $('#co_code').text(module.co_code);
                $('#sem').text(module.sem);
                $('#co_name').text(module.co_name);
                $('#credits').text(module.credits);
                $('#contact_hours').text(module.contact_hours);
                $('#coordinators').text(module.coordinators);
                $('#teacher').text(module.teachers);
            });
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}

let newModuleNo1 = 0;

function addEmptyRow3() {

    const rows = $('#attainment-data tr');
    const lastRow = rows.last(); // Get the last row
    const cells = lastRow.find('td');
    const lastModuleNo = parseInt(rows.eq(rows.length - 2).find('td').eq(0).text()) || 0;
    newModuleNo1 = lastModuleNo;
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
            <td contenteditable="true" class="q-input"></td>
            <td contenteditable="true" class="q-input"></td>
            <td contenteditable="true" class="q-input"></td>
            <td contenteditable="true" class="q-input"></td>
            <td contenteditable="true" class="q-input"></td>
            <td contenteditable="true" class="q-input"></td>
            <td class="total"></td>
            <td  class="attainment1"></td>
            <td class="attainment2"></td>
           
        </tr>
    `;
    $('#attainment-data').append(emptyRow);

}

function saveDataToServer3() {
    const rows = $('#attainment-data tr');
    const lastRow = rows.last(); // Get the last added row
    const cells = lastRow.find('td');
    const lastModuleNo = newModuleNo1;
    const newModuleNo = lastModuleNo + 1;

    cells.eq(0).text(newModuleNo);

    // Determine if Q1 to Q6 contain the string "A"
    const containsA = [4, 5, 6, 7, 8, 9].some(index => cells.eq(index).text() === "A");

    // Calculate at1 and at2 values
    const at1 = containsA ? 0 : [4, 5, 6].reduce((acc, index) => acc + parseFloat(cells.eq(index).text() || 0), 0);
    const at2 = containsA ? 0 : [7, 8, 9].reduce((acc, index) => acc + parseFloat(cells.eq(index).text() || 0), 0);

    // Calculate attainment1 and attainment2 values
    let attainment1, attainment2;

    if (containsA) {
        attainment1 = 0;
        attainment2 = 0;
    } else {
        attainment1 = ((at1 / 11) * 100).toFixed(1);
        attainment2 = ((at2 / 9) * 100).toFixed(1);
    }

    const newData = {
        ModuleNo: newModuleNo,
        RollNo: cells.eq(1).text(),
        Name: cells.eq(2).text(),
        Batch: cells.eq(3).text(),
        Q1: containsA ? cells.eq(4).text() : parseFloat(cells.eq(4).text() || 0),
        Q2: containsA ? cells.eq(5).text() : parseFloat(cells.eq(5).text() || 0),
        Q3: containsA ? cells.eq(6).text() : parseFloat(cells.eq(6).text() || 0),
        Q4: containsA ? cells.eq(7).text() : parseFloat(cells.eq(7).text() || 0),
        Q5: containsA ? cells.eq(8).text() : parseFloat(cells.eq(8).text() || 0),
        Q6: containsA ? cells.eq(9).text() : parseFloat(cells.eq(9).text() || 0),
        Total: containsA ? 0 : [4, 5, 6, 7, 8, 9].reduce((acc, index) => acc + parseFloat(cells.eq(index).text() || 0), 0),
        Attainment1: attainment1,
        Attainment2: attainment2
    };

    $.ajax({
        url: '/api/t1attainment', // Update the URL to match your Express route for T1attainment data
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(newData),
        success: function(response) {
            console.log('Data saved successfully:', response);
            fetchT1attainmentData(); // Refresh table with updated data
        },
        error: function(xhr, status, error) {
            console.error('Error saving data:', error);
            console.log('Status:', status);
            console.log('Response:', xhr.responseText);
        }
    });
}
