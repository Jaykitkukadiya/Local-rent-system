
function onSignIn(googleUser) {
  if (!window.localStorage.getItem("jtoken")) {
    console.log('googleUser: ', googleUser);
    var profile = googleUser.getBasicProfile();
    console.log('profile: ', profile);
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    document.getElementById("initial_page_email").classList.add("hidden");
    document.getElementById("email_send_rounder").classList.remove("hidden");
    fetch("/api/send/authEmail/", {
      method: "POST",
      body: JSON.stringify({
        email: profile.getEmail(),
        token: profile.getId(),
        issocial: 1
      })
    }).then(res => res.json()).then((result) => {
      console.log(result);
      document.getElementById("email_send_rounder").classList.add("hidden");
      window.localStorage.setItem("jtoken", result.data.jtoken)
      if (result.code == 200) {

        document.getElementById("notif_txt").innerText = result.detail;
        document.getElementById("notif").classList.add("notif-show");
        document.getElementById("initial_page_success").classList.remove("hidden");
        setTimeout(() => {
          document.getElementById("initial_page_success").classList.remove("swipe-up1");
        }, 500)
      } else if (result.code == 406) {
        console.log(result.detail)
        document.getElementById("notif_txt").innerText = result.detail;
        document.getElementById("notif").classList.add("notif-show");
        document.getElementById("initial_page_email").classList.remove("hidden");
        
          //   document.getElementById("contact_response_message").innerText = result.detail;
      } else if (result.code == 405) {
        console.log(result.detail)
        document.getElementById("notif_txt").innerText = result.detail;
        document.getElementById("notif").classList.add("notif-show");
        document.getElementById("initial_page_email").classList.remove("hidden");
          //   document.getElementById("contact_response_message").innerText = result.detail;
      }

      // document.getElementById("contact_response_message").classList.remove("hidden");

    })
  } else {
    document.getElementById("initial_page_email").classList.add("hidden");
    document.getElementById("initial_page_success").classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("initial_page_success").classList.remove("swipe-up1");
    }, 500)
  }

}


