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

sidebarOpen.addEventListener("click", () => sidebar.classList.toggle("close"));

$('#academicYearDropdown').change(function () {
  $('#semesterDropdown').val('');
  $('#deptDropdown').val('');
  $('#subjectDropdown').val('');
});

$('#deptDropdown').change(function () {
  $('#semesterDropdown').val('');
  $('#subjectDropdown').val('');
});


$('#setteacherButton').click(function () {
  // Get the selected teacher IDs from the checkboxes
  const selectedSubject = $('#subjectDropdown').val();
  const selectedTeacherIds = $('input[name="coordinatorCheckbox"]:checked').map(function() {
      return $(this).val();
  }).get();

  // Make an AJAX request to update the teachers as coordinators
  $.post('/set-teachers', { name: selectedTeacherIds, courseid: selectedSubject }, function (response) {
      if (response.success) {
          alert('Teachers set as teachers successfully!');
          // You can also update the UI or perform any other actions as needed.
      } else {
          alert('Failed to set teachers.');
      }
  });

});

// Add a click event handler for the "Set as Coordinators" button
$('#setCoordinatorButton').click(function () {
  // Get the selected teacher IDs from the checkboxes
  const selectedSubject = $('#subjectDropdown').val();
  const selectedTeacherIds = $('input[name="coordinatorCheckbox"]:checked').map(function() {
      return $(this).val();
  }).get();

  // Make an AJAX request to update the teachers as coordinators
  $.post('/set-coordinators', { name: selectedTeacherIds, courseid: selectedSubject }, function (response) {
      if (response.success) {
          alert('Teachers set as coordinators successfully!');
          // You can also update the UI or perform any other actions as needed.
      } else {
          alert('Failed to set teachers as coordinators.');
      }
  });
});



  // Handle button click
  $('.get-data-button').click(function () {
    // Get the selected values
    const selectedYear = $('#academicYearDropdown').val();
    const selectedSemester = $('#semesterDropdown').val();
    const department = $('#deptDropdown').val();

    // Make an AJAX request to fetch data based on all three selected values
    $.get(`/fetch-datacm?year=${selectedYear}&semester=${selectedSemester}&department=${department}`, function (data) {
      // Handle the received data as needed (e.g., update the UI)
      const corData = $('#cor-data');
      console.log(data);

      corData.empty();
      let tableHtml = '<table class="table table-bordered table-centered">';
      tableHtml += '<thead><tr>';
      tableHtml += '<th>Available Teachers</th>';
      tableHtml += '<th>Make Coordinator</th></tr></thead>';
      tableHtml += '<tbody>';

      data.forEach(data => {
          tableHtml += '<tr>';
          tableHtml += `<td>${data.co_code}</td>`;
          tableHtml += '<td class="text-center">'; // Center-align the content
          tableHtml += `<input type="checkbox" class="form-check-input" id="makeCoordinatorCheckbox_${data.co_code}" name="coordinatorCheckbox" value="${data.co_code}">`;
          tableHtml += '</td>';
          tableHtml += '</tr>';
      });
      tableHtml += '</tbody></table>';
      corData.append(tableHtml);
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
