window.onload = function() {
    alert('Welcome to the next page!');
};

$(document).ready(() => {
    fetchcopoData()
        .then(() => fetchcopoData2())
        .catch(error => {
            console.error('Error in fetching data:', error);
        });
    fetchcoposoData()
        .then(() => fetchcoposoData2())
        .catch(error => {
            console.error('Error in fetching data:', error);
        });
    fetchcoposoatData()
        .then(() => fetchcoposoatData2())
        .catch(error => {
            console.error('Error in fetching data:', error);
        });


    // fetchT1attainmentData()
    //     .then(fetchT1CO)
    //     .then(fetchT1CO2)
    //     .then(fetchT1attainmentData2)
    //     .catch(function(error) {
    //         console.error('Error:', error);
    //     });
    fetchcdData();
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
        const moduleId = row.data('record-id'); // Use data('record-id') to retrieve the recordId
        updateRowat(moduleId, row);
    });

    $(document).on('click', '.delete-buttonat', function() {
        const row = $(this).closest('tr');
        const moduleId = row.data('record-id');
        deleteRowat(moduleId);
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

function confirmUpload() {
    const fileInput = document.getElementById('file');
    if (!fileInput.files[0]) {
        alert('Please select a file.');
        return;
    }

    // Optionally, you can ask the user for confirmation here.
    const confirmation = confirm('Are you sure you want to upload the selected file?');
    if (!confirmation) {
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    fetch('/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            alert('Upload successful');
            location.reload(); // Reload the page
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors here
        });
}


// ... (rest of your functions, like updateRow, deleteRow, fetchSyllabusData, addEmptyRow, saveDataToServer)

/*function updateRowat(recordId, row) {
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

*/


function updateRowat(recordId, row) {
    const cells = row.find('td');
    const updatedData = {
        COs: cells.eq(0).text(),
        COAttainments: parseFloat(cells.eq(1).text()),
        PO1: parseFloat(cells.eq(2).text()),
        PO2: parseFloat(cells.eq(3).text()),
        PO3: parseFloat(cells.eq(4).text()),
        PO4: parseFloat(cells.eq(5).text()),
        PO5: parseFloat(cells.eq(6).text()),
        PO6: parseFloat(cells.eq(7).text()),
        PO7: parseFloat(cells.eq(8).text()),
        PO8: parseFloat(cells.eq(9).text()),
        PO9: parseFloat(cells.eq(10).text()),
        PO10: parseFloat(cells.eq(11).text()),
        PO11: parseFloat(cells.eq(12).text()),
        PO12: parseFloat(cells.eq(13).text()),
        PSO1: parseFloat(cells.eq(14).text()),
        PSO2: parseFloat(cells.eq(15).text())
    };

    // Update the data and trigger an input event to handle saving the updated data
    $.ajax({
        url: `/api/coposo/${recordId}`, // Update the URL to match your Express route for coposo data
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(updatedData),
        success: function(response) {
            console.log('Data updated successfully:', response);
            // Add any additional actions or fetch data calls here
            row.find('.q-input').trigger('input');
        },
        error: function(error) {
            console.error('Error updating data:', error);
        }
    });

    // Restore UI state
    cells.attr('contenteditable', 'false');
    row.find('.save-buttonatu').hide();
    row.find('.update-buttonat').show();
    row.find('.delete-buttonat').show();
}

function deleteRowat(moduleId) {
    $.ajax({
        url: `/api/coposo/${moduleId}`, // Change this URL to match your Express route
        type: 'DELETE',
        success: function() {
            console.log('Data deleted successfully');
            fetchcoposoData()
                .then(function() {
                    return fetchcoposoData2();
                })
                .catch(function(error) {
                    console.error('Error:', error);
                });
        },
        error: function(error) {
            console.error('Error deleting data:', error);
        }
    });
}


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



// function fetchcopoCO2() {
//     return new Promise((resolve, reject) => {
//         $.ajax({
//             url: '/api/copo',
//             type: 'GET',
//             dataType: 'json',

//             success: function(dataco) {
//                 const attainmentDataco2 = $('#copo-data');
//                 let tableHtml = '<thead><tr>';
//                 const tableHeaders = Object.keys(dataco[0]);

//                 const qColumns = tableHeaders.filter(header => /^Q\d+$/.test(header));
//                 qColumns.sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));

//                 const aColumns = tableHeaders.filter(header => /^Attainment\d+$/.test(header));
//                 aColumns.sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));

//                 const desiredOrder = ['ModuleNo', 'RollNo', 'Name', 'Batch', ...qColumns, 'Total', ...aColumns];

//                 // Create the table header row
//                 desiredOrder.forEach(header => {
//                     tableHtml += `<th>${header}</th>`;
//                 });
//                 tableHtml += '<th>Action</th></tr></thead><tbody>';

//                 // Create table body rows
//                 dataco.forEach((record, index) => {
//                     tableHtml += '<tr data-record-id="' + record._id + '">';

//                     desiredOrder.forEach(header => {
//                         if (tableHeaders.includes(header)) {
//                             tableHtml += `<td>${record[header]}</td>`;
//                         }
//                     });

//                     // Additional column for Action (you can modify this based on your requirements)
//                     tableHtml += '<td><button class="edit-button">Edit</button></td>';
//                     tableHtml += '</tr>';
//                 });

//                 tableHtml += '</tbody>';
//                 attainmentDataco2.html(tableHtml);

//                 resolve();
//             },
//             error: function(error) {
//                 console.error('Error fetching data:', error);
//                 reject(error);
//             }
//         });
//     });
// }




function fetchcopoData2() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/copo',
            type: 'GET',
            dataType: 'json',

            success: function(data) {
                const attainmentData = $('#copo-data');

                if (data.length > 0) {
                    // Create an array of column headers based on the keys of the first record
                    const tableHeaders = Object.keys(data[0]);

                    // Exclude '_id' from the desired order
                    const desiredOrder = tableHeaders.filter(header => header !== '_id');

                    tableHtml = '<tbody>';
                    data.forEach((record, index) => {
                        tableHtml += '<tr data-record-id="' + record._id + '">';
                        desiredOrder.forEach(header => {
                            tableHtml += `<td>${record[header]}</td>`;
                        });

                        tableHtml += '</tr>';
                    });

                    tableHtml += '</tbody>';
                    attainmentData.append(tableHtml);

                    // Calculate and add summary rows
                    const summaryRow = `
                        <!-- Your summary row HTML goes here -->
                    `;
                    attainmentData.append(summaryRow);
                } else {
                    // Handle the case where there is no data
                    attainmentData.html('<p>No data available.</p>');
                }
                resolve();
            },
            error: function(error) {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}

function fetchcoposoData2() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/coposo',
            type: 'GET',
            dataType: 'json',

            success: function(data) {
                const attainmentData = $('#coposo-data');

                if (data.length > 0) {
                    // Create an array of column headers based on the keys of the first record
                    const tableHeaders = Object.keys(data[0]);

                    // Exclude '_id' from the desired order
                    const desiredOrder = tableHeaders.filter(header => header !== '_id');

                    tableHtml = '<tbody>';
                    data.forEach((record, index) => {
                        tableHtml += '<tr data-record-id="' + record._id + '">';
                        desiredOrder.forEach(header => {
                            tableHtml += `<td>${record[header]}</td>`;
                        });
                        tableHtml += `
                        <td class="action-buttons">
                            <button class="btn btn-info update-buttonat">Edit</button>
                            <button class="btn btn-danger delete-buttonat">Delete</button>
                            <button class="btn btn-primary save-buttonatu" style="display: none;">Save</button>
                        </td>`;


                    });

                    tableHtml += '</tr>';
                    tableHtml += '</tbody>';
                    attainmentData.append(tableHtml);

                    // Calculate and add summary rows
                    const summaryRow = `
                        <!-- Your summary row HTML goes here -->
                    `;
                    attainmentData.append(summaryRow);
                } else {
                    // Handle the case where there is no data
                    attainmentData.html('<p>No data available.</p>');
                }
                resolve();
            },
            error: function(error) {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}

function fetchcoposoatData2() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/coposoat',
            type: 'GET',
            dataType: 'json',

            success: function(data) {
                const attainmentData = $('#coposoat-data');

                if (data.length > 0) {
                    // Create an array of column headers based on the keys of the first record
                    const tableHeaders = Object.keys(data[0]);

                    // Exclude '_id' from the desired order
                    const desiredOrder = tableHeaders.filter(header => header !== '_id');

                    tableHtml = '<tbody>';
                    data.forEach((record, index) => {
                        tableHtml += '<tr data-record-id="' + record._id + '">';
                        desiredOrder.forEach(header => {
                            tableHtml += `<td>${record[header]}</td>`;
                        });

                        tableHtml += '</tr>';
                    });

                    tableHtml += '</tbody>';
                    attainmentData.append(tableHtml);

                    // Calculate and add summary rows
                    const summaryRow = `
                        <!-- Your summary row HTML goes here -->
                    `;
                    attainmentData.append(summaryRow);
                } else {
                    // Handle the case where there is no data
                    attainmentData.html('<p>No data available.</p>');
                }
                resolve();
            },
            error: function(error) {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}

function fetchcopoData2correct() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/copo', // Update the URL to match your Express route for T1attainment data
            type: 'GET',
            dataType: 'json',

            success: function(data) {
                const attainmentData = $('#copo-data');


                if (data.length > 0) {
                    // Create an array of column headers based on the keys of the first record
                    const tableHeaders = Object.keys(data[0]);


                    // Specify the desired order of columns (S.No, RollNo, Name, Batch, Q1 to Qn, Total, Attainment, Action)
                    const desiredOrder = ['COs', 'T1', 'T2', 'T3', 'T-AVG', 'Project', 'Quiz', 'Assgn-AVG', 'Direct-Attainment', 'Student-Feedback', 'Final'];

                    tableHtml = '<tbody>';
                    data.forEach((record, index) => {
                        tableHtml += '<tr data-record-id="' + record._id + '">';
                        desiredOrder.forEach(header => {
                            if (tableHeaders.includes(header)) {

                                tableHtml += `<td>${record[header]}</td>`;

                            }
                        });

                        tableHtml += '</tr>';




                    });

                    tableHtml += '</tbody>';
                    attainmentData.append(tableHtml);

                    // Calculate and add summary rows


                    attainmentData.append(summaryRow);
                } else {
                    // Handle the case where there is no data
                    attainmentData.html('<p>No data available.</p>');
                }
                resolve();
            },
            error: function(error) {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}

function fqetchcopoData2() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/copo',
            type: 'GET',
            dataType: 'json',

            success: function(data) {
                const attainmentData = $('#copo-data');
                console.log('Data from API:', data);

                if (data.length > 0) {
                    const tableHeaders = Object.keys(data[0]);
                    const desiredOrder = ['COs', 'T1', 'T2', 'T3', 'T-AVG', 'Project', 'Quiz', 'Assgn-AVG', 'Direct-Attainment', 'Student-Feedback', 'Final'];

                    let tableHtml = '<tbody>';
                    data.forEach((record, index) => {
                        tableHtml += `<tr data-record-id="${record._id}">`;
                        desiredOrder.forEach(header => {
                            if (tableHeaders.includes(header)) {
                                tableHtml += `<td>${record[header]}</td>`;
                            }
                        });


                    });


                    attainmentData.append(tableHtml); // Use append to add to existing content
                } else {
                    attainmentData.append('<p>No data available.</p>'); // Use append to add to existing content
                }
                resolve();
            },
            error: function(error) {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}




function fetchT1attainmentData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/t1attainment', // Update the URL to match your Express route for T1attainment data
            type: 'GET',
            dataType: 'json',

            success: function(data) {
                const attainmentData = $('#attainment-data');
                attainmentData.empty();

                if (data.length > 0) {
                    // Create an array of column headers based on the keys of the first record
                    const tableHeaders = Object.keys(data[0]);
                    // Create an array for Q columns and sort them numerically
                    const qColumns = tableHeaders.filter(header => /^Q\d+$/.test(header));
                    qColumns.sort((a, b) => {
                        const aNumber = parseInt(a.slice(1));
                        const bNumber = parseInt(b.slice(1));
                        return aNumber - bNumber;
                    });
                    const aColumns = tableHeaders.filter(header => /^Attainment\d+$/.test(header));
                    aColumns.sort((a, b) => {
                        const aNumber = parseInt(a.slice(1));
                        const bNumber = parseInt(b.slice(1));
                        return aNumber - bNumber;
                    });

                    // Specify the desired order of columns (S.No, RollNo, Name, Batch, Q1 to Qn, Total, Attainment, Action)
                    const desiredOrder = ['ModuleNo', 'RollNo', 'Name', 'Batch', ...qColumns, 'Total', ...aColumns];

                    // Create the table header row
                    let tableHtml = '<thead><tr>';
                    desiredOrder.forEach(header => {
                        if (tableHeaders.includes(header)) {
                            if (header === 'ModuleNo') {
                                tableHtml += '<th>S.No</th>';
                            } else {
                                tableHtml += `<th>${header}</th>`;
                            }
                        }
                    });
                    tableHtml += '<th>Action</th></tr></thead>';
                    attainmentData.append(tableHtml);


                } else {
                    // Handle the case where there is no data
                    attainmentData.html('<p>No data available.</p>');
                }
                resolve();
            },
            error: function(error) {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}

function fetchcopoData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/copo',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                const attainmentData = $('#copo-data');
                attainmentData.empty();

                if (data.length > 0) {
                    const tableHeaders = Object.keys(data[0]);
                    console.log('tableHeaders:', tableHeaders); // Log the original table headers

                    // Filter out the MongoDB _id field
                    const filteredHeaders = tableHeaders.filter(header => header !== "_id");

                    let tableHtml = '<thead><tr>';

                    filteredHeaders.forEach(header => {
                        tableHtml += `<th>${header}</th>`;
                    });

                    attainmentData.append(tableHtml);
                } else {
                    attainmentData.html('<p>No data available.</p>');
                }
                resolve();
            },
            error: function(error) {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}

function fetchcoposoData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/coposo',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                const attainmentData = $('#coposo-data');
                attainmentData.empty();

                if (data.length > 0) {
                    const tableHeaders = Object.keys(data[0]);
                    console.log('tableHeaders:', tableHeaders); // Log the original table headers

                    // Filter out the MongoDB _id field
                    const filteredHeaders = tableHeaders.filter(header => header !== "_id");

                    let tableHtml = '<thead><tr>';

                    filteredHeaders.forEach(header => {
                        tableHtml += `<th>${header}</th>`;
                    });
                    tableHtml += '<th>Action</th></tr></thead>';
                    attainmentData.append(tableHtml);
                } else {
                    attainmentData.html('<p>No data available.</p>');
                }
                resolve();
            },
            error: function(error) {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}

