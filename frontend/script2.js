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
