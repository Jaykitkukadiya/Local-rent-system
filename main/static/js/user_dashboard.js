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


function getpaymentreport(payid) {
  console.log(payid)
  fetch("/api/payment/customer/report/" , {
    method : "POST",
    headers: { 'X-CSRFToken': getCookie('csrftoken') },
    body : JSON.stringify({
      payobj_id : payid,
      jwttoken : window.localStorage.getItem("jtoken")
    })
  }).then(res => res.json()).then(result => {
    console.log(result)
    if(result.code == 200){
      add_notification(result.detail)
      
    }
    else if(result.code == 404)
    {
      add_notification(result.detail)
    }
    else if(result.code == 405)
    {
      add_notification(result.detail)
    }
    
  })
}


function loadmoredetail(event , id){
  if(Array.from(document.getElementById(`booking_more_inner_${id}`).classList).includes("hidden")){

    document.getElementById(`booking_more_inner_${id}`).classList.remove("hidden");
    setTimeout(() => {
      document.getElementById(`booking_more_outer_${id}`).classList.remove("colleps");
      document.getElementById(`booking_more_inner_${id}`).classList.remove("fadout");
      event.target.innerText = "Close";
      document.getElementById(`row_addr_${id}`).classList.remove("eclip")
      document.getElementById(`row_addr_${id}`).classList.add("row-overflow-scroll")
    }, 200)
  }
  else{
    document.getElementById(`booking_more_outer_${id}`).classList.add("colleps");
    document.getElementById(`booking_more_inner_${id}`).classList.add("fadout");
    setTimeout(() => {
      document.getElementById(`booking_more_inner_${id}`).classList.add("hidden");
      event.target.innerText = "Detail";
      document.getElementById(`row_addr_${id}`).classList.add("eclip")
      document.getElementById(`row_addr_${id}`).classList.remove("row-overflow-scroll")
    }, 200)

  }
}


function add_notification(detail)
{
  document.getElementById("notification_box").innerHTML = `<div class="notification-box-field">
        <p class="notification-box-field-text">
          ${detail}
        </p>
        <img class="noti-close" onclick="this.parentElement.remove()" src="/static/icon/close-button.png" alt="">
      </div>` + document.getElementById("notification_box").innerHTML;
    document.getElementById("notification_container").classList.add("nav-detail-btn-container-override")
}



