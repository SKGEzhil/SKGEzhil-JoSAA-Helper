function receive_data_2() {
    fetch('/feedback-request')
        .then(response => response.json())
        .then(data => {
            let i;
            for (i = 0; i < data.length; i++) {
                console.log(data[i].Feedback)
            }

            // To append data into table
            const tableBody = document.getElementById("tableBody");

            for (i = 0; i < data.length; i++) {

                const newRow = document.createElement("tr");

                const newCell1 = document.createElement("td");
                newCell1.textContent = data[i].id;
                newRow.appendChild(newCell1);

                const newCell2 = document.createElement("td");
                newCell2.textContent = data[i].Feedback;
                newRow.appendChild(newCell2);

                const newCell3 = document.createElement("td");
                newCell3.textContent = data[i].Rating ;

                // For changing cell color based on chance percentage
                switch (data[i].Rating) {
                    case 5:
                        newCell3.style.backgroundColor = 'rgba(0,204,88,0.89)'
                        break
                    case 4:
                        newCell3.style.backgroundColor = 'rgba(101,143,28,0.93)'
                        break
                    case 3:
                        newCell3.style.backgroundColor = 'rgba(183,187,46,0.91)'
                        break
                    case 2:
                        newCell3.style.backgroundColor = 'rgba(178,137,37,0.94)'
                        break
                    case 1:
                        newCell3.style.backgroundColor = 'rgba(182,50,27,0.93)'
                        break
                }

                newRow.appendChild(newCell3);

                tableBody.appendChild(newRow);

            }


        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });


}

window.addEventListener("DOMContentLoaded", (event) => {
receive_data_2()
})


