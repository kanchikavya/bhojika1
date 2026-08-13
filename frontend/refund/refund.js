const searchInput = document.getElementById("searchInput");
const refundTable = document.getElementById("refundTable");

// Search Refunds
searchInput.addEventListener("keyup", function () {

    const filter = searchInput.value.toLowerCase();

    const rows = refundTable.getElementsByTagName("tr");

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

// View Refund
const viewButtons = document.querySelectorAll(".bg-blue-500");

viewButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");
        const data = row.querySelectorAll("td");

        alert(
            "Refund Details\n\n" +
            "Refund ID : " + data[0].innerText + "\n" +
            "User ID : " + data[1].innerText + "\n" +
            "Order ID : " + data[2].innerText + "\n" +
            "Amount : " + data[3].innerText + "\n" +
            "Status : " + data[4].innerText
        );

    });

});

// Edit Refund
const editButtons = document.querySelectorAll(".bg-yellow-500");

editButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");

        const refundId = row.cells[0].innerText;

        alert("Edit Refund Record : " + refundId);

    });

});

// Delete Refund
const deleteButtons = document.querySelectorAll(".bg-red-500");

deleteButtons.forEach(button => {

    button.addEventListener("click", function () {

        const confirmDelete = confirm("Are you sure you want to delete this refund?");

        if (confirmDelete) {

            this.closest("tr").remove();

            alert("Refund deleted successfully.");

        }

    });

});

// Add Refund
const addButton = document.querySelector(".bg-green-600");

addButton.addEventListener("click", function () {

    alert("Add Refund functionality will be connected to the database later.");

});