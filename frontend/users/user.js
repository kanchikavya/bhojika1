// ==========================
// FOOD FIESTA - USERS.JS
// ==========================

// ---------- SEARCH USER ----------
// ==========================
// LOAD USERS FROM DATABASE
// ==========================

document.addEventListener("DOMContentLoaded", function () {

    loadUsers();

});


function loadUsers(){

    fetch("http://localhost:5000/users")

    .then(response => response.json())

    .then(users => {


        let tbody = document.getElementById("userTable");

        tbody.innerHTML = "";


        users.forEach(user => {


            tbody.innerHTML += `

            <tr class="border-b hover:bg-orange-50">


            <td class="py-4">${user.user_id}</td>

            <td>${user.name}</td>

            <td>${user.address}</td>

            <td>${user.mobile}</td>

            <td>${user.email}</td>


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


        });


    })

    .catch(error=>{

        console.log("Database Error:",error);

    });

}

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function () {

    let filter = searchInput.value.toLowerCase();

    let rows = document.querySelectorAll("#userTable tr");

    rows.forEach(function (row) {

        let text = row.innerText.toLowerCase();

        if (text.includes(filter)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});


// ---------- VIEW USER ----------

const viewButtons = document.querySelectorAll(".bg-blue-500");

viewButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        let row = this.closest("tr");

        let data = row.querySelectorAll("td");

        alert(
`User Details

User ID : ${data[0].innerText}

Name : ${data[1].innerText}

Address : ${data[2].innerText}

Mobile : ${data[3].innerText}

Email : ${data[4].innerText}`
        );

    });

});


// ---------- EDIT USER ----------

const editButtons = document.querySelectorAll(".bg-yellow-500");

editButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        let row = this.closest("tr");

        let name = row.cells[1].innerText;

        let address = row.cells[2].innerText;

        let mobile = row.cells[3].innerText;

        let email = row.cells[4].innerText;

        let newName = prompt("Edit Name", name);

        if (newName == null) return;

        let newAddress = prompt("Edit Address", address);

        if (newAddress == null) return;

        let newMobile = prompt("Edit Mobile", mobile);

        if (newMobile == null) return;

        let newEmail = prompt("Edit Email", email);

        if (newEmail == null) return;

        row.cells[1].innerText = newName;
        row.cells[2].innerText = newAddress;
        row.cells[3].innerText = newMobile;
        row.cells[4].innerText = newEmail;

        alert("User Updated Successfully");

    });

});


// ---------- DELETE USER ----------

const deleteButtons = document.querySelectorAll(".bg-red-500");

deleteButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        let row = this.closest("tr");

        let name = row.cells[1].innerText;

        let confirmDelete = confirm("Delete " + name + "?");

        if (confirmDelete) {

            row.remove();

            alert("User Deleted Successfully");

        }

    });

});


// ---------- ADD USER ----------

const addButton = document.querySelector(".bg-green-600");

addButton.addEventListener("click", function () {

    let id = document.querySelectorAll("#userTable tr").length + 1;

    let name = prompt("Enter Name");

    if (!name) return;

    let address = prompt("Enter Address");

    if (!address) return;

    let mobile = prompt("Enter Mobile Number");

    if (!mobile) return;

    let email = prompt("Enter Email");

    if (!email) return;

    let tbody = document.getElementById("userTable");

    tbody.innerHTML += `

<tr class="border-b hover:bg-orange-50">

<td class="py-4">${id}</td>

<td>${name}</td>

<td>${address}</td>

<td>${mobile}</td>

<td>${email}</td>

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

    alert("User Added Successfully");

    location.reload();

});


// ---------- PAGE LOADED ----------

console.log("Food Fiesta Users Page Loaded Successfully");