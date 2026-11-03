// ===============================
// FOOD FIESTA - PAYMENTS.JS (Django REST API Connected)
// ===============================

const API_BASE = "http://localhost:8000/api";
let allPayments = [];

document.addEventListener("DOMContentLoaded", function () {
    loadPayments();
    setupPaymentSearch();
});

function loadPayments() {
    fetch(`${API_BASE}/payments/`)
        .then(response => {
            if (!response.ok) throw new Error("API not reachable");
            return response.json();
        })
        .then(payments => {
            allPayments = payments;
            renderPaymentTable(payments);
        })
        .catch(err => {
            console.warn("Using static fallback for payment table:", err);
            attachStaticPaymentEvents();
        });
}

function renderPaymentTable(payments) {
    const tbody = document.getElementById("paymentTable");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (payments.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-6 text-gray-500">No payment records found.</td></tr>`;
        return;
    }

    payments.forEach(pmt => {
        const id = pmt.payment_id;
        const user = pmt.user_name || `User #${pmt.user}`;
        const order = pmt.order_item ? `${pmt.order_item} (#${pmt.order})` : `Order #${pmt.order}`;
        const amount = Number(pmt.amount).toFixed(2);
        const status = (pmt.status || 'pending').toLowerCase();

        const badgeClass =
            status === 'completed' ? 'bg-green-100 text-green-800' :
            status === 'refunded' ? 'bg-purple-100 text-purple-800' :
            status === 'returned' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';

        tbody.innerHTML += `
            <tr class="border-b hover:bg-orange-50 transition" id="payment-row-${id}">
                <td class="py-4 px-4 font-mono text-xs text-gray-400">#${id}</td>
                <td class="font-bold text-gray-800 capitalize">${user}</td>
                <td class="font-medium text-gray-700 capitalize">${order}</td>
                <td class="font-black text-gray-900">₹${amount}</td>
                <td>
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold capitalize ${badgeClass}">
                        ${status}
                    </span>
                </td>
                <td>
                    <button onclick="viewPayment(${id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${status === 'pending' ? `
                        <button onclick="markPaymentPaid(${id})" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold ml-1 shadow-sm transition" title="Mark Paid">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    });
}

function setupPaymentSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
        const filter = this.value.toLowerCase().trim();
        const filtered = allPayments.filter(p => {
            const user = (p.user_name || '').toLowerCase();
            const order = (p.order_item || '').toLowerCase();
            const status = (p.status || '').toLowerCase();
            const id = String(p.payment_id);
            return user.includes(filter) || order.includes(filter) || status.includes(filter) || id.includes(filter);
        });
        renderPaymentTable(filtered);
    });
}

function viewPayment(id) {
    const p = allPayments.find(item => item.payment_id === id);
    if (!p) return;
    alert(
`Payment Receipt #${p.payment_id}
---------------------------------
Customer: ${p.user_name || 'Customer'}
Order: ${p.order_item || 'Food Item'} (#${p.order})
Amount: ₹${p.amount}
Status: ${p.status}`
    );
}

function markPaymentPaid(id) {
    fetch(`${API_BASE}/payments/${id}/mark_status/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
    })
    .then(r => r.json())
    .then(res => {
        alert(`Payment #${id} marked as completed!`);
        loadPayments();
    })
    .catch(err => alert("Error updating payment."));
}

function attachStaticPaymentEvents() {
    const viewButtons = document.querySelectorAll(".bg-blue-500");
    viewButtons.forEach(btn => {
        btn.onclick = function () {
            const row = this.closest("tr");
            const data = row.querySelectorAll("td");
            alert(`Payment ID: ${data[0].innerText}\nAmount: ${data[3].innerText}\nStatus: ${data[4].innerText}`);
        };
    });
}
