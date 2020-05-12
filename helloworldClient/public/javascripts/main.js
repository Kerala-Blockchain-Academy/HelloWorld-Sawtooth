
function writemsg(event) {
    event.preventDefault();
    const data = document.getElementById('textInput').value.trimRight();
    console.log(data);
    if (data.length == 0) {
        alert("Please enter the data");
    }
    else {
        fetch('/write', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputdata: data })
        })
            .then(function (response) {
                console.log(response);
                return response.json();
            })
            .then(function (data) {
                console.log(JSON.stringify(data));
                document.getElementById('textInput').value = '';
                alert(data.message);
            })
            .catch(function (err) {
                console.log(err);
                alert("Error in processing request");
            })
    }
}

function readmsg(event) {
    event.preventDefault();
    fetch('/read', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(function (response) {
            console.log("response---", response);
            return response.json();
        })
        .then(function (data) {
            if (JSON.stringify(data) == "{}") {
                console.log("No data exists");
                alert("No data exists!");
                document.getElementById('textInput').value = '';
            } else {
                console.log(JSON.stringify(data));
                alert("Your data is : " + data.statedata);
                document.getElementById("textInput").value = "Data is " + data.statedata;
            }
        })
        .catch(function (err) {
            console.log(err);
            alert("Error in processing request");
        })
}