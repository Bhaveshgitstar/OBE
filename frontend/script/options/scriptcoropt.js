function fetchSubjects(username) {
  $.get(`/subjectsopt?user=${username}`, function (data) {
      const subjectDropdown = $('#subjectDropdown');
      subjectDropdown.empty(); // Clear existing options

      const user = data.usercourse;
      console.log(user);
      

      const subjectOpt = data.subjectOptions;
      console.log(subjectOpt);


      const coordinatorIndexes = []; // Array to store indexes of coordinator roles

      // Find indexes of coordinator roles in usercourse
      user.Role.forEach((Role, index) => {
          if (Role === "Coordinator") {
              coordinatorIndexes.push(index);
          }
      });
      console.log(coordinatorIndexes);

      // Filter subjects based on coordinator indexes and find subject names
      const coordinatorSubjects = coordinatorIndexes.map(index => {
          const subjectCode = user.Course[index];
          return subjectCode+" ("+subjectOpt.find(subject => subject.co_code === subjectCode).co_name+") ";
      });
      console.log(coordinatorSubjects);

      // Add subjects to dropdown
      subjectDropdown.append('<option value="" disabled selected>Select Subject Code</option>');
      coordinatorSubjects.forEach(subjectName => {
          subjectDropdown.append($('<option></option>').attr('value', subjectName).text(subjectName));
      });
  });
}

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




  // Handle button click
$('.get-data-button').click(function () {
    const selectedSubject = $('#subjectDropdown').val();
    const indexOfParenthesis = selectedSubject.indexOf(' ');
    const partBeforeParenthesis = indexOfParenthesis !== -1 ? selectedSubject.substring(0, indexOfParenthesis).trim() : selectedSubject;

    // Redirect to the attainmentt1 page with the selectedSubject as a query parameter
    window.location.href = `/attainmentt1?subject=${encodeURIComponent(partBeforeParenthesis)}`;
});
$('.get-data-buttont2').click(function () {
  const selectedSubject = $('#subjectDropdown').val();
  const indexOfParenthesis = selectedSubject.indexOf(' ');
  const partBeforeParenthesis = indexOfParenthesis !== -1 ? selectedSubject.substring(0, indexOfParenthesis).trim() : selectedSubject;

  // Redirect to the attainmentt1 page with the selectedSubject as a query parameter
  window.location.href = `/attainmentt2?subject=${encodeURIComponent(partBeforeParenthesis)}`;
});
$('.get-data-buttonco').click(function () {
  const selectedSubject = $('#subjectDropdown').val();
  const indexOfParenthesis = selectedSubject.indexOf(' ');
  const partBeforeParenthesis = indexOfParenthesis !== -1 ? selectedSubject.substring(0, indexOfParenthesis).trim() : selectedSubject;

  // Redirect to the attainmentt1 page with the selectedSubject as a query parameter
  window.location.href = `/courseoutcome?subject=${encodeURIComponent(partBeforeParenthesis)}`;
});
$('.get-data-buttont3').click(function () {
  const selectedSubject = $('#subjectDropdown').val();
  const indexOfParenthesis = selectedSubject.indexOf(' ');
  const partBeforeParenthesis = indexOfParenthesis !== -1 ? selectedSubject.substring(0, indexOfParenthesis).trim() : selectedSubject;

  // Redirect to the attainmentt1 page with the selectedSubject as a query parameter
  window.location.href = `attainmentt3?subject=${encodeURIComponent(partBeforeParenthesis)}`;
});
$('.get-data-buttonta').click(function () {
  const selectedSubject = $('#subjectDropdown').val();
  const indexOfParenthesis = selectedSubject.indexOf(' ');
  const partBeforeParenthesis = indexOfParenthesis !== -1 ? selectedSubject.substring(0, indexOfParenthesis).trim() : selectedSubject;

  // Redirect to the attainmentt1 page with the selectedSubject as a query parameter
  window.location.href = `attainmentta?subject=${encodeURIComponent(partBeforeParenthesis)}`;
});
$('.get-data-buttoncopso').click(function () {
  const selectedSubject = $('#subjectDropdown').val();
  const indexOfParenthesis = selectedSubject.indexOf(' ');
  const partBeforeParenthesis = indexOfParenthesis !== -1 ? selectedSubject.substring(0, indexOfParenthesis).trim() : selectedSubject;

  // Redirect to the attainmentt1 page with the selectedSubject as a query parameter
  window.location.href = `atcopsomap?subject=${encodeURIComponent(partBeforeParenthesis)}`;
});
$('.get-data-buttonsett1').click(function () {
  const selectedSubject = $('#subjectDropdown').val();
  const indexOfParenthesis = selectedSubject.indexOf(' ');
  const partBeforeParenthesis = indexOfParenthesis !== -1 ? selectedSubject.substring(0, indexOfParenthesis).trim() : selectedSubject;

  // Redirect to the attainmentt1 page with the selectedSubject as a query parameter
  window.location.href = `courseexamt1?subject=${encodeURIComponent(partBeforeParenthesis)}`;
});
$('.get-data-buttonsett2').click(function () {
  const selectedSubject = $('#subjectDropdown').val();
  const indexOfParenthesis = selectedSubject.indexOf(' ');
  const partBeforeParenthesis = indexOfParenthesis !== -1 ? selectedSubject.substring(0, indexOfParenthesis).trim() : selectedSubject;

  // Redirect to the attainmentt1 page with the selectedSubject as a query parameter
  window.location.href = `courseexamt2?subject=${encodeURIComponent(partBeforeParenthesis)}`;
});
$('.get-data-buttonsett3').click(function () {
  const selectedSubject = $('#subjectDropdown').val();
  const indexOfParenthesis = selectedSubject.indexOf(' ');
  const partBeforeParenthesis = indexOfParenthesis !== -1 ? selectedSubject.substring(0, indexOfParenthesis).trim() : selectedSubject;

  // Redirect to the attainmentt1 page with the selectedSubject as a query parameter
  window.location.href = `courseexamt3?subject=${encodeURIComponent(partBeforeParenthesis)}`;
});
$('.get-data-buttonopeningreport').click(function () {
  const selectedSubject = $('#subjectDropdown').val();
  const indexOfParenthesis = selectedSubject.indexOf(' ');
  const partBeforeParenthesis = indexOfParenthesis !== -1 ? selectedSubject.substring(0, indexOfParenthesis).trim() : selectedSubject;

  // Redirect to the attainmentt1 page with the selectedSubject as a query parameter
  window.location.href = `openingreport?subject=${encodeURIComponent(partBeforeParenthesis)}`;
});

$('.get-data-buttonclosingreport').click(function () {
  const selectedSubject = $('#subjectDropdown').val();
  const indexOfParenthesis = selectedSubject.indexOf(' ');
  const partBeforeParenthesis = indexOfParenthesis !== -1 ? selectedSubject.substring(0, indexOfParenthesis).trim() : selectedSubject;

  // Redirect to the attainmentt1 page with the selectedSubject as a query parameter
  window.location.href = `closingreport?subject=${encodeURIComponent(partBeforeParenthesis)}`;
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
          fetchSubjects(username);
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
