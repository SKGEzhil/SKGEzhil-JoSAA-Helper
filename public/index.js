
function api_data() {
    fetch('localhost:3000/api/items')
        .then(response => response.json())
        .then(data => {
            // Handle the retrieved data
            console.log(data);
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });
}

document.getElementById("submit-btn").addEventListener("click", api_data)

