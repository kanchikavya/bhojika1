document.addEventListener("DOMContentLoaded", () => {

    const flowBoxes = document.querySelectorAll(
        ".flex.flex-col.items-center.space-y-4.text-center > div"
    );


    flowBoxes.forEach((box, index) => {

        box.style.cursor = "pointer";


        box.addEventListener("click", () => {

            // Remove previous highlight
            flowBoxes.forEach(item => {
                item.classList.remove(
                    "ring-4",
                    "ring-orange-400",
                    "scale-110"
                );
            });


            // Highlight selected step
            box.classList.add(
                "ring-4",
                "ring-orange-400",
                "scale-110"
            );


            showStepDetails(index);

        });


    });



    function showStepDetails(index) {

        const messages = [

            "User enters personal details and creates an account.",

            "user1 table stores customer information using Primary Key.",

            "orders1 table stores food order details connected using Foreign Key.",

            "payments1 table manages payment transactions for orders.",

            "refund1 / returns1 handles order returns and refund process.",

            "status1 and order_logs track order delivery status changes."

        ];


        if(messages[index]) {

            alert(messages[index]);

        }

    }



    // Animate workflow automatically

    let current = 0;


    function animateFlow() {


        flowBoxes.forEach(box => {

            box.classList.remove(
                "ring-4",
                "ring-orange-400",
                "scale-110"
            );

        });



        if(flowBoxes[current]) {

            flowBoxes[current].classList.add(
                "ring-4",
                "ring-orange-400",
                "scale-110"
            );

        }


        current++;


        if(current >= flowBoxes.length) {

            current = 0;

        }

    }


    setInterval(animateFlow, 2000);



});