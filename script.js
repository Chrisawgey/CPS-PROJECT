// Load the Google Charts library
google.charts.load('current', { packages: ['table'] });

// Variables to track whether a CSV file is loaded and the chart is displayed
let isCSVLoaded = false;
let isChartDisplayed = false;

// Function to clear the chart
function clearChart() {
    const googleTable = document.querySelector('.google-table');
    googleTable.innerHTML = ''; // Remove the chart
    isChartDisplayed = false; // Mark the chart as cleared
}

// Function to clear the error message for "View" submenu
function clearViewErrorMessage() {
    const messageArea = document.getElementById('graph-display');
    messageArea.textContent = ''; // Clear the message area
}

// Function to clear the error message for "File" submenu
function clearFileErrorMessage() {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = ''; // Clear the message area
}


// Function to display an error message for "View" submenu
function displayViewErrorMessage() {
    if (!isCSVLoaded) {
        clearViewErrorMessage(); // Clear any previous error message
        document.getElementById('graph-display').textContent = 'Please load data first';
    }
}

// Function to display the CSV data
function displayCSVData(csvData) {
    // Split the CSV data into rows
    const rows = csvData.split('\n');

    // Extract the column headers and data
    const headers = rows[0].split(',');
    const data = rows.slice(1);

    // Create a Google DataTable to hold the data
    const dataTable = new google.visualization.DataTable();

    // Process the header columns
    const visibleColumns = [];
    headers.forEach((header, index) => {
        // Check if there is at least one non-empty cell in the column
        const columnHasData = data.some(row => row.split(',')[index].trim() !== '');
        if (columnHasData) {
            dataTable.addColumn('string', header);
            visibleColumns.push(index);
        }
    });

    // Add data to the DataTable
    data.forEach((row) => {
        const rowData = row.split(',');
        const filteredRowData = visibleColumns.map(index => rowData[index]);
        dataTable.addRow(filteredRowData);
    });

    // Create a Google Chart
    const chart = new google.visualization.Table(document.querySelector('.google-table'));

    // Set maximum width and height for the chart
    const maxWidth = 600; // Adjust as needed
    const maxHeight = 400; // Adjust as needed

    // Draw the chart
    chart.draw(dataTable, { showRowNumber: true, width: maxWidth, height: maxHeight });
    isChartDisplayed = true; // Mark the chart as displayed

    // Clear the error message
    clearFileErrorMessage();

    // Display the number of records in the message area
    document.getElementById('message-area').textContent = `Number of Records: ${data.length}`;
}

// Add an event listener to the "Load CSV file" link
document.getElementById('load-csv').addEventListener('click', function () {
    if (!isCSVLoaded) {
        // Clear the error message in the 'graph-display' element
        clearViewErrorMessage();
    }
    // Trigger the hidden file input element
    document.getElementById('file-input').click();
});

// Add an event listener to the submenu items under "View" to trigger the message
const viewSubMenuItems = document.querySelectorAll('.menu li:has(ul) li a');
viewSubMenuItems.forEach(item => {
    item.addEventListener('click', function (event) {
        displayViewErrorMessage();
    });
});

// Add an event listener to the file input to handle the selected file
document.getElementById('file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        if (file.name.endsWith('.csv')) {
            if (isCSVLoaded) {
                // Remove the chart if it's displayed
                if (isChartDisplayed) {
                    clearChart();
                }

                // Clear any previous error messages
                clearFileErrorMessage();
            }

            // Read the selected file as text
            const reader = new FileReader();
            reader.onload = function (e) {
                const csvData = e.target.result;
                displayCSVData(csvData);
                isCSVLoaded = true;
            };
            reader.readAsText(file);
        } else {
            // Display an error and remove the chart
            clearViewErrorMessage();
            document.getElementById('message-area').textContent = 'The data is in the wrong format. Only CSV files can be loaded.';
            event.target.value = ''; // Clear the file input
            if (isChartDisplayed) {
                clearChart();
            }
        }
    }
});

// Function to display the chart based on the selected type
function displayChart(chartType) {
    // Map the selected chartType to the corresponding data choice
    let dataChoice;

    switch (chartType) {
        case 'bar':
        case 'line':
            dataChoice = 'TotalDeaths'; // Use 'TotalDeaths' for AvgWage
            break;
        case 'pie':
        case 'map':
            dataChoice = 'TotalCases'; // Use 'TotalCases' for EstimatedPopulation
            break;
        default:
            // Display "Not Applicable" message in the 'graph-display' div
            clearViewErrorMessage(); // Clear any previous error message
            document.getElementById('graph-display').textContent = 'Not Applicable';
            return;
    }

    // Hide the "Not Applicable" message in the 'graph-display' div
    clearViewErrorMessage();

    // Check if the selected chart type is valid for the data choice
    if ((dataChoice === 'TotalDeaths' || dataChoice === 'TotalCases') && (chartType === 'bar' || chartType === 'line' || chartType === 'pie' || chartType === 'map')) {
        // You can add the logic to display the Bar, Line, Pie, or Map chart here
        // Example: displayBarOrLineOrPieOrMapChart();
    } else {
        clearViewErrorMessage(); // Clear any previous error message
        document.getElementById('graph-display').textContent = 'Not Applicable';
    }

    // Display the number of records in the message area
    document.getElementById('message-area').textContent = `Number of Records: ${data.length}`;
}


// Add an event listener to ensure the page is fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Clear the error message in 'graph-display' after the DOM is fully loaded
    clearViewErrorMessage();
});

// Disable "Please load data first" on initial page load
document.getElementById('graph-display').textContent = '';

// Function to display information in a popup
function displayPopup(content) {
    alert(content); // Display the content in a popup box
}

// Add an event listener to the "Info" sub-menu under "Help"
document.querySelector('.menu li:has(ul) li a[href="#Info"]').addEventListener('click', function (event) {
    // Display your name, class ID, and project due date
    const infoContent = "Name: [Your Name]\nClass ID: [Your Class ID]\nProject Due Date: [Due Date]";
    displayPopup(infoContent);
});

// Add an event listener to the "Client" sub-menu under "Help"
document.querySelector('.menu li:has(ul) li a[href="#Client"]').addEventListener('click', function (event) {
    // Gather user's browser and OS information
    const browserInfo = `Browser: ${navigator.appName} ${navigator.appVersion}\n`;
    const cookieEnabled = `Cookies Enabled: ${navigator.cookieEnabled ? 'Yes' : 'No'}\n`;
    const javaEnabled = `Java Enabled: ${navigator.javaEnabled() ? 'Yes' : 'No'}\n`;

    // Combine all information
    const clientContent = `${browserInfo}${cookieEnabled}${javaEnabled}`;
    displayPopup(clientContent);
});

// Function to display user information in a popup
function displayUserInfo() {
    // You can replace these placeholders with actual user information
    const userInfo = {
        uid: "12345",
        login: "john_doe",
        name: "John Doe",
        gender: "Male"
    };

    // Construct the user information content
    const userInfoContent = `User ID: ${userInfo.uid}\nLogin: ${userInfo.login}\nName: ${userInfo.name}\nGender: ${userInfo.gender}`;

    displayPopup(userInfoContent);
}

// Add an event listener to the "User Info" submenu under "Setting"
document.querySelector('.menu li:has(ul) li a[href="#UserInfo"]').addEventListener('click', function (event) {
    displayUserInfo();
});