function fetchcoposoatData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/coposoat',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                const attainmentData = $('#coposoat-data');
                attainmentData.empty();

                if (data.length > 0) {
                    const tableHeaders = Object.keys(data[0]);
                    console.log('tableHeaders:', tableHeaders); // Log the original table headers

                    // Filter out the MongoDB _id field
                    const filteredHeaders = tableHeaders.filter(header => header !== "_id");

                    let tableHtml = '<thead><tr>';

                    filteredHeaders.forEach(header => {
                        tableHtml += `<th>${header}</th>`;
                    });

                    attainmentData.append(tableHtml);
                } else {
                    attainmentData.html('<p>No data available.</p>');
                }
                resolve();
            },
            error: function(error) {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}










function updatenewmarks(columnName, marks) {

    $.ajax({
        url: '/api/updatedbmarks', // Update the URL to match your Express route for T1attainment data
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ columnName, marks }), // Send columnNames as JSON data
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


}



function fetchcdData() {
    $.ajax({
        url: '/api/cd', // Change this URL to match your Express route
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            data.forEach(module => {
                $('#co_code').text(module.co_code);
                $('#sem').text(module.sem);
                $('#co_name').text(module.co_name);
                $('#credits').text(module.credits);
                $('#contact_hours').text(module.contact_hours);

                // Display coordinators as a comma-separated list
                if (module.coordinators && module.coordinators.length > 0) {
                    const coordinatorsList = module.coordinators.join(', ');
                    $('#coordinators').text(coordinatorsList);
                } else {
                    $('#coordinators').text('N/A'); // Handle case when there are no coordinators
                }

                $('#teacher').text(module.teachers);
            });
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}


let newModuleNo1 = 0;

function addEmptyRow3() {
    const rows = $('#coposo-data tr');
    const lastRow = rows.last();
    // Get the last row
    const cells = lastRow.find('td');
    const lastModuleNo = parseInt(rows.eq(rows.length - 7).find('td').eq(0).text()) || 0;
    newModuleNo1 = lastModuleNo;
    const newModuleNo = lastModuleNo + 1;

    console.log('Last Module No:', lastModuleNo);
    console.log('New Module No:', newModuleNo);

    cells.eq(0).text(newModuleNo);

    const numColumns = rows.eq(rows.length - 7).find('td').length; // Determine the number of columns dynamically

    let emptyRow = '<tbody><tr>';
    for (let i = 0; i < numColumns - 1; i++) {
        if (i === 0) {
            emptyRow += `<td contenteditable="false">${newModuleNo}</td>`;
        } else {
            emptyRow += '<td contenteditable="true"></td>';
        }
    }
    emptyRow += '<td></td></tr></tbody>';

    $('#coposo-data').append(emptyRow);
}





/*function saveDataToServer3() {
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
*/

function fetchatindices(atIndices) {
    const rows = $('#coposo-data tr');
    const row = rows.eq(1);
    const cells = row.find('td');

    for (let i = cells.length - 3; i < cells.length - 1; i++) {
        const cellText = cells.eq(i).text().trim();
        atIndices.push(cellText);
    }

    // Log the entire array
    console.log(atIndices);

    return atIndices;
}

function fetchcoIndices(coIndices) {
    const rows = $('#coposo-data tr');
    const row = rows.eq(1);
    const cells = row.find('td');
    for (let i = 4; i < cells.length - 4; i++) {
        const cellText = cells.eq(i).text().trim();
        coIndices.push(cellText);
    }
    console.log(coIndices);
    return coIndices;

}

function fetchmarks(qmarks) {
    const rows = $('#coposo-data tr');
    const row = rows.eq(2);
    const cells = row.find('td');
    for (let i = 4; i < cells.length - 3; i++) {
        const cellText = cells.eq(i).text().trim();
        qmarks.push(cellText);
    }
    return qmarks;

}

function saveDataToServer3() {
    const rows = $('#coposo-data tr');
    const lastRow = rows.last(); // Get the last added row
    const cells = lastRow.find('td');

    // Fixed COs value
    const newCOs = cells.eq(0).text().trim(); // Assuming COs is in the first cell

    // Extract values for each field
    const COAttainments = parseFloat(cells.eq(1).text().trim());
    const PO1 = parseFloat(cells.eq(2).text().trim());
    const PO2 = parseFloat(cells.eq(3).text().trim());
    const PO3 = parseFloat(cells.eq(4).text().trim());
    const PO4 = parseFloat(cells.eq(5).text().trim());
    const PO5 = parseFloat(cells.eq(6).text().trim());
    const PO6 = parseFloat(cells.eq(7).text().trim());
    const PO7 = parseFloat(cells.eq(8).text().trim());
    const PO8 = parseFloat(cells.eq(9).text().trim());
    const PO9 = parseFloat(cells.eq(10).text().trim());
    const PO10 = parseFloat(cells.eq(11).text().trim());
    const PO11 = parseFloat(cells.eq(12).text().trim());
    const PO12 = parseFloat(cells.eq(13).text().trim());
    const PSO1 = parseFloat(cells.eq(14).text().trim());
    const PSO2 = parseFloat(cells.eq(15).text().trim());

    // Create newData object
    const newData = {
        COs: newCOs,
        COAttainments: COAttainments,
        PO1: PO1,
        PO2: PO2,
        PO3: PO3,
        PO4: PO4,
        PO5: PO5,
        PO6: PO6,
        PO7: PO7,
        PO8: PO8,
        PO9: PO9,
        PO10: PO10,
        PO11: PO11,
        PO12: PO12,
        PSO1: PSO1,
        PSO2: PSO2
    };

    $.ajax({
        url: '/api/coposo', // Update the URL to match your Express route for coposo data
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(newData),
        success: function(response) {
            console.log('Data saved successfully:', response);


            // Add any additional actions or fetch data calls here
        },
        error: function(xhr, status, error) {
            console.error('Error saving data:', error);
            console.log('Status:', status);
            console.log('Response:', xhr.responseText);
        }

    });

}