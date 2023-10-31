// Load the Google Charts library
google.charts.load('current', { packages: ['corechart', 'table', 'geochart'] });


// Variables to track whether a CSV file is loaded and the chart is displayed
let isCSVLoaded = false;
let isChartDisplayed = false;

// Store the selected chart type based on the radio buttons
let selectedChartType = null;

// Store the loaded CSV data
let loadedCSVArray = [];

// Separate arrays for different chart types
let barChartData = [];
let lineChartData = [];
let pieChartData = [];
let mapChartData = [];

// Function to clear the graph display area
function clearChart() {
    const graphDisplay = document.querySelector('.graph-display');
    graphDisplay.innerHTML = '';
    isChartDisplayed = false;
}

// Function to display the chart in the "graph-display" area
function displayChart(chart) {
    const graphDisplay = document.querySelector('.graph-display');
    graphDisplay.appendChild(chart);
    isChartDisplayed = true;
}


function clearViewErrorMessage() {
    const messageArea = document.getElementById('graph-display');
    messageArea.textContent = '';
}

function clearFileErrorMessage() {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = '';
}

function displayViewErrorMessage() {
    if (!isCSVLoaded) {
        clearViewErrorMessage();
        document.getElementById('graph-display').textContent = 'Please load data first';
    }
}

function displayCSVData(csvData) {
    const rows = csvData.split('\n');
    const headers = rows[0].split(',');
    const data = rows.slice(1);
    loadedCSVArray = data.map(row => row.split(','));

    if (selectedChartType) {
        // Call the addDataToChartArray function with the appropriate chart type
        addDataToChartArray(selectedChartType, loadedCSVArray);
    }

    // Define the indices of the columns you want to display
    const columnIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Adjust these indices as needed

    const dataTable = new google.visualization.DataTable();
    headers.forEach((header, index) => {
        if (columnIndices.includes(index)) {
            dataTable.addColumn('string', header);
        }
    });
    data.forEach((row) => {
        const rowData = row.split(',');
        const filteredRowData = columnIndices.map(index => rowData[index]);
        dataTable.addRow(filteredRowData);
    });

    const chart = new google.visualization.Table(document.querySelector('.google-table'));
    const maxWidth = 600;
    const maxHeight = 400;
    chart.draw(dataTable, { showRowNumber: true, width: maxWidth, height: maxHeight });
    isChartDisplayed = true;
    clearFileErrorMessage();
    document.getElementById('message-area').textContent = `Number of Records: ${data.length}`;
}


function addDataToChartArray(chartType, data) {
    const filteredData = data.map(row => [
        row[0], // id
        row[1], // state
        parseFloat(row[2]), // total cases
        parseFloat(row[3]), // new cases
        parseFloat(row[4]), // total deaths
        parseFloat(row[5]), // new deaths
        parseFloat(row[6]), // total tests
        parseFloat(row[7]), // population
        row[8] // date
    ]);

    if (chartType === 'bar') {
        barChartData = filteredData.map(row => [row[1], row[2]]);
    } else if (chartType === 'line') {
        lineChartData = filteredData.map(row => [row[1], row[2]]);
    } else if (chartType === 'pie') {
        pieChartData = filteredData.map(row => ({ label: row[1], value: row[2] }));
    } else if (chartType === 'map') {
        mapChartData = filteredData.map(row => ({
            region: row[1],  // The region name (e.g., state)
            value: row[2],   // The value associated with the region
            // Add additional properties if needed
        }));
    }
}
const barChartDiv = document.getElementById('bar-chart');
const lineChartDiv = document.getElementById('line-chart');
const pieChartDiv = document.getElementById('pie-chart');
const mapChartDiv = document.getElementById('map-chart');

function createBarChart() {
    if (barChartData.length > 0) {
        // Create and display the bar chart
        // ...

        // Instructions: You need the HTML <div id='barchart'> </div> to display the chart.
        // Ensure you have a <div> element with id 'barchart' in your HTML.
    }
}

function createLineChart() {
    if (lineChartData.length > 0) {
        // Create and display the line chart
        // ...

        // Instructions: You need the HTML <div id='linechart'> </div> to display the chart.
        // Ensure you have a <div> element with id 'linechart' in your HTML.
    }
}

