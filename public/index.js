function api_data() {
    fetch('/api/items')
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
    console.log(document.getElementById(dropdown_req).value)
    // console.log(dropdown_req)
    const json_req = {value: document.getElementById(dropdown_req).value , drop_type: dropdown_req}
    fetch('/send/dropdown', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_req)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message)
            dropdown_res = data.drop_val
            get_dropdown()
        })
        .catch(error => {
            console.error('Error:', error);
        });


}

var dropdown_req = ''
var dropdown_res = ''

function get_dropdown() {
    fetch(`/${dropdown_res}`)
        .then(response => response.json())
        .then(data => {
            // Handle the retrieved data
            console.log(data)
            for (let i =0; i<data.length; i++){

                if (dropdown_res == 'institutes'){
                    let dropdown = document.getElementById('institute')
                    let option = document.createElement('option')
                    option.value = data[i].institute
                    option.text = data[i].institute
                    dropdown.add(option)
                }

                if (dropdown_res == 'programs'){
                    let dropdown = document.getElementById('program')
                    let option = document.createElement('option')
                    option.value = data[i].program
                    option.text = data[i].program
                    dropdown.add(option)
                }


            }

        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });
}

function inst_type_send() {
    let drop_to_rem = document.getElementById('institute')
    let total_optns = drop_to_rem.options.length
    console.log(total_optns)
    for(var i=1;i<total_optns;i++){
        drop_to_rem.remove(2);
        console.log(`removed ${i}`)
    }
    dropdown_req = 'institute_type'
    console.log(dropdown_req)
    send_data()
}

function inst_send() {
    let drop_to_rem = document.getElementById('program')
    let total_optns = drop_to_rem.options.length
    console.log(total_optns)
    for(var i=1;i<total_optns;i++){
        drop_to_rem.remove(2);
        console.log(`removed ${i}`)
    }
    dropdown_req = 'institute'
    console.log(dropdown_req)
    send_data()
}

function prog_send() {
    dropdown_req = 'program'
    console.log(dropdown_req)
    send_data()
}

function gender_send() {
    dropdown_req = 'gender'
    console.log(dropdown_req)
    send_data()
}

function quota_send() {
    dropdown_req = 'quota'
    console.log(dropdown_req)
    send_data()
}

function remove_table_items(){
    let table = document.getElementById('tableBody')
    let total_rows = table.rows.length
    for (var i=0;i<total_rows;i++){
        table.deleteRow(0)
    }
}

function category_send() {
    dropdown_req = 'category'
    console.log(dropdown_req)
    send_data()
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
                remove_table_items()
                api_data()
            })
            .catch(error => {
                console.error('Error:', error);
            });

    });

    document.getElementById('institute_type').onchange = inst_type_send
    document.getElementById('institute').onchange = inst_send
    document.getElementById('program').onchange = prog_send
    document.getElementById('gender').onchange = gender_send
    document.getElementById('quota').onchange = quota_send
    document.getElementById('category').onchange = category_send

    
})