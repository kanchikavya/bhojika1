const searchInput = document.getElementById("searchInput");
const feedbackTable = document.getElementById("feedbackTable");

// Search Feedback
searchInput.addEventListener("keyup", function () {

    const filter = searchInput.value.toLowerCase();

    const rows = feedbackTable.getElementsByTagName("tr");

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

// View Feedback
const viewButtons = document.querySelectorAll(".bg-blue-500");

viewButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");
        const data = row.querySelectorAll("td");

        alert(
            "Feedback Details\n\n" +
            "Feedback ID : " + data[0].innerText + "\n" +
            "User ID : " + data[1].innerText + "\n" +
            "Feedback : " + data[2].innerText + "\n" +
            "Rating : " + data[3].innerText
        );

    });

});

// Edit Feedback
const editButtons = document.querySelectorAll(".bg-yellow-500");

editButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");

        const feedbackId = row.cells[0].innerText;

        alert("Edit Feedback Record : " + feedbackId);

    });

});

// Delete Feedback
const deleteButtons = document.querySelectorAll(".bg-red-500");

deleteButtons.forEach(button => {

    button.addEventListener("click", function () {

        const confirmDelete = confirm("Are you sure you want to delete this feedback?");

        if (confirmDelete) {

            this.closest("tr").remove();

            alert("Feedback deleted successfully.");

        }

    });

});

// Add Feedback
const addButton = document.querySelector(".bg-green-600");

addButton.addEventListener("click", function () {

    alert("Add Feedback functionality will be connected to the database later.");

});