function createPieChart() {
    if (pieChartData.length > 0) {
        // Create and display the pie chart
        // ...

        // Instructions: You need the HTML <div id='piechart'> </div> to display the chart.
        // Ensure you have a <div> element with id 'piechart' in your HTML.
    }
}

function createMapChart() {
    if (mapChartData.length > 0) {
        // Create and display the map chart
        // ...

        // Instructions: You need the HTML <div id='mapchart'> </div> to display the chart.
        // Ensure you have a <div> element with id 'mapchart' in your HTML.
    }
}



// You can add similar functions for creating other chart types, like mapChartData.

document.getElementById('load-csv').addEventListener('click', function () {
    if (!isCSVLoaded) {
        clearViewErrorMessage();
    }
    document.getElementById('file-input').click();
});

// Event listener for radio buttons
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function () {
        if (!isCSVLoaded) {
            displayViewErrorMessage();
            return;
        }
        selectedChartType = this.value;

        // Clear any existing chart if one is displayed
        clearChart();

        // Call the addDataToChartArray function with the appropriate chart type
        addDataToChartArray(selectedChartType, loadedCSVArray);

        // Depending on the selected chart type, create and display the chart.
        if (selectedChartType === 'bar') {
            createBarChart();
        } else if (selectedChartType === 'line') {
            createLineChart();
        } else if (selectedChartType === 'pie') {
            createPieChart();
        } else if (selectedChartType === 'map') {
            createMapChart();
        }
    });
});


// Event listener for sub-menu items in the view menu
const viewSubMenuItems = document.querySelectorAll('.menu li:has(ul) li a');
viewSubMenuItems.forEach(item => {
    item.addEventListener('click', function (event) {
        if (!isCSVLoaded) {
            displayViewErrorMessage();
            return;
        }

        // Check the selected submenu item and the selectedChartType
        const submenuItem = this.textContent.toLowerCase();

        if (selectedChartType === 'bar' || selectedChartType === 'line') {
            if (submenuItem === 'graph') {
                if (selectedChartType === 'bar') {
                    createBarChart();
                } else if (selectedChartType === 'line') {
                    createLineChart();
                }
                // Display the chart in the graph-display area
                displayChart();
            } else {
                document.getElementById('graph-display').textContent = 'Not Applicable';
            }
        } else {
            document.getElementById('graph-display').textContent = 'Not Applicable';
        }
    });
});


document.getElementById('file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        if (file.name.endsWith('.csv')) {
            if (isCSVLoaded) {
                if (isChartDisplayed) {
                    clearChart();
                }
                clearFileErrorMessage();
            }
            const reader = new FileReader();
            reader.onload = function (e) {
                const csvData = e.target.result;
                displayCSVData(csvData);
                isCSVLoaded = true;
            };
            reader.readAsText(file);
        } else {
            clearViewErrorMessage();
            document.getElementById('message-area').textContent = 'The data is in the wrong format. Only CSV files can be loaded.';
            event.target.value = '';
            if (isChartDisplayed) {
                clearChart();
            }
        }
    }
});

function displayPopup(content) {
    alert(content);
}

document.querySelector('.menu li:has(ul) li a[href="#Info"]').addEventListener('click', function (event) {
    const infoContent = "Name: [Your Name]\nClass ID: [Your Class ID]\nProject Due Date: [Due Date]";
    displayPopup(infoContent);
});

document.querySelector('.menu li ul li a[href="#Client"]').addEventListener('click', function (event) {
    const browserInfo = `Browser: ${navigator.appName} ${navigator.appVersion}\n`;
    const cookieEnabled = `Cookies Enabled: ${navigator.cookieEnabled ? 'Yes' : 'No'}\n`;
    const javaEnabled = `Java Enabled: ${navigator.javaEnabled() ? 'Yes' : 'No'}\n`;
    const clientContent = `${browserInfo}${cookieEnabled}${javaEnabled}`;
    displayPopup(clientContent);
})

function displayUserInfo() {
    const userInfo = {
        uid: "12345",
        login: "john_doe",
        name: "John Doe",
        gender: "Male"
    };
    const userInfoContent = `User ID: ${userInfo.uid}\nLogin: ${userInfo.login}\nName: ${userInfo.name}\nGender: ${userInfo.gender}`;
    displayPopup(userInfoContent);
}

document.querySelector('.menu li:has(ul) li a[href="#UserInfo"]').addEventListener('click', function (event) {
    displayUserInfo();
});
