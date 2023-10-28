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

// Add an event listener to the "Load CSV file" link
document.getElementById('load-csv').addEventListener('click', function () {
    // Trigger the hidden file input element
    document.getElementById('file-input').click();
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
                clearErrorMessage();
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
            displayErrorMessage("The data is in the wrong format. Only CSV files can be loaded.");
            event.target.value = ""; // Clear the file input
            if (isChartDisplayed) {
                clearChart();
            }
        }
    }
});

function displayErrorMessage(message) {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = message;
}

function clearErrorMessage() {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = "";
}

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
        const columnHasData = data.some(row => row.split(',')[index].trim() !== "");
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
    clearErrorMessage();

    // Display the number of records in the message area
    document.getElementById('message-area').textContent = `Number of Records: ${data.length}`;
}

// Function to clear the table and graph areas
function clearTableAndGraph() {
    // Clear the table area
    document.querySelector('.google-table').innerHTML = '';
    // Clear the message area
    document.getElementById('message-area').textContent = '';
    // Clear the error message
    clearErrorMessage();
}

// Add an event listener to the "Exit" menu item
document.getElementById('exit').addEventListener('click', function () {
    cleanMemoryAndCloseTab();
});

// Function to perform any necessary memory cleanup and close the current tab or window
function cleanMemoryAndCloseTab() {
    // Perform any necessary memory cleanup here

    // Close the current browser tab or window
    window.close();
}

// Function to display the chart based on the selected type
function displayChart(chartType) {
    if (!isCSVLoaded) {
        displayErrorMessage("Please load data first.");
        return;
    }

    // Map the selected chartType to the corresponding data choice
    let dataChoice;
    switch (chartType) {
        case "bar":
        case "line":
            dataChoice = "TotalDeaths"; // Use "TotalDeaths" for AvgWage
            break;
        case "pie":
            dataChoice = "TotalCases"; // Use "TotalCases" for EstimatedPopulation
            break;
        default:
            // Display "Not Applicable" message in the "graph-display" div
            document.getElementById('graph-display').textContent = "Not Applicable";
            return;
    }

    // Hide the "Not Applicable" message in the "graph-display" div
    document.getElementById('graph-display').textContent = '';

    // Check if the selected chart type is valid for the data choice
    if (dataChoice === "TotalDeaths" && (chartType === "bar" || chartType === "line")) {
        // You can add the logic to display the Bar or Line chart here
        // Example: displayBarOrLineChart();
    } else if (dataChoice === "TotalCases" && chartType === "pie") {
        // You can add the logic to display the Pie chart here
        // Example: displayPieChart();
    } else {
        displayErrorMessage("Not Applicable");
    }

    // Display the number of records in the message area
    document.getElementById('message-area').textContent = `Number of Records: ${data.length}`;
}





// Select the "View" sub-menu items by class
const viewSubMenuItems = document.querySelectorAll('.menu li:has(ul) li a');

// Add event listeners to the "View" sub-menu items
viewSubMenuItems.forEach(item => {
    item.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
        const chartType = event.target.textContent.toLowerCase(); // Get the selected chart type
        displayChart(chartType);
    });
});