window.onload = () => {

  var noticlosebybtn = ""
  var noticlosebybox = ""
  document.getElementById("notification_btn").onmouseover = () => {
    clearTimeout(noticlosebybtn)
    clearTimeout(noticlosebybox)
    document.getElementById("notification_box").classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("notification_box").classList.remove("nofif_box_colleps");
    },100)

    document.getElementById("notification_container").classList.remove("nav-detail-btn-container-override")


    console.log(noticlosebybox)
  }
  document.getElementById("notification_btn").onmouseout  = () => {
    noticlosebybtn = setTimeout(() => {
      document.getElementById("notification_box").classList.add("nofif_box_colleps");
      setTimeout(() => {
        document.getElementById("notification_box").classList.add("hidden");
      },500)
    } , 1000)
  }
  document.getElementById("notification_box").onmouseover = () => {
    clearTimeout(noticlosebybox)
    clearTimeout(noticlosebybtn)
    document.getElementById("notification_container").classList.remove("nav-detail-btn-container-override")
  }
  document.getElementById("notification_box").onmouseout  = () => {
    noticlosebybox = setTimeout(() => {
      document.getElementById("notification_box").classList.add("nofif_box_colleps");
      setTimeout(() => {
        document.getElementById("notification_box").classList.add("hidden");
      },500)
    } , 1000)
  }



  document.getElementById("notification_btn").onclick = () => {
    if(Array.from(document.getElementById("notification_box").classList).includes("hidden"))
    {
      document.getElementById("notification_box").classList.remove("hidden");
      setTimeout(() => {
        document.getElementById("notification_box").classList.remove("nofif_box_colleps");
      },100)
    }
    else{
      document.getElementById("notification_box").classList.add("nofif_box_colleps");
      setTimeout(() => {
        document.getElementById("notification_box").classList.add("hidden");
      },500)
    }
  }



  fetch("/api/customer/roomdetail/" , {
    method : "POST",
    headers: { 'X-CSRFToken': getCookie('csrftoken') },
    body : JSON.stringify({
      jwttoken : window.localStorage.getItem("jtoken"),
      mode : 1,
    })
  }).then(res => res.json()).then(result => {
    if(result.code == 200){
      console.log(result.data)
      Array.from(result.data).forEach((roomobj) => {

        imgstr = ''
          roomobj.photos.forEach((photo) => {
            imgstr += `
            <img class="booking-more-room-photo" src="/media/${photo}" alt="">`;
          })
        facilitystr = ''
          Array.from(roomobj.facility.split(",")).forEach((facility) => {
            facilitystr += `
            <div>${facility}</div>`;
          })  
        flow_id = ""
        if(roomobj.is_expire == "0")
        {
          flow_id =  "panding_booking_container";
        }
        else if(roomobj.is_expire == "1")
        {
          flow_id =  "expired_booking_container";
        }
        else if(roomobj.is_expire == "2")
        {
          flow_id =  "completed_booking_container";
        }

        document.getElementById(flow_id).innerHTML += `
  
          <div class="booking-detail-row-inner-container">
          <div class="booking-detail-row">
            <div class="booking-detail-row-element eclip" id="row_addr_${roomobj.pay_id}">${roomobj.address}</div>
            <div class="booking-detail-row-element">${roomobj.duedate}</div>
            <div class="booking-detail-row-element"><a href="https://www.google.com/maps?q=${roomobj.location}">Click Here</a></div>
            <div class="booking-detail-row-element tab-btn" onclick="loadmoredetail(event , ${roomobj.pay_id})">detail</div>
          </div>
          <div class="booking-more-detail colleps  " id="booking_more_outer_${roomobj.pay_id}">
            <div id="booking_more_inner_${roomobj.pay_id}" class=" booking-detail-inner hidden fadout">   
              <div class="booking-more-detail-first">
                <div class="booking-more-row">
                  <div class="booking-more-lable">owner name</div>
                  <div class="booking-more-value">: ${roomobj.owner_name}</div>
                </div>
                <div class="booking-more-row">
                  <div class="booking-more-lable">owner Contact</div>
                  <div class="booking-more-value">: ${roomobj.owner_contact}</div>
                </div>
                <div class="booking-more-row">
                  <div class="booking-more-lable">owner email</div>
                  <div class="booking-more-value">: ${roomobj.owner_email}</div>
                </div>
                <div class="mid-line"></div>
                <div class="booking-more-row">
                  <div class="booking-more-lable">room name</div>
                  <div class="booking-more-value">: ${roomobj.room_name}</div>
                </div>
                <div class="booking-more-row">
                  <div class="booking-more-lable">room rating</div>
                  <div class="booking-more-value">: ${roomobj.room_rate} stars</div>
                </div>
                <div class="booking-more-row">
                  <div class="booking-more-lable">room price</div>
                  <div class="booking-more-value">: ${roomobj.room_price} INR</div>
                </div>
                <div class="booking-more-row">
                  <div class="booking-more-lable">advanced payment</div>
                  <div class="booking-more-value">: ${roomobj.advance_payment} INR</div>
                </div>
                <div class="booking-more-row">
                  <div class="booking-more-lable">room status</div>
                  <div class="booking-more-value">: ${roomobj.room_status}</div>
                </div>
              </div>
              <div class="booking-more-detail-second" >
                
                <div style="overflow: scroll; width: 100%; max-height: 90px;">
                  <div class="booking-more-facility-container" id="room_more_facility_${roomobj.pay_id}">
                    ${facilitystr}
                  </div>
                </div>
                <div style="overflow: scroll; width: 100%; max-height: 150px">
                  <div class="booking-more-facility-container" id="room_more_img_${roomobj.pay_id}">
                    ${imgstr}
                  </div>
                </div>
              
                
              </div>
            </div>
          </div>
        </div>
  
          `;

      })
    }
    else if(result.code == 405)
    {
      add_notification(result.detail)
    }
    
  })


    fetch("/api/payment/customer/details/" , {
      method : "POST",
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
      body : JSON.stringify({
        jwttoken : window.localStorage.getItem("jtoken")
      })
    }).then(res => res.json()).then(result => {
      if(result.code == 200){
        result.data.forEach((payobj) => {
          document.getElementById("payment_detail_table").innerHTML += `
          <tr>
            <td>${payobj.date_time}</td>
            <td>${payobj.payment_id}</td>
            <td>${payobj.amount}</td>
            <td>${payobj.status}</td>
            <td style="color: red;">${payobj.is_expire}</td>
            <td><div class="payment-query-btn" onclick="getpaymentreport(${payobj.payobj_id})">Get Report</div></td>
          </tr>
          `;
        })
      }
      else if(result.code == 405)
      {
        add_notification(result.detail)
      }
      
    })
    
    var pages = ["payment_history_page", "booking_history_page", "contact_page"]
  
    // side bar pages crousal
    pages.forEach((page_id) => {
        document.getElementById(`${page_id}_btn`).addEventListener('click', () => {
          pages.forEach((inner_page_id) => {
            document.getElementById(inner_page_id).classList.add("hidden");
          });
          document.getElementById(page_id).classList.remove("hidden");
          
        });
      })

    
      

    document.getElementById("contact_submit_btn").onclick = () => {
        document.getElementById("contact_submit_rounder").classList.remove("hidden");
        document.getElementById("contact_response_message").classList.add("hidden");
        let message = document.getElementById("contact_message"),
        flag = true,
        isrobot = document.getElementById("contact_not_robot"),
        email = document.getElementById("contact_email"),
        subject = document.getElementById("contact_subject");
        if (subject.value == "") {
        subject.classList.add("invalid-field")
        flag = false;
        } else {
        subject.classList.remove("invalid-field")
        }
    
        if (message.value == "") {
        message.placeholder = "Please write somthing....";
        flag = false;
        }
        if (!isrobot.checked) {
        document.getElementById("conatct_not_robot").style.color = "red"
        flag = false;
        } else {
        document.getElementById("conatct_not_robot").style.color = "#202020"
        }
    
        if (email.value == "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) == false) {
        email.classList.add("invalid-field")
        flag = false;
        } else {
        email.classList.remove("invalid-field")
        }
    
        if (flag == true) {
        fetch("/api/contact/query/customer/", {
                method: "POST",
                body: JSON.stringify({
                jwttoken: window.localStorage.getItem("jtoken"),
                subject: subject.value,
                email: email.value,
                message: message.value
                })
            }).then(res => res.json()).then((result) => {
                console.log(result);
                document.getElementById("contact_submit_rounder").classList.add("hidden");
                if (result.code == 200) {
                  add_notification("your response has been successfully recorded")
                email.value == "";
                subject.value == "";
                message.value == "";
                document.getElementById("contact_response_message").innerText = result.detail;
                } else if (result.code == 429) {
                console.log(result.detail)
                document.getElementById("contact_response_message").innerText = result.detail;
                } else if (result.code == 406) {
                console.log(result.detail)
                document.getElementById("contact_response_message").innerText = result.detail;
                } else if (result.code == 405) {
                console.log(result.detail)
                document.getElementById("contact_response_message").innerText = result.detail;
                }
        
                document.getElementById("contact_response_message").classList.remove("hidden");
        
            })
        } else {
        document.getElementById("contact_submit_rounder").classList.add("hidden");
        document.getElementById("contact_response_message").innerText = "Invalid Data";
        document.getElementById("contact_response_message").classList.remove("hidden");

    
        }
    }
}