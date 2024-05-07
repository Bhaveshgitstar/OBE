$(document).ready(() => {
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

  $("#academicYearDropdown").change(function () {
    $("#semesterDropdown").val("");
    $("#deptDropdown").val("");
    $("#subjectDropdown").val("");
  });

  $("#deptDropdown").change(function () {
    $("#semesterDropdown").val("");
    $("#subjectDropdown").val("");
  });
  $(document).on("click", ".update-buttonat", function () {
    const row = $(this).closest("tr");
    const cells = row.find("td");
    cells.attr("contenteditable", "true"); // Make cells editable
    row.find(".update-buttonat").hide();
    row.find(".delete-buttonat").hide();
    row.find(".save-buttonatu").show();
  });
  $(document).on("click", ".delete-buttonat", function () {
    const row = $(this).closest("tr");
    const moduleId = row.data("record-id");
    deleteRowat(moduleId, row);
  });

  $(document).on("click", ".save-buttonatu", function () {
    const row = $(this).closest("tr");
    const moduleId = row.data("record-id"); // Use data('record-id') to retrieve the recordId
    updateRowat(moduleId, row);
  });
  $("#setteacherButton").click(function () {
    // Get the selected teacher IDs from the checkboxes
    const selectedSubject = $("#subjectDropdown").val();
    const selectedTeacherIds = $('input[name="coordinatorCheckbox"]:checked')
      .map(function () {
        return $(this).val();
      })
      .get();

    // Make an AJAX request to update the teachers as coordinators
    $.post(
      "/set-teachers",
      { name: selectedTeacherIds, courseid: selectedSubject },
      function (response) {
        if (response.success) {
          alert("Teachers set as teachers successfully!");
          // You can also update the UI or perform any other actions as needed.
        } else {
          alert("Failed to set teachers.");
        }
      }
    );
  });

  // Add a click event handler for the "Set as Coordinators" button
  $("#setCoordinatorButton").click(function () {
    // Get the selected teacher IDs from the checkboxes
    const selectedSubject = $("#subjectDropdown").val();
    const selectedTeacherIds = $('input[name="coordinatorCheckbox"]:checked')
      .map(function () {
        return $(this).val();
      })
      .get();

    // Make an AJAX request to update the teachers as coordinators
    $.post(
      "/set-coordinators",
      { name: selectedTeacherIds, courseid: selectedSubject },
      function (response) {
        if (response.success) {
          alert("Teachers set as coordinators successfully!");
          // You can also update the UI or perform any other actions as needed.
        } else {
          alert("Failed to set teachers as coordinators.");
        }
      }
    );
  });

  function getDataButton() {
    // Get the selected values
    const selectedYear = $("#academicYearDropdown").val();
    const selectedSemester = $("#semesterDropdown").val();
    const department = $("#deptDropdown").val();

    // Make an AJAX request to fetch data based on all three selected values
    $.get(
      `/fetch-datacm?year=${selectedYear}&semester=${selectedSemester}&department=${department}`,
      function (data) {
        // Handle the received data as needed (e.g., update the UI)
        const corData = $("#cor-data");
        console.log(data);

        corData.empty();
        let tableHtml = '<table class="table table-bordered table-centered">';
        tableHtml += "<thead><tr>";
        tableHtml += "<th>Running Subjects</th>";
        tableHtml += "<th>Year</th>";
        tableHtml += "<th>Semester</th>";
        tableHtml += "<th>Department</th>";
        tableHtml += "<th>Credits</th>";
        tableHtml += "<th>Contact Hours</th>";
        tableHtml += `<th>NBA code</th>`;
        tableHtml += "<th>Action</th></tr></thead>";
        tableHtml += "<tbody>";

        data.forEach((data) => {
          tableHtml += '<tr data-record-id="' + data._id + '">';
          var x = data.co_name + " (" + data.co_code + ") ";
          tableHtml += `<td>${x}</td>`;
          tableHtml += `<td>${data.Year}</td>`;
          tableHtml += `<td>${data.sem}</td>`;
          tableHtml += `<td>${data.Branch}</td>`;
          tableHtml += `<td>${data.credits}</td>`;
          tableHtml += `<td>${data.contact_hours}</td>`;
          tableHtml += `<td>${data.NBAcode}</td>`;
          tableHtml += `
            <td class="action-buttons">
                <button class="btn btn-info update-buttonat">Edit</button>
                <button class="btn btn-danger delete-buttonat">Delete</button>
                <button class="btn btn-primary save-buttonatu" style="display: none;">Save</button>
            </td>`;
          tableHtml += "</tr>";
        });
        tableHtml += "</tbody></table>";
        tableHtml += `<div class="row mt-3">
        <div class="centered-button">
            <button class="btn btn-success" id="addsubjects">Add New Subjects</button>
        </div>
        </div>`;
        corData.append(tableHtml);
      }
    );
  }

  // Handle button click
  $(".get-data-button").click(getDataButton);

  function updateRowat(recordId, row) {
    const cells = row.find("td");
    var inputString = cells.eq(0).text();

    // Split the string using regex to separate the course name and course code
    var parts = inputString.split(/\s+\(([^)]+)\)/);

    // parts[0] will contain the course name
    var courseName = parts[0];
    console.log("Course Name:", courseName);
    -8;

    // parts[1] will contain the course code
    var courseCode = parts[1];
    console.log("Course Code:", courseCode);

    const updatedData = {
      co_code: courseCode,
      co_name: courseName,
      Year: parseInt(cells.eq(1).text()),
      sem: cells.eq(2).text(),
      Branch: cells.eq(3).text(),
      credits: parseInt(cells.eq(4).text()),
      contact_hours: cells.eq(5).text(),
      NBAcode: cells.eq(6).text(),
    };

    console.log(updatedData);
    $.ajax({
      url: `/api/coursedetail/${recordId}?code=${courseCode}`,
      type: "PUT",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(updatedData),
      success: function (response) {
        console.log("Data updated successfully:", response);
        getDataButton().catch(function (error) {
          console.error("Error:", error);
        });
      },
      error: function (error) {
        console.error("Error updating data:", error);
      },
    });

    // Restore UI state
    cells.attr("contenteditable", "false");
    row.find(".save-buttonatu").hide();
    row.find(".update-buttonat").show();
    row.find(".delete-buttonat").show();
  }

  function deleteRowat(moduleId, row) {
    const cells = row.find("td");
    var inputString = cells.eq(0).text();

    // Split the string using regex to separate the course name and course code
    var parts = inputString.split(/\s+\(([^)]+)\)/);

    // parts[0] will contain the course name
    var courseName = parts[0];
    console.log("Course Name:", courseName);
    -8;

    // parts[1] will contain the course code
    var courseCode = parts[1];
    //console.log("Course Code:", courseCode);
    $.ajax({
      url: `/api/course/${moduleId}?code=${courseCode}`, // Change this URL to match your Express route
      type: "DELETE",
      success: function (response) {
        console.log("Data updated successfully:", response);
        getDataButton().catch(function (error) {
          console.error("Error:", error);
        });
      },
      error: function (error) {
        console.error("Error deleting data:", error);
      },
    });
  }

  $("#savesubjects").click(function () {
    // Get the selected teacher IDs from the checkboxes

    // Make an AJAX request to update the teachers as coordinators
    $.post(
      "/addsubjects",
      { name: selectedTeacherIds, courseid: selectedSubject },
      function (response) {
        if (response.success) {
          alert("Teachers set as coordinators successfully!");
          // You can also update the UI or perform any other actions as needed.
        } else {
          alert("Failed to set teachers as coordinators.");
        }
      }
    );
  });

  $(document).on("click", "#addsubjects", function () {
    window.location.href = "/registercourse";
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
      document.setI;
      darkLight.classList.replace("bx-sun", "bx-moon");
    } else {
      darkLight.classList.replace("bx-moon", "bx-sun");
    }
  });

  // Define a function to fetch subjects based on selected year and semester

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
  const fileInput = document.getElementById("file");
  if (!fileInput.files[0]) {
    alert("Please select a file.");
    return;
  }

  // Optionally, you can ask the user for confirmation here.
  const confirmation = confirm(
    "Are you sure you want to upload the selected file?"
  );
  if (!confirmation) {
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  fetch(`/upload?code=${window.selectedSubject}`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Upload successful");
      location.reload(); // Reload the page
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle errors here
    });
}

function confirmDownload() {
  const url = `/generate-sample-excel?code=${window.selectedSubject}`;
  window.location.href = url;
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
