window.onload = function () {
  //alert('Welcome to the next page!');
};

$(document).ready(() => {
  fetchcopoData();
  fetchcdData();
  fetchusername();
  fetchcourse();
  fetchuserrole();

  const body = document.querySelector("body");
  const darkLight = document.querySelector("#darkLight");
  const sidebar = document.querySelector(".sidebar");
  $(".sidebar").addClass("close hoverable");

  const submenuItems = document.querySelectorAll(".submenu_item");
  const sidebarOpen = document.querySelector("#sidebarOpen");
  const sidebarClose = document.querySelector(".collapse_sidebar");
  const sidebarExpand = document.querySelector(".expand_sidebar");

  sidebarOpen.addEventListener("click", () =>
    sidebar.classList.toggle("close")
  );

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
      document.setI;
      darkLight.classList.replace("bx-sun", "bx-moon");
    } else {
      darkLight.classList.replace("bx-moon", "bx-sun");
    }
  });

  let noc = 10;
  let noa = noc + 3;

  $(document).on("input", ".q-input", function () {
    const row = $(this).closest("tr");
    calculateAttainment1ForRow(row);
  });

  $(".add-row-buttonat").click(() => {
    addEmptyRow3();
  });

  $(".save-buttonat").click(() => {
    saveDataToServer3();
  });
  $(".add-qcolumn-buttonat").click(() => {
    noc = addColumnsq(noc);
    fetchT1attainmentData();
    noa = noa + 1;
  });
  $(".add-acolumn-buttonat").click(() => {
    noa = addColumnsa(noa);
  });

  $(document).on("click", ".update-buttonat", function () {
    const row = $(this).closest("tr");
    const cells = row.find("td");
    cells.attr("contenteditable", "true"); // Make cells editable
    row.find(".update-buttonat").hide();
    row.find(".delete-buttonat").hide();
    row.find(".save-buttonatu").show();
  });

  $(document).on("click", ".save-buttonatu", function () {
    const row = $(this).closest("tr");
    const moduleId = row.data("record-id"); // Use data('record-id') to retrieve the recordId
    updateRowat(moduleId, row);
  });

  $(document).on("click", ".delete-buttonat", function () {
    const row = $(this).closest("tr");
    const moduleId = row.data("record-id");
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

function fetchuserrole() {
  $.ajax({
    url: "/api/get-userrole",
    type: "GET",
    dataType: "json",
    success: function (data) {
      const userrole = data.userrole;
      console.log("Userrole:", userrole);
      $("#userrole").text(userrole);
    },
    error: function (error) {
      console.error("Error fetching userrole", error);
    },
  });
}

function fetchusername() {
  $.ajax({
    url: "/api/get-username",
    type: "GET",
    dataType: "json",
    success: function (data) {
      const username = data.username;
      console.log("Username:", username);
      $("#username").text(username);
      $("#username1").text(username);
    },
    error: function (error) {
      console.error("Error fetching username", error);
    },
  });
}

function fetchcourse() {
  $.ajax({
    url: "/api/get-usercourse",
    type: "GET",
    dataType: "json",
    success: function (data) {
      const usercourse = data.usercourse;
      console.log("Userrole:", usercourse);
      $("#course_code").text(usercourse);
    },
    error: function (error) {
      console.error("Error fetching usercourse", error);
    },
  });
}
function fetchcopoData2() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/copo?code=${window.selectedSubject}`,
      type: "GET",
      dataType: "json",

      success: function (data) {
        const attainmentData = $("#copo-data");

        if (data.length > 0) {
          data.sort((a, b) => a.COs.localeCompare(b.COs));
          // Create an array of column headers based on the keys of the first record
          const tableHeaders = Object.keys(data[0]);

          // Exclude '_id' from the desired order
          const desiredOrder = [
            "COs",
            "T1",
            "T2",
            "T3",
            "T-AVG",
            "Assignment",
            "Project",
            "AVG(Quiz+Assignment)",
            "Direct Attainment",
            "Feedback",
            "Final",
            "CIE",
            "SEE",
          ];

          tableHtml = "<tbody>";
          var coAttainment = [];
          data.forEach((record, index) => {
            var currArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var present = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var i = 0;
            tableHtml += '<tr data-record-id="' + record._id + '">';
            desiredOrder.forEach((header) => {
              if (parseInt(record[header]) >= 0 || i == 0) {
                currArray[i] = parseInt(record[header]);
                present[i] += 1;
                tableHtml += `<td>${record[header]}</td>`;
              } else if (header === "T-AVG") {
                currArray[i] =
                  (currArray[1] + currArray[2] + currArray[3]) /
                  (present[1] + present[2] + present[3]);
                tableHtml += `<td>${currArray[i].toFixed(1)}</td>`;
              } else if (header === "AVG(Quiz+Assignment)") {
                currArray[i] =
                  (currArray[6] + currArray[7]) / (present[6] + present[7]) ||
                  0;
                tableHtml += `<td>${currArray[i].toFixed(1)}</td>`;
              } else if (header === "Direct Attainment") {
                currArray[i] = 0.8 * currArray[4] + 0.2 * currArray[7] || 0;
                tableHtml += `<td>${currArray[i].toFixed(1)}</td>`;
              } else if (header === "Final") {
                currArray[i] = currArray[8] + 0.2 * currArray[9] || 0;
                tableHtml += `<td>${currArray[i].toFixed(1)}</td>`;
                coAttainment.push(currArray[i].toFixed(1));
              } else if (header === "CIE") {
                currArray[i] =
                  (currArray[1] + currArray[2] + currArray[5] + currArray[6]) /
                    (present[1] + present[2] + present[5] + present[6]) || 0;
                tableHtml += `<td>${currArray[i].toFixed(1)}</td>`;
              } else if (header === "SEE") {
                currArray[i] = currArray[3];
                tableHtml += `<td>${currArray[i].toFixed(1)}</td>`;
              } else {
                tableHtml += `<td>-</td>`;
              }
              i++;
            });

            tableHtml += "</tr>";
            console.log(currArray);
            console.log(present);
            console.log(coAttainment);
          });

          tableHtml += "</tbody>";
          attainmentData.append(tableHtml);

          // Calculate and add summary rows
          const summaryRow = `
                      <!-- Your summary row HTML goes here -->
                  `;
          attainmentData.append(summaryRow);
        } else {
          // Handle the case where there is no data
          attainmentData.html("<p>No data available.</p>");
        }
        resolve();
        fetchcoposoData();
        fetchcoposoData2(coAttainment);
      },
      error: function (error) {
        console.error("Error fetching data:", error);
        reject(error);
      },
    });
  });
}

function fetchcoposoData2(coAttainment) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/coposo?code=${window.selectedSubject}`,
      type: "GET",
      dataType: "json",

      success: function (data) {
        console.log(data);
        const attainmentData = $("#coposo-data");

        if (data.length > 0) {
          data.sort((a, b) => a.coid.localeCompare(b.coid));
          resolve(data);
          const tableHeaders = Object.keys(data[0]);

          // Exclude '_id' from the desired order
          const desiredOrder = [
            "coid",
            "CO Attainments",
            "PO1",
            "PO2",
            "PO3",
            "PO4",
            "PO5",
            "PO6",
            "PO7",
            "PO8",
            "PO9",
            "PO10",
            "PO11",
            "PO12",
            "PSO1",
            "PSO2",
          ];

          tableHtml = "<tbody>";
          const avgArray = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ];
          const countArray = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ];
          var lastTable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          var co = "";
          var j = 0;
          data.forEach((record, index) => {
            var i = 0;

            tableHtml += '<tr data-record-id="' + record._id + '">';

            desiredOrder.forEach((header) => {
              avgArray[i] = avgArray[i] + parseFloat(record[header]);
              lastTable[i] =
                lastTable[i] + coAttainment[j] * parseFloat(record[header]);
              if (parseInt(record[header]) != 0) {
                countArray[i] = countArray[i] + 1;
              }
              i++;
              if (header === "CO Attainments") {
                tableHtml += `<td>${coAttainment[j]}</td>`;
              } else {
                tableHtml += `<td>${record[header]}</td>`;
              }
              co = record["coid"];
            });
            j++;
            tableHtml += "</tr>";
          });

          var result = co.substring(0, co.length - 2);

          tableHtml += '<tr data-record-id="' + '">';
          tableHtml += `<td colspan=2>NBA Code:${result}</td>`;

          for (var i = 2; i < 16; i++) {
            lastTable[i] = lastTable[i] / avgArray[i] || 0;
            avgArray[i] = Math.round(avgArray[i] / countArray[i]) || 0;
            tableHtml += `<td>${avgArray[i]}</td>`;
          }

          //console.log("last",lastTable);
          tableHtml += "</tr>";

          tableHtml += "</tbody>";
          attainmentData.append(tableHtml);

          // Calculate and add summary rows
          const summaryRow = `
                      <!-- Your summary row HTML goes here -->
                  `;
          attainmentData.append(summaryRow);
        } else {
          // Handle the case where there is no data
          attainmentData.html("<p>No data available.</p>");
        }
        resolve();
        fetchcoposoatData();
        fetchcoposoatData2(lastTable, co);
      },
      error: function (error) {
        console.error("Error fetching data:", error);
        reject(error);
      },
    });
  });
}

