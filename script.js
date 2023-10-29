// Load the Google Charts library
google.charts.load('current', { packages: ['corechart', 'table', 'geochart'] });

// Variables to track whether a CSV file is loaded and the chart is displayed
let isCSVLoaded = false;
let isChartDisplayed = false;

// Store the selected chart type based on the radio buttons
let selectedChartType = null;

// Store the loaded CSV data
let loadedCSVData = null;

// Function to clear the chart
function clearChart() {
    const googleTable = document.querySelector('.google-table');
    googleTable.innerHTML = '';
    isChartDisplayed = false;
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
    const dataTable = new google.visualization.DataTable();
    const visibleColumns = [];
    headers.forEach((header, index) => {
        const columnHasData = data.some(row => row.split(',')[index].trim() !== '');
        if (columnHasData) {
            dataTable.addColumn('string', header);
            visibleColumns.push(index);
        }
    });
    data.forEach((row) => {
        const rowData = row.split(',');
        const filteredRowData = visibleColumns.map(index => rowData[index]);
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

function createBarChart(dataType) {
    if (loadedCSVData) {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'X-Axis');
        data.addColumn('number', 'Y-Axis');
        // Populate data based on your CSV data
        const options = {
            title: 'Bar Chart Title',
        };
        const chart = new google.visualization.BarChart(document.getElementById('graph-display'));
        chart.draw(data, options);
    }
}

function createLineChart(dataType) {
    if (loadedCSVData) {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'X-Axis');
        data.addColumn('number', 'Y-Axis');
        // Populate data based on your CSV data
        const options = {
            title: 'Line Chart Title',
        };
        const chart = new google.visualization.LineChart(document.getElementById('graph-display'));
        chart.draw(data, options);
    }
}

function createPieChart(dataType, covidData) {
    if (covidData) {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Label');
        data.addColumn('number', 'Value');

        // Populate data based on the COVID-19 data
        covidData.forEach(entry => {
            data.addRow([entry.label, entry.value]);
        });

        const options = {
            title: 'COVID-19 Distribution in New Jersey',
        };

        const chart = new google.visualization.PieChart(document.getElementById('graph-display'));
        chart.draw(data, options);
    }
}

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
            if (
                (submenuItem === 'avgwages' && (selectedChartType === 'bar' || selectedChartType === 'line')) ||
                (submenuItem === 'estimatedpopulation' && (selectedChartType === 'bar' || selectedChartType === 'line')) ||
                (submenuItem === 'state' && (selectedChartType === 'bar' || selectedChartType === 'pie'))
            ) {
                if (selectedChartType === 'bar') {
                    createBarChart(submenuItem);
                } else if (selectedChartType === 'line') {
                    createLineChart(submenuItem);
                } else if (selectedChartType === 'pie') {
                    createPieChart(submenuItem);
                }
                // Display "Success" when it's applicable
                document.getElementById('graph-display').textContent = 'Success';
            } else {
                // Display "Not Applicable" when it's not applicable
                document.getElementById('graph-display').textContent = 'Not Applicable';
            }
        } else {
            // Display "Not Applicable" if the selectedChartType is neither "bar" nor "line"
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
                loadedCSVData = csvData;
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
});

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
