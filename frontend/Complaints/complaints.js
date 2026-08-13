const searchInput = document.getElementById("searchInput");
const complaintTable = document.getElementById("complaintTable");

// Search Complaints
searchInput.addEventListener("keyup", function () {

    const filter = searchInput.value.toLowerCase();
    const rows = complaintTable.getElementsByTagName("tr");

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

// View Complaint
const viewButtons = document.querySelectorAll(".bg-blue-500");

viewButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");
        const data = row.querySelectorAll("td");

        alert(
            "Complaint Details\n\n" +
            "Complaint ID : " + data[0].innerText + "\n" +
            "User ID : " + data[1].innerText + "\n" +
            "Order ID : " + data[2].innerText + "\n" +
            "Food Item : " + data[3].innerText + "\n" +
            "Complaint : " + data[4].innerText
        );

    });

});

// Edit Complaint
const editButtons = document.querySelectorAll(".bg-yellow-500");

editButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");
        const complaintId = row.cells[0].innerText;

        alert("Edit Complaint Record : " + complaintId);

    });

});

// Delete Complaint
const deleteButtons = document.querySelectorAll(".bg-red-500");

deleteButtons.forEach(button => {

    button.addEventListener("click", function () {

        if (confirm("Are you sure you want to delete this complaint?")) {

            this.closest("tr").remove();

            alert("Complaint deleted successfully.");

        }

    });

});

// Add Complaint
const addButton = document.querySelector(".bg-green-600");

addButton.addEventListener("click", function () {

    alert("Add Complaint functionality will be connected to the database later.");

});