window.onload = () => {

  document.getElementById("notif_close").onclick = () => {
    document.getElementById("notif").classList.remove("notif-show");
  }
  if (!window.localStorage.getItem("jtoken")) {

    document.getElementById("initial_page_email_field_btn").onclick = () => {
      let email = document.getElementById("initial_page_email_field");
      let emailValue = email.value;
      if (emailValue != "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) == true) {
        document.getElementById("email_lable_id").classList.remove("missing_value");
        console.log(email.value)
        document.getElementById("initial_page_email").classList.add("hidden");
        document.getElementById("email_send_rounder").classList.remove("hidden");
        // call api here for sending email to abover email
        fetch("/api/send/authEmail/", {
          method: "POST",
          body: JSON.stringify({
            email: emailValue,
          })
        }).then(res => res.json()).then((result) => {
          console.log(result);
          document.getElementById("email_send_rounder").classList.add("hidden");

          if (result.code == 200) {
            document.getElementById("notif_txt").innerText = result.detail;
            document.getElementById("notif").classList.add("notif-show");
            document.getElementById("initial_page_auth_email_indecator").innerText = emailValue;
            document.getElementById("initial_page_email").classList.add("hidden");
            document.getElementById("initial_page_auth").classList.remove("hidden");
            document.getElementById("initial_page_auth_otp_field").focus();
          } else if (result.code == 503) {
            console.log(result.detail)
            document.getElementById("notif_txt").innerText = result.detail;
            document.getElementById("notif").classList.add("notif-show");
            document.getElementById("initial_page_email").classList.remove("hidden");
              //   document.getElementById("contact_response_message").innerText = result.detail;
          } else if (result.code == 406) {
            console.log(result.detail)
            document.getElementById("notif_txt").innerText = result.detail;
            document.getElementById("notif").classList.add("notif-show");
            document.getElementById("initial_page_email").classList.remove("hidden");
              //   document.getElementById("contact_response_message").innerText = result.detail;
          } else if (result.code == 405) {
            console.log(result.detail)
            document.getElementById("notif_txt").innerText = result.detail;
            document.getElementById("notif").classList.add("notif-show");
            document.getElementById("initial_page_email").classList.remove("hidden");
              //   document.getElementById("contact_response_message").innerText = result.detail;
          }

          // document.getElementById("contact_response_message").classList.remove("hidden");

        })


      }
      else
      {
        document.getElementById("notif_txt").innerText = "invalid email";
        document.getElementById("notif").classList.add("notif-show");

        document.getElementById("email_lable_id").classList.add("missing_value");
      }
    }
    document.getElementById("initial_page_auth_otp_field_btn").onclick = () => {
      let otp = document.getElementById("initial_page_auth_otp_field");
      let otpValue = otp.value;
      if (otpValue != "") {
        console.log(otp.value)
        document.getElementById("initial_page_auth").classList.add("hidden");
        document.getElementById("email_send_rounder").classList.remove("hidden");
        // call api here for sending email to abover email
        fetch("/api/auth/authEmail/", {
          method: "POST",
          body: JSON.stringify({
            email: document.getElementById("initial_page_auth_email_indecator").innerText,
            otp: otpValue,
          })
        }).then(res => res.json()).then((result) => {
          console.log(result);
          otp.value = ""
          document.getElementById("email_send_rounder").classList.add("hidden");

          if (result.code == 200) {
            document.getElementById("notif_txt").innerText = result.detail;
            document.getElementById("notif").classList.add("notif-show");
            window.localStorage.setItem("jtoken", result.data.jtoken)
            document.getElementById("initial_page_success").classList.remove("hidden");
            setTimeout(() => {
              document.getElementById("initial_page_success").classList.remove("swipe-up1");
            }, 500)
          } else if (result.code == 422) {
            console.log(result.detail);
            document.getElementById("notif_txt").innerText = result.detail;
            document.getElementById("notif").classList.add("notif-show");
            document.getElementById("initial_page_auth").classList.remove("hidden");
            //   document.getElementById("contact_response_message").innerText = result.detail;
          } else if (result.code == 406) {
            console.log(result.detail)
            document.getElementById("notif_txt").innerText = result.detail;
            document.getElementById("notif").classList.add("notif-show");
              //   document.getElementById("contact_response_message").innerText = result.detail;
          } else if (result.code == 405) {
            console.log(result.detail)
            document.getElementById("notif_txt").innerText = result.detail;
            document.getElementById("notif").classList.add("notif-show");
              //   document.getElementById("contact_response_message").innerText = result.detail;
          } else if (result.code == 404) {
            console.log(result.detail)
            document.getElementById("notif_txt").innerText = result.detail;
            document.getElementById("notif").classList.add("notif-show");
            document.getElementById("initial_page_auth_back").click();
              //   document.getElementById("contact_response_message").innerText = result.detail;
          }

          // document.getElementById("contact_response_message").classList.remove("hidden");

        })


      }
      else{
        document.getElementById("notif_txt").innerText = "invalid otp";
        document.getElementById("notif").classList.add("notif-show");
      }
    }

    document.getElementById("have_code").onclick = () => {
      
      let email = document.getElementById("initial_page_email_field");
      let emailValue = email.value;
      if (emailValue != "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) == true) {
        document.getElementById("email_lable_id").classList.remove("missing_value");
        console.log(email.value)
        document.getElementById("initial_page_email").classList.add("hidden");
        document.getElementById("initial_page_auth_email_indecator").innerText = emailValue;
        document.getElementById("initial_page_email").classList.add("hidden");
        document.getElementById("initial_page_auth").classList.remove("hidden");
        document.getElementById("initial_page_auth_otp_field").focus();
      }
      else{
        document.getElementById("email_lable_id").classList.add("missing_value");
        document.getElementById("notif_txt").innerText = "invalid email";
        document.getElementById("notif").classList.add("notif-show");
      }
    }


    document.getElementById("initial_page_auth_back").onclick = () => {


      document.getElementById("initial_page_auth_email_indecator").innerText = "";
      document.getElementById("initial_page_auth").classList.add("hidden");
      document.getElementById("initial_page_email").classList.remove("hidden");
    }
  } else {

    document.getElementById("initial_page_email").classList.add("hidden");
    document.getElementById("initial_page_success").classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("initial_page_success").classList.remove("swipe-up1");
    }, 500)
  }
  document.getElementById("initial_page_success_btn").onclick = () => {
    document.getElementById("initial_page_success").classList.add("swipe-up");
    setTimeout(() => {
      location.href = "/home/search/";
    }, 800)
  }








}