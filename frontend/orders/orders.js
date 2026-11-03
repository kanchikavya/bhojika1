// ===============================
// FOOD FIESTA - ORDERS.JS (Django REST API Connected)
// ===============================

const API_BASE = "http://localhost:8000/api";
let allOrders = [];

document.addEventListener("DOMContentLoaded", function () {
    loadOrders();
    setupOrderSearch();
    setupAddOrderButton();
});

function loadOrders() {
    fetch(`${API_BASE}/orders/`)
        .then(response => {
            if (!response.ok) throw new Error("API not reachable");
            return response.json();
        })
        .then(orders => {
            allOrders = orders;
            renderOrdersTable(orders);
        })
        .catch(err => {
            console.warn("Using static fallback for orders table:", err);
            attachStaticEvents();
        });
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById("orderTable");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="py-6 text-gray-500">No orders found.</td></tr>`;
        return;
    }

    orders.forEach(order => {
        const id = order.order_id;
        const userId = order.user;
        const item = order.item;
        const qty = order.quantity;
        const price = Number(order.price).toFixed(2);
        const discount = Number(order.discount).toFixed(2);
        const total = Number(order.total_price).toFixed(2);
        const status = order.current_status || 'pending';

        tbody.innerHTML += `
            <tr class="border-b hover:bg-orange-50 transition" id="order-row-${id}">
                <td class="py-4 font-mono text-xs text-gray-400">#${id}</td>
                <td class="font-bold text-gray-700">User #${userId}</td>
                <td class="font-bold text-gray-800 capitalize">${item}</td>
                <td class="font-semibold text-gray-600">${qty}</td>
                <td class="text-gray-600">₹${price}</td>
                <td class="text-emerald-600 font-medium">₹${discount}</td>
                <td class="font-black text-green-700">₹${total}</td>
                <td>
                    <button onclick="viewOrderDetails(${id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition" title="View Order">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="changeOrderStatus(${id}, '${status}')" class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold mx-1 shadow-sm transition" title="Update Status">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteOrder(${id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition" title="Delete Order">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function setupOrderSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
        const filter = this.value.toLowerCase().trim();
        const filtered = allOrders.filter(o => {
            const item = (o.item || '').toLowerCase();
            const customer = (o.user_name || '').toLowerCase();
            const id = String(o.order_id);
            const user = String(o.user);
            return item.includes(filter) || customer.includes(filter) || id.includes(filter) || user.includes(filter);
        });
        renderOrdersTable(filtered);
    });
}

function setupAddOrderButton() {
    const addBtn = document.querySelector("button:has(.fa-plus-circle)");
    if (!addBtn) return;

    addBtn.addEventListener("click", function () {
        const userId = prompt("Enter User ID (1-10):", "1");
        if (!userId) return;
        const item = prompt("Enter Food Item Name:", "Chicken Biryani");
        if (!item) return;
        const qty = prompt("Enter Quantity:", "1");
        if (!qty) return;
        const price = prompt("Enter Unit Price (₹):", "200");
        if (!price) return;
        const discount = prompt("Enter Discount (₹):", "20") || "0";

        const q = Number(qty);
        const p = Number(price);
        const d = Number(discount);
        const total = Math.max(0, (q * p) - d);

        fetch(`${API_BASE}/orders/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: Number(userId),
                item: item,
                quantity: q,
                price: p,
                discount: d,
                total_price: total,
            }),
        })
        .then(r => {
            if (!r.ok) throw new Error("Order creation failed");
            return r.json();
        })
        .then(newOrder => {
            alert(`Order #${newOrder.order_id} placed successfully! Total: ₹${newOrder.total_price}`);
            loadOrders();
        })
        .catch(err => alert("Failed to save order. Make sure customer exists."));
    });
}

function viewOrderDetails(id) {
    const o = allOrders.find(ord => ord.order_id === id);
    if (!o) return;
    alert(
`Food Fiesta - Order Receipt #${o.order_id}
----------------------------------------
Customer: ${o.user_name || 'Customer'} (User #${o.user})
Food Item: ${o.item}
Quantity: ${o.quantity}
Unit Price: ₹${o.price}
Discount: -₹${o.discount}
Grand Total: ₹${o.total_price}
Current Status: ${o.current_status || 'Pending'}
Payment: ${o.payment_status || 'Unpaid'}`
    );
}

function changeOrderStatus(id, currentStatus) {
    const newStatus = prompt(`Update status for Order #${id} (pending, completed, returned):`, currentStatus);
    if (!newStatus) return;

    fetch(`${API_BASE}/orders/${id}/update_status/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus.toLowerCase().trim() }),
    })
    .then(r => r.json())
    .then(res => {
        alert(res.message || "Status updated!");
        loadOrders();
    })
    .catch(err => alert("Error updating order status."));
}

function deleteOrder(id) {
    if (!confirm(`Delete Order #${id}?`)) return;

    fetch(`${API_BASE}/orders/${id}/`, {
        method: "DELETE",
    })
    .then(r => {
        if (r.status === 204 || r.ok) {
            alert(`Order #${id} deleted.`);
            loadOrders();
        } else {
            throw new Error("Delete failed");
        }
    })
    .catch(err => alert("Cannot delete order referenced by payments or returns."));
}

function attachStaticEvents() {
    // Fallback for static elements if server offline
    const viewButtons = document.querySelectorAll(".bg-blue-500");
    viewButtons.forEach(btn => {
        btn.onclick = function () {
            const row = this.closest("tr");
            const data = row.querySelectorAll("td");
            alert(`Order ID: ${data[0].innerText}\nItem: ${data[2].innerText}\nTotal: ${data[6].innerText}`);
        };
    });
}
