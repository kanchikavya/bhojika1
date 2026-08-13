// ================================
// Food Fiesta - Reports Page
// reports.js
// ================================

// Table Body
const reportTable = document.getElementById("reportTable");

// Export Buttons
const pdfButton = document.querySelector(".bg-blue-600");
const excelButton = document.querySelector(".bg-green-600");

// ================================
// Export PDF
// ================================

pdfButton.addEventListener("click", function () {

    alert("Export to PDF functionality will be connected later.");

});

// ================================
// Export Excel
// ================================

excelButton.addEventListener("click", function () {

    alert("Export to Excel functionality will be connected later.");

});

// ================================
// Highlight Row
// ================================

const rows = reportTable.getElementsByTagName("tr");

for (let i = 0; i < rows.length; i++) {

    rows[i].addEventListener("click", function () {

        for (let j = 0; j < rows.length; j++) {
            rows[j].classList.remove("bg-orange-200");
        }

        this.classList.add("bg-orange-200");

    });

}

// ================================
// Print Report
// ================================

function printReport() {

    window.print();

}

// ================================
// Download Report
// ================================

function downloadReport() {

    alert("Download feature will be connected with backend.");

}

// ================================
// Report Loaded
// ================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Food Fiesta Reports Loaded Successfully");

});