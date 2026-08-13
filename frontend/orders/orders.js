// ===============================
// FOOD FIESTA - ORDERS.JS
// ===============================


// -------------------------------
// SEARCH ORDERS
// -------------------------------

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function () {

    let filter = this.value.toLowerCase();

    let rows = document.querySelectorAll("#orderTable tr");

    rows.forEach(function (row) {

        let text = row.innerText.toLowerCase();

        if (text.includes(filter)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});


// -------------------------------
// VIEW ORDER
// -------------------------------

function attachViewEvents() {

    const viewButtons = document.querySelectorAll(".bg-blue-500");

    viewButtons.forEach(function (button) {

        button.onclick = function () {

            let row = this.closest("tr");

            let data = row.querySelectorAll("td");

            alert(
`Order Details

Order ID : ${data[0].innerText}

User ID : ${data[1].innerText}

Food Item : ${data[2].innerText}

Quantity : ${data[3].innerText}

Price : ${data[4].innerText}

Discount : ${data[5].innerText}

Total Price : ${data[6].innerText}`
            );

        };

    });

}


// -------------------------------
// EDIT ORDER
// -------------------------------

function attachEditEvents() {

    const editButtons = document.querySelectorAll(".bg-yellow-500");

    editButtons.forEach(function (button) {

        button.onclick = function () {

            let row = this.closest("tr");

            let item = prompt("Food Item", row.cells[2].innerText);

            if (item == null) return;

            let qty = prompt("Quantity", row.cells[3].innerText);

            if (qty == null) return;

            let price = prompt("Price", row.cells[4].innerText.replace("₹",""));

            if (price == null) return;

            let discount = prompt("Discount", row.cells[5].innerText.replace("₹",""));

            if (discount == null) return;

            let total = Number(price) - Number(discount);

            row.cells[2].innerText = item;
            row.cells[3].innerText = qty;
            row.cells[4].innerText = "₹" + Number(price).toFixed(2);
            row.cells[5].innerText = "₹" + Number(discount).toFixed(2);
            row.cells[6].innerText = "₹" + total.toFixed(2);

            alert("Order Updated Successfully");

        };

    });

}


// -------------------------------
// DELETE ORDER
// -------------------------------

function attachDeleteEvents() {

    const deleteButtons = document.querySelectorAll(".bg-red-500");

    deleteButtons.forEach(function (button) {

        button.onclick = function () {

            let row = this.closest("tr");

            let orderId = row.cells[0].innerText;

            if (confirm("Delete Order ID " + orderId + "?")) {

                row.remove();

                alert("Order Deleted Successfully");

            }

        };

    });

}


// -------------------------------
// ADD ORDER
// -------------------------------

const addButton = document.querySelector(".bg-green-600");

addButton.addEventListener("click", function () {

    let orderId = document.querySelectorAll("#orderTable tr").length + 1;

    let userId = prompt("Enter User ID");

    if (!userId) return;

    let item = prompt("Enter Food Item");

    if (!item) return;

    let qty = prompt("Enter Quantity");

    if (!qty) return;

    let price = prompt("Enter Price");

    if (!price) return;

    let discount = prompt("Enter Discount");

    if (!discount) return;

    let total = Number(price) - Number(discount);

    let table = document.getElementById("orderTable");

    table.innerHTML += `

<tr class="border-b hover:bg-orange-50">

<td class="py-4">${orderId}</td>

<td>${userId}</td>

<td>${item}</td>

<td>${qty}</td>

<td>₹${Number(price).toFixed(2)}</td>

<td>₹${Number(discount).toFixed(2)}</td>

<td class="font-semibold text-green-600">₹${total.toFixed(2)}</td>

<td>

<button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">
<i class="fas fa-eye"></i>
</button>

<button class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded mx-1">
<i class="fas fa-edit"></i>
</button>

<button class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded">
<i class="fas fa-trash"></i>
</button>

</td>

</tr>

`;

    attachViewEvents();
    attachEditEvents();
    attachDeleteEvents();

    alert("New Order Added Successfully");

});


// -------------------------------
// INITIALIZE EVENTS
// -------------------------------

attachViewEvents();
attachEditEvents();
attachDeleteEvents();

console.log("Food Fiesta Orders Page Loaded Successfully");