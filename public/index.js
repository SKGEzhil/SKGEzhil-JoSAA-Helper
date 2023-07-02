function api_data() {
    fetch('http://localhost:3000/api/items')
        .then(response => response.json())
        .then(data => {
            // Handle the retrieved data
            for (var i = 0; i< data.length; i++){
                console.log(data[i].Institute)
            }

            var tableBody = document.getElementById("tableBody");

            for (var i = 0; i < data.length; i++) {
                var newRow = document.createElement("tr");

                var newCell1 = document.createElement("td");
                newCell1.textContent = data[i].Institute;
                newRow.appendChild(newCell1);

                var newCell2 = document.createElement("td");
                newCell2.textContent = data[i].Program;
                newRow.appendChild(newCell2);

                tableBody.appendChild(newRow);
            }

        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });


}

function send_data() {
    console.log(document.getElementById('institute_type').value)
    const json_req = {value: document.getElementById('institute_type').value}
    fetch('/send/dropdown', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_req)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            get_dropdown()
        })
        .catch(error => {
            console.error('Error:', error);
        });


}

function get_dropdown() {
    fetch('http://localhost:3000/dropdown/institutes')
        .then(response => response.json())
        .then(data => {
            // Handle the retrieved data
            console.log(data)
            for (let i =0; i<data.length; i++){
                let dropdown = document.getElementById('institute')
                let option = document.createElement('option')
                option.value = data[i].institute
                option.text = data[i].institute
                dropdown.add(option)
            }

        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });
}

window.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('myForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const form = event.target;

        fetch('/submit-form', {
            method: form.method,
            body: new URLSearchParams(new FormData(form))
        })
            .then(response => response.json())
            .then(data => {
                // const responseTextbox = document.getElementById('response');
                // responseTextbox.value = JSON.stringify(data, null, 2);
                console.log(data)
                console.log("ok")
                api_data()
            })
            .catch(error => {
                console.error('Error:', error);
            });

    });

   document.getElementById('institute_type').onchange = send_data
    
})