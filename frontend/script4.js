
    $(document).ready(() => {
        // Function to fetch data from the server
        function fetchDataFromServer() {
            // Use AJAX to fetch data from your server
            $.ajax({
                url: '/', // Replace with your actual endpoint
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    // Call a function to create the table based on the retrieved data
                    createTableFromData(data);
                },
                error: function (error) {
                    console.error('Error fetching data:', error);
                }
            });
        }

        // Function to create the table based on the retrieved data
        function createTableFromData(data) {
            const tableBody = $("#copo tbody");

            // Loop through the data and create rows for each entry
            data.forEach(entry => {
                const newRow = $("<tr>");

                // Loop through the properties of each entry and create cells
                for (const key in entry) {
                    if (entry.hasOwnProperty(key)) {
                        const cell = $("<td>").text(entry[key]);
                        newRow.append(cell);
                    }
                }

                // Append the new row to the table body
                tableBody.append(newRow);
            });
        }

        // Fetch data and create the table when the page loads
        fetchDataFromServer();
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
    });
    
      
