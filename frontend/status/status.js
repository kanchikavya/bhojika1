const searchInput = document.getElementById("searchInput");
const statusTable = document.getElementById("statusTable");

// Search Status Records
searchInput.addEventListener("keyup", function () {

    const filter = searchInput.value.toLowerCase();
    const rows = statusTable.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {

        const cells = rows[i].getElementsByTagName("td");
        let found = false;

        for (let j = 0; j < cells.length - 1; j++) {

            const text = cells[j].textContent.toLowerCase();

            if (text.includes(filter)) {
                found = true;
                break;
            }

        }

        rows[i].style.display = found ? "" : "none";
    }

});

// View Status
const viewButtons = document.querySelectorAll(".bg-blue-500");

viewButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");
        const data = row.querySelectorAll("td");

        alert(
            "Order Status Details\n\n" +
            "Status ID : " + data[0].innerText + "\n" +
            "Order ID : " + data[1].innerText + "\n" +
            "Status : " + data[2].innerText + "\n" +
            "Updated At : " + data[3].innerText
        );

    });

});

// Edit Status
const editButtons = document.querySelectorAll(".bg-yellow-500");

editButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");
        const statusId = row.cells[0].innerText;

        alert("Edit Status Record : " + statusId);

    });

});

// Delete Status
const deleteButtons = document.querySelectorAll(".bg-red-500");

deleteButtons.forEach(button => {

    button.addEventListener("click", function () {

        const confirmDelete = confirm("Are you sure you want to delete this status record?");

        if (confirmDelete) {

            this.closest("tr").remove();
            alert("Status record deleted successfully.");

        }

    });

});

// Add Status
const addButton = document.querySelector(".bg-green-600");

addButton.addEventListener("click", function () {

    alert("Add Status functionality will be connected to the database later.");

});