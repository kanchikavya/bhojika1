const searchInput = document.getElementById("searchInput");
const paymentTable = document.getElementById("paymentTable");

// Search Payments
searchInput.addEventListener("keyup", function () {

    const filter = searchInput.value.toLowerCase();
    const rows = paymentTable.getElementsByTagName("tr");

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

// View Payment
const viewButtons = document.querySelectorAll(".bg-blue-500");

viewButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");
        const data = row.querySelectorAll("td");

        alert(
            "Payment Details\n\n" +
            "Payment ID : " + data[0].innerText + "\n" +
            "User ID : " + data[1].innerText + "\n" +
            "Order ID : " + data[2].innerText + "\n" +
            "Amount : " + data[3].innerText + "\n" +
            "Status : " + data[4].innerText
        );

    });

});

// Edit Payment
const editButtons = document.querySelectorAll(".bg-yellow-500");

editButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");
        const paymentId = row.cells[0].innerText;

        alert("Edit Payment Record : " + paymentId);

    });

});

// Delete Payment
const deleteButtons = document.querySelectorAll(".bg-red-500");

deleteButtons.forEach(button => {

    button.addEventListener("click", function () {

        const confirmDelete = confirm("Are you sure you want to delete this payment?");

        if (confirmDelete) {

            this.closest("tr").remove();

            alert("Payment deleted successfully.");

        }

    });

});

// Add Payment
const addButton = document.querySelector(".bg-green-600");

addButton.addEventListener("click", function () {

    alert("Add Payment functionality will be connected to the database later.");

});