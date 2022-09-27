console.log("hello world")

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


function bank_connect(acc_id)
{
  document.getElementById("message_box").classList.add("hidden");
  document.getElementById("retry_rounder").classList.remove("hidden");
  fetch("/api/bank/connect/" , {
    method : "POST",
    headers : { 'X-CSRFToken': getCookie('csrftoken') },
    body : JSON.stringify({
        acc_id : acc_id,
      })
  }).then(res => res.json()).then(result => {
    if(result.code == 200)
    {
      location.href = result.data.url;
    }
    else if(result.code == 405){
        document.getElementById("message_box").classList.remove("hidden");
        document.getElementById("retry_rounder").classList.add("hidden");
        document.getElementById("message").classList.remove("hidden");
        document.getElementById("message").innerText = result.detail;
    }
    else
    {
        document.getElementById("message_box").classList.remove("hidden");
        document.getElementById("retry_rounder").classList.add("hidden");
        document.getElementById("message").classList.remove("hidden");
        document.getElementById("message").innerText = "Some error occured";
    }
  })
}