function saveDatatocopsoatini(newData) {
  $.ajax({
    url: `/api/coposoat?code=${window.selectedSubject}`, // Update the URL to match your Express route for T1attainment data
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(newData),
    success: function (response) {
      console.log("Data saved successfully:", response);
    },
    error: function (xhr, status, error) {
      console.error("Error saving data:", error);
      console.log("Status:", status);
      console.log("Response:", xhr.responseText);
    },
  });
}

function fetchcoposoatData2(lastTable, co) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/coposoat?code=${window.selectedSubject}`,
      type: "GET",
      dataType: "json",

      success: function (data) {
        const attainmentData = $("#coposoat-data");

        if (data.length > 0) {
          // Create an array of column headers based on the keys of the first record
          const tableHeaders = Object.keys(data[0]);
          console.log(lastTable);

          // Exclude '_id' from the desired order
          const desiredOrder = tableHeaders.filter(
            (header) => header !== "_id"
          );

          tableHtml = "<tbody>";
          var result = co.substring(0, co.length - 2);
          data.forEach((record, index) => {
            var i = 2;
            tableHtml += '<tr data-record-id="' + record._id + '">';
            desiredOrder.forEach((header) => {
              if (header === "Course") {
                tableHtml += `<td>NBA Code:${result}</td>`;
              } else {
                tableHtml += `<td>${lastTable[i].toFixed(1)}</td>`;
                i++;
              }
            });

            tableHtml += "</tr>";
          });

          tableHtml += "</tbody>";
          attainmentData.append(tableHtml);

          // Calculate and add summary rows
          const summaryRow = `
                      <!-- Your summary row HTML goes here -->
                  `;
          attainmentData.append(summaryRow);
        } else {
          // Handle the case where there is no data
          attainmentData.html("<p>No data available.</p>");
        }
        const newData = {
          Course: result,
          PO1: parseFloat(lastTable[2]),
          PO2: parseFloat(lastTable[3]),
          PO3: parseFloat(lastTable[4]),
          PO4: parseFloat(lastTable[5]),
          PO5: parseFloat(lastTable[6]),
          PO6: parseFloat(lastTable[7]),
          PO7: parseFloat(lastTable[8]),
          PO8: parseFloat(lastTable[9]),
          PO9: parseFloat(lastTable[10]),
          PO10: parseFloat(lastTable[11]),
          PO11: parseFloat(lastTable[12]),
          PO12: parseFloat(lastTable[13]),
          PSO1: parseFloat(lastTable[14]),
          PSO2: parseFloat(lastTable[15]),
        };
        saveDatatocopsoatini(newData);
        resolve();
      },
      error: function (error) {
        console.error("Error fetching data:", error);
        reject(error);
      },
    });
  });
}

function fetchcopoData() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/copo?code=${window.selectedSubject}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        const attainmentData = $("#copo-data");
        attainmentData.empty();

        if (data.length > 0) {
          const tableHeaders = Object.keys(data[0]);
          console.log("tableHeaders:", tableHeaders); // Log the original table headers

          // Filter out the MongoDB _id field
          const filteredHeaders = [
            "COs",
            "T1",
            "T2",
            "T3",
            "T-AVG",
            "Assignment",
            "Project",
            "AVG(Quiz+Assignment)",
            "Direct Attainment",
            "Student Feedback (Indirect Assessment)",
            "Final (Direct + 20% Indirect)",
            "CIE",
            "SEE",
          ];

          let tableHtml = "<thead><tr>";

          filteredHeaders.forEach((header) => {
            tableHtml += `<th>${header}</th>`;
          });

          attainmentData.append(tableHtml);
        } else {
          attainmentData.html("<p>No data available.</p>");
        }
        resolve();
        fetchcopoData2();
      },
      error: function (error) {
        console.error("Error fetching data:", error);
        reject(error);
      },
    });
  });
}

function fetchcoposoData() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/coposo?code=${window.selectedSubject}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        const attainmentData = $("#coposo-data");
        attainmentData.empty();

        if (data.length > 0) {
          const tableHeaders = Object.keys(data[0]);
          console.log("tableHeaders:", tableHeaders); // Log the original table headers

          // Filter out the MongoDB _id field
          const filteredHeaders = [
            "",
            "CO Attainments",
            "PO1",
            "PO2",
            "PO3",
            "PO4",
            "PO5",
            "PO6",
            "PO7",
            "PO8",
            "PO9",
            "PO10",
            "PO11",
            "PO12",
            "PSO1",
            "PSO2",
          ];

          let tableHtml = "<thead><tr>";

          filteredHeaders.forEach((header) => {
            tableHtml += `<th>${header}</th>`;
          });

          attainmentData.append(tableHtml);
        } else {
          saveDatatocopsoatini();
          fetchcoposoData();
          attainmentData.html("<p>No data available.</p>");
        }
        resolve();
      },
      error: function (error) {
        console.error("Error fetching data:", error);
        reject(error);
      },
    });
  });
}

function fetchcoposoatData() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/coposoat?code=${window.selectedSubject}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        const attainmentData = $("#coposoat-data");
        attainmentData.empty();

        if (data.length > 0) {
          const tableHeaders = Object.keys(data[0]);
          console.log("tableHeaders:", tableHeaders); // Log the original table headers

          // Filter out the MongoDB _id field
          const filteredHeaders = tableHeaders.filter(
            (header) => header !== "_id"
          );

          let tableHtml = "<thead><tr>";

          filteredHeaders.forEach((header) => {
            tableHtml += `<th>${header}</th>`;
          });

          attainmentData.append(tableHtml);
        } else {
          attainmentData.html("<p>No data available.</p>");
        }

        resolve();
      },
      error: function (error) {
        console.error("Error fetching data:", error);
        reject(error);
      },
    });
  });
}

function fetchcdData() {
  $.ajax({
    url: `/api/cd?code=${window.selectedSubject}`, // Change this URL to match your Express route
    type: "GET",
    dataType: "json",
    success: function (data) {
      data.forEach((module) => {
        $("#co_code").text(module.co_code);
        $("#sem").text(module.sem);
        $("#co_name").text(module.co_name);
        $("#credits").text(module.credits);
        $("#contact_hours").text(module.contact_hours);

        // Display coordinators as a comma-separated list
        if (module.coordinators && module.coordinators.length > 0) {
          const coordinatorsList = module.coordinators.join(", ");
          $("#coordinators").text(coordinatorsList);
        } else {
          $("#coordinators").text("N/A"); // Handle case when there are no coordinators
        }

        $("#teacher").text(module.teachers);
      });
    },
    error: function (error) {
      console.error("Error fetching data:", error);
    },
  });
}

function fetchatindices(atIndices) {
  const rows = $("#copo-data tr");
  const row = rows.eq(1);
  const cells = row.find("td");

  for (let i = cells.length - 3; i < cells.length - 1; i++) {
    const cellText = cells.eq(i).text().trim();
    atIndices.push(cellText);
  }

  // Log the entire array
  console.log(atIndices);

  return atIndices;
}

function fetchcoIndices(coIndices) {
  const rows = $("#copo-data tr");
  const row = rows.eq(1);
  const cells = row.find("td");
  for (let i = 4; i < cells.length - 4; i++) {
    const cellText = cells.eq(i).text().trim();
    coIndices.push(cellText);
  }
  console.log(coIndices);
  return coIndices;
}

function fetchmarks(qmarks) {
  const rows = $("#copo-data tr");
  const row = rows.eq(2);
  const cells = row.find("td");
  for (let i = 4; i < cells.length - 3; i++) {
    const cellText = cells.eq(i).text().trim();
    qmarks.push(cellText);
  }
  return qmarks;
}

function saveDataToServer3() {
  const rows = $("#copo-data tr");
  const lastRow = rows.last(); // Get the last added row
  const cells = lastRow.find("td");
  const lastModuleNo = newModuleNo1;
  const newModuleNo = lastModuleNo + 1;

  cells.eq(0).text(newModuleNo);

  // Determine if Q1 to Qn contain the string "A" or "?"
  const qIndices = [];
  let coIndices = [];
  let atIndices = [];
  coIndices = fetchcoIndices(coIndices);
  console.log(coIndices);
  atIndices = fetchatindices(atIndices);
  console.log(atIndices);
  let qmarks = [];
  qmarks = fetchmarks(qmarks);
  console.log(qmarks);
  const qValues = [];

  for (let i = 4; i < cells.length - 4; i++) {
    const cellText = cells.eq(i).text().trim();
    qIndices.push(i - 4);
    qValues.push(cellText);
  }

  const containsAOrQuestionMark = qValues.some((value) => value === "A");

  // Initialize at1 to atn with zeros
  const at = Array(atIndices.length).fill(0);
  const marks = Array(atIndices.length).fill(0);

  // Calculate at1 to atn only when coIndices and atIndices match
  for (let i = 0; i < atIndices.length; i++) {
    const atIndex = atIndices[i];
    let atValue = 0.0;
    let atmarks = 0.0;

    // Check if coIndices has a corresponding entry and it matches
    for (let j = 4; j < cells.length - 4; j++) {
      if (coIndices[j - 4] === atIndex) {
        console.log(coIndices[j - 4]);
        console.log(atIndex);
        atValue += parseFloat(qValues[j - 4] || 0);
        atmarks += parseFloat(qmarks[j - 4] || 0);
      }
      console.log(atValue);
      console.log(atmarks);
      at[i] = atValue;
      marks[i] = atmarks;
    }
  }

  // at now contains at1 to atn values based on matching indices between coIndices and atIndices

  // Calculate attainment1 and attainment2 values
  let attainment1, attainment2;

  if (containsAOrQuestionMark) {
    attainment1 = 0;
    attainment2 = 0;
  } else {
    attainment1 = ((at[0] / marks[0]) * 100).toFixed(1);
    attainment2 = ((at[1] / marks[1]) * 100).toFixed(1);
  }

  const newData = {
    ModuleNo: newModuleNo,
    RollNo: cells.eq(1).text(),
    Name: cells.eq(2).text(),
    Batch: cells.eq(3).text(),
    ...qIndices.reduce((acc, index, i) => {
      const qValue = qValues[index];
      acc[`Q${i + 1}`] = containsAOrQuestionMark
        ? qValue
        : parseFloat(qValue || 0);
      return acc;
    }, {}),
    Total: containsAOrQuestionMark
      ? 0
      : qIndices.reduce(
          (acc, index) => acc + parseFloat(cells.eq(4 + index).text() || 0),
          0
        ),
    Attainment1: attainment1,
    Attainment2: attainment2,
  };

  $.ajax({
    url: "/api/copo", // Update the URL to match your Express route for T1attainment data
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(newData),
    success: function (response) {
      console.log("Data saved successfully:", response);
      fetchT1attainmentData()
        .then(fetchT1CO)
        .then(fetchT1CO2)
        .then(fetchT1attainmentData2)
        .catch(function (error) {
          console.error("Error:", error);
        }); // Refresh table with updated data
    },
    error: function (xhr, status, error) {
      console.error("Error saving data:", error);
      console.log("Status:", status);
      console.log("Response:", xhr.responseText);
    },
  });
}
