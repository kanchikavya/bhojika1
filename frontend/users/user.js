// ==========================
// FOOD FIESTA - USERS.JS (Connected to Django REST Framework)
// ==========================

const API_BASE = "http://localhost:8000/api";

document.addEventListener("DOMContentLoaded", function () {
    loadUsers();
    setupSearch();
});

let allUsers = [];

function loadUsers() {
    fetch(`${API_BASE}/users/`)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(users => {
            allUsers = users;
            renderUserTable(users);
        })
        .catch(error => {
            console.warn("API Connection Error, checking fallback:", error);
            const tbody = document.getElementById("userTable");
            if (tbody && tbody.children.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-red-500">Could not connect to Django API on port 8000. Start the backend with 'python manage.py runserver'.</td></tr>`;
            }
        });
}

function renderUserTable(users) {
    const tbody = document.getElementById("userTable");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-gray-500">No users found.</td></tr>`;
        return;
    }

    users.forEach(user => {
        const id = user.userid || user.user_id;
        const name = user.f_name || user.name || "Customer";
        const mobile = user.mobile_no || user.mobile || "—";
        const email = user.email || "—";
        const address = user.address || "—";

        tbody.innerHTML += `
            <tr class="border-b hover:bg-orange-50 transition" id="user-row-${id}">
                <td class="py-4 px-4 font-mono text-xs text-gray-500">#${id}</td>
                <td class="font-bold text-gray-800 capitalize">${name}</td>
                <td class="capitalize text-gray-600">${address}</td>
                <td class="font-mono text-xs text-gray-600">${mobile}</td>
                <td class="text-xs text-gray-600">${email}</td>
                <td class="text-center py-2">
                    <button onclick="viewUser(${id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editUser(${id})" class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold mx-1 shadow-sm transition" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteUser(${id}, '${name}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
        const filter = this.value.toLowerCase().trim();
        const filtered = allUsers.filter(u => {
            const name = (u.f_name || u.name || '').toLowerCase();
            const email = (u.email || '').toLowerCase();
            const address = (u.address || '').toLowerCase();
            const mobile = String(u.mobile_no || u.mobile || '');
            return name.includes(filter) || email.includes(filter) || address.includes(filter) || mobile.includes(filter);
        });
        renderUserTable(filtered);
    });
}

function viewUser(id) {
    const user = allUsers.find(u => (u.userid || u.user_id) === id);
    if (!user) return;
    alert(
`Customer Profile #${id}
----------------------------
Name: ${user.f_name || user.name}
Mobile: ${user.mobile_no || user.mobile}
Email: ${user.email}
Address: ${user.address}
Total Orders: ${user.orders_count || 0}
Total Spent: ₹${user.total_spent || 0}`
    );
}

function editUser(id) {
    const user = allUsers.find(u => (u.userid || u.user_id) === id);
    if (!user) return;

    const newName = prompt("Edit Customer Name:", user.f_name || user.name);
    if (!newName) return;
    const newAddress = prompt("Edit Address:", user.address || "");
    const newMobile = prompt("Edit Mobile:", user.mobile_no || user.mobile || "");

    fetch(`${API_BASE}/users/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            f_name: newName,
            address: newAddress,
            mobile_no: Number(newMobile) || user.mobile_no,
            email: user.email,
        }),
    })
    .then(r => {
        if (!r.ok) throw new Error("Update failed");
        return r.json();
    })
    .then(updated => {
        alert("Customer updated successfully!");
        loadUsers();
    })
    .catch(err => alert("Error updating user. Check backend status."));
}

function deleteUser(id, name) {
    if (!confirm(`Are you sure you want to delete customer '${name}'?`)) return;

    fetch(`${API_BASE}/users/${id}/`, {
        method: "DELETE",
    })
    .then(r => {
        if (r.status === 204 || r.ok) {
            alert(`User #${id} removed successfully.`);
            loadUsers();
        } else {
            throw new Error("Delete failed");
        }
    })
    .catch(err => {
        alert("Cannot delete user linked to orders in MySQL database.");
    });
}
