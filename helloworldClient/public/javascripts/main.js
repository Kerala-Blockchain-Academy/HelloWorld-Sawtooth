
function writemsg(event){
    event.preventDefault();
    const data = document.getElementById('textInput').value
    console.log(data);
    if (data.length==0){
        alert("Please enter the data")
    }
    else{
    $.post('/', {  write: data },'json');
    
}
}

function readmsg(event){
    event.preventDefault();
    $.get('/state',  (data,textStatus,jqXHR) =>{
        alert("your data is : " + data.balance)
        document.getElementById("textInput").value ="Your data is " + data.balance; 
      },'json');
    
}