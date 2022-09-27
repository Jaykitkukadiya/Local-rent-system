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

window.onload = () => {
  document.getElementById("login_selector").onclick = () => {
    document.getElementById("signup_container").classList.add("hidd");
    document.getElementById("signup_selector").classList.remove("selected-btn");
    document.getElementById("login_container").classList.remove("hidd");
    document.getElementById("login_selector").classList.add("selected-btn");
  }
  document.getElementById("signup_selector").onclick = () => {
    document.getElementById("login_container").classList.add("hidd");
    document.getElementById("login_selector").classList.remove("selected-btn");
    document.getElementById("signup_container").classList.remove("hidd");
    document.getElementById("signup_selector").classList.add("selected-btn");
  }

  document.getElementById("login_selector").click();

  // document.getElementById("is_landlord").onchange = () => {
  //   if (document.getElementById("is_landlord").checked) {
  //     Array.from(document.getElementsByClassName("landloard_filed")).forEach(element => {
  //       element.classList.remove("hidd");
  //     });
  //     console.log(document.getElementsByClassName("landloard_filed"));
  //   } else {
  //     Array.from(document.getElementsByClassName("landloard_filed")).forEach(element => {
  //       element.classList.add("hidd");
  //     });
  //   }
  // }


  document.getElementById("login_btn").addEventListener('click', () => {
    let username = document.getElementById("username_login");
    let password = document.getElementById("password_login");
    console.log(username, password);
    fetch('/api/login/', {
      method: "POST",
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    }).then(res => res.json()).then((res) => {
      if (res.code == 200) {
        if (res.data.role == "user")
        // location.href = "/user/dashboard/";
          location.href = "/user/dashboard/";
        else
          location.href = "/landlord/dashboard/";
      } else if (res.code == 404) {
        username.style.borderColor = "red";
        password.style.borderColor = "red";
        document.getElementById("login_alert").innerText = "User not found!";
        document.getElementById("login_alert").style.display = "block";
      } else if (res.code == 405) {
        console.log("invalid method");
      } else if (res.code == 406) {
        username.style.borderColor = "red";
        password.style.borderColor = "red";
        document.getElementById("login_alert").innerText = "Fill valid data!";
        document.getElementById("login_alert").style.display = "block";
      }
    })
  })
  document.getElementById("signup_btn").addEventListener('click', () => {
    let fullname = document.getElementById("signup_fullname");
    let email = document.getElementById("signup_email");
    let username = document.getElementById("signup_username");
    let password = document.getElementById("signup_password");
    let mobile = document.getElementById("signup_mobile");
    let address = document.getElementById("signup_address");
    let pincode = document.getElementById("signup_pincode");
    let role = "1";
    data = {
      fullname: fullname.value,
      email: email.value,
      username: username.value,
      password: password.value,
      role: role,
      mobile : mobile.value,
      address : address.value,
      pincode : pincode.value,
    }
    console.log(data);
    fetch('/api/signup/', {
      method: "POST",
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
      body: JSON.stringify(data)
    }).then(res => res.json()).then((res) => {
      if (res.code == 200) {
        location.href = "/login/";
      } else if (res.code == 405) {
        console.log("invalid method");
      } else if (res.code == 406) {
        console.log(res)
        for (field in res.data.invalid_field) {
          eval(res.data.invalid_field[field]).style.borderColor = "red";
        }
      }
    })
  })
}