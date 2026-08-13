const searchInput = document.getElementById("searchInput");
const returnTable = document.getElementById("returnTable");

searchInput.addEventListener("keyup", function () {

    const filter = searchInput.value.toLowerCase();

    const rows = returnTable.getElementsByTagName("tr");

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

const viewButtons = document.querySelectorAll(".bg-blue-500");

viewButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");

        const data = row.querySelectorAll("td");

        alert(
            "Return Details\n\n" +
            "Return ID : " + data[0].innerText + "\n" +
            "User ID : " + data[1].innerText + "\n" +
            "Order ID : " + data[2].innerText + "\n" +
            "Food Item : " + data[3].innerText + "\n" +
            "Refund Amount : " + data[4].innerText
        );

    });

});

const editButtons = document.querySelectorAll(".bg-yellow-500");

editButtons.forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");

        const returnId = row.cells[0].innerText;

        alert("Edit Return Record : " + returnId);

    });

});

const deleteButtons = document.querySelectorAll(".bg-red-500");

deleteButtons.forEach(button => {

    button.addEventListener("click", function () {

        if (confirm("Are you sure you want to delete this return record?")) {

            this.closest("tr").remove();

            alert("Return record deleted successfully.");

        }

    });

});

const addButton = document.querySelector(".bg-green-600");

addButton.addEventListener("click", function () {

    alert("Add Return functionality will be connected to the database later.");

});