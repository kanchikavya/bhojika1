// ================================
// Food Fiesta - Reports & Analytics (Django REST API Connected)
// ================================

const API_BASE = "http://localhost:8000/api";
let reportData = [];

document.addEventListener("DOMContentLoaded", function () {
    loadReportData();
    setupExportButtons();
});

function loadReportData() {
    fetch(`${API_BASE}/analytics/`)
        .then(response => {
            if (!response.ok) throw new Error("API not reachable");
            return response.json();
        })
        .then(data => {
            if (data.ranked_customers) {
                reportData = data.ranked_customers;
                renderReportTable(data.ranked_customers);
            }
        })
        .catch(err => {
            console.warn("Using static fallback for report table:", err);
        });
}

function renderReportTable(customers) {
    const tbody = document.getElementById("reportTable");
    if (!tbody) return;

    tbody.innerHTML = "";

    customers.forEach(c => {
        tbody.innerHTML += `
            <tr class="border-b hover:bg-orange-50 transition cursor-pointer">
                <td class="p-4 font-bold text-gray-700">#${c.rank}</td>
                <td class="p-4 font-bold text-gray-800 capitalize">${c.name}</td>
                <td class="p-4 text-gray-600">${c.orders_count} orders</td>
                <td class="p-4 font-mono text-gray-600 text-xs">${c.email || c.mobile}</td>
                <td class="p-4 font-black text-green-700">₹${Number(c.total_spent).toLocaleString('en-IN')}</td>
            </tr>
        `;
    });
}

function setupExportButtons() {
    const pdfButton = document.querySelector(".bg-blue-600");
    const excelButton = document.querySelector(".bg-green-600");

    if (pdfButton) {
        pdfButton.addEventListener("click", function () {
            window.print();
        });
    }

    if (excelButton) {
        excelButton.addEventListener("click", function () {
            if (!reportData || reportData.length === 0) {
                alert("No report data available to export.");
                return;
            }

            const headers = "Rank,Customer Name,Orders Count,Contact,Total Spent (INR)\n";
            const rows = reportData.map(c =>
                `${c.rank},"${c.name}",${c.orders_count},"${c.email || c.mobile}",${c.total_spent}`
            ).join("\n");

            const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `food_fiesta_report_${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();
        });
    }
}
