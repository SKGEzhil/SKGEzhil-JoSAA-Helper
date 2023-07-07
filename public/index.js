
// Declaration of Variables
let dropdown_res;
let dropdown_req;
let isCardVisible = false;

// To receive final data after submission
function receive_data() {
    fetch('/result')
        .then(response => response.json())
        .then(data => {
            let i;
            for (i = 0; i< data.length; i++){
                console.log(data[i].Institute)
            }

            // To append data into table
            const tableBody = document.getElementById("tableBody");

            for (i = 0; i < data.length; i++) {
                const newRow = document.createElement("tr");

                const newCell1 = document.createElement("td");
                newCell1.textContent = data[i].Institute;
                newRow.appendChild(newCell1);

                const newCell2 = document.createElement("td");
                newCell2.textContent = data[i].Program;
                newRow.appendChild(newCell2);

                const newCell3 = document.createElement("td");
                newCell3.textContent = data[i].chances + '%';

                // For changing cell color based on chance percentage
                switch (data[i].chances){
                    case 100:
                        newCell3.style.backgroundColor = 'rgb(0,204,88)'
                        break
                    case 97:
                        newCell3.style.backgroundColor = 'rgb(48,187,108)'
                        break
                    case 95:
                        newCell3.style.backgroundColor = 'rgb(53,172,104)'
                        break
                    case 93:
                        newCell3.style.backgroundColor = 'rgb(71,150,107)'
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

// To send and receive dropdown data
function send_dropdown() {
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

function get_dropdown() {
    fetch(`/dropdown/${dropdown_res}`)
        .then(response => response.json())
        .then(data => {
            // Handle the retrieved data
            console.log(data)
            for (let i =0; i<data.length; i++){

                if (dropdown_res === 'institutes'){
                    let dropdown = document.getElementById('institute')
                    let option = document.createElement('option')
                    option.value = data[i].institute
                    option.text = data[i].institute
                    dropdown.add(option)
                }

                if (dropdown_res === 'programs'){
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

// Dropdown manipulation functions
function inst_type_send() {

    // To remove previous dropdown menu after changing above dropdown menu
    let drop_to_rem = document.getElementById('institute')
    let total_optns = drop_to_rem.options.length
    console.log(total_optns)
    for(let i=1; i<total_optns; i++){
        drop_to_rem.remove(2);
        console.log(`removed ${i}`)
    }
    dropdown_req = 'institute_type'
    console.log(dropdown_req)
    send_dropdown()
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
    send_dropdown()
}

function prog_send() {
    dropdown_req = 'program'
    console.log(dropdown_req)
    send_dropdown()
}

function gender_send() {
    dropdown_req = 'gender'
    console.log(dropdown_req)
    send_dropdown()
}

function quota_send() {
    dropdown_req = 'quota'
    console.log(dropdown_req)
    send_dropdown()
}

//To remove table items everytime after submitting
function remove_table_items(){
    let table = document.getElementById('tableBody')
    let total_rows = table.rows.length
    for (let i=0; i<total_rows; i++){
        table.deleteRow(0)
    }
}

function category_send() {
    dropdown_req = 'category'
    console.log(dropdown_req)
    send_dropdown()
    if (document.getElementById('category').value === 'OPEN'){
        document.getElementById('Category_rank').disabled = true
        document.getElementById('Category_rank').style.backgroundColor = 'rgb(243,243,243)'
    }
    else{
        document.getElementById('Category_rank').disabled = false
        document.getElementById('Category_rank').style.backgroundColor = 'rgb(255,255,255)'

    }

}


// Toggle Menu Card
function toggleCard() {
    const cardContainer = document.getElementById('cardContainer');
    console.log('clicked')
    isCardVisible = !isCardVisible;
    if (isCardVisible) {
        cardContainer.style.display = 'block';
    } else {
        cardContainer.style.display = 'none';
    }
}

//DOM manipulation inside window object (To ensure that DOM is loaded, otherwise It will show null error)
window.addEventListener("DOMContentLoaded", (event) => {

    // Form Submission
    document.getElementById('myForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const form = event.target;

        fetch('/submit-form', {
            method: form.method,
            body: new URLSearchParams(new FormData(form))
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                console.log("ok")
                remove_table_items()
                receive_data()
            })
            .catch(error => {
                console.error('Error:', error);
            });

    });

    // Dropdown Controls
    document.getElementById('institute_type').onchange = inst_type_send
    document.getElementById('institute').onchange = inst_send
    document.getElementById('program').onchange = prog_send
    document.getElementById('gender').onchange = gender_send
    document.getElementById('quota').onchange = quota_send
    document.getElementById('category').onchange = category_send
    
    // Menu Button click event
    document.getElementById('menu-btn').addEventListener('click', toggleCard)
    

})


