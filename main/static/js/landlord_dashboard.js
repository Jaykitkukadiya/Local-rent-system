var room_data = null;
var facility = null;
var pages = ["add_room_page", "manage_room_page", "payment_history_page" , "profile_page", "contact_page"]
var payment_pages = ["recent_payment_page", "bank_detail_page"]


// delete facility element on click
function delete_i(e) {
  let val = e.target.innerText;
  facility.splice(facility.indexOf(val), 1)
  e.target.parentNode.removeChild(e.target);
}



function initMap() {
  

  var myLatlng = {
    lat: 22.2587,
    lng: 71.1924
  };

  const map = new google.maps.Map(document.getElementById("choose_location_container"), {
    zoom: 4,
    center: myLatlng,
    disableDefaultUI: true,
    mapTypeControl: true,
    streetViewControl: true,
  });
  map.setOptions({ minZoom: 5, maxZoom: 25 });
  var marker = "";

 
  // click only
  map.addListener("click", (mapsMouseEvent) => {
    var userMarker = mapsMouseEvent.latLng;
    myLatlng = userMarker.toJSON();
    if (marker) {
      marker.setPosition(userMarker);
    } else {
      marker = new google.maps.Marker({
        position: userMarker,
        animation: google.maps.Animation.DROP,
        icon: pin_icon,
      });
      marker.setMap(map);
    }
    document.getElementById("loc_save_box").classList.remove("hidden");
    if (map.getZoom() < 13) {
      map.setZoom(map.getZoom() + 2);
      map.setCenter(myLatlng);
    }
    document.getElementById("see_loc").innerText = `${myLatlng.lat},${myLatlng.lng}`;
    console.log(myLatlng);

  });
}







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
// trigger
function allocate_document_trigger(e, id) {
  document.getElementById(`allocate_room_inp_document_${id}`).click();

  document.getElementById(`allocate_room_inp_document_${id}`).onchange = () => {
    let fread = new FileReader();
    fread.readAsDataURL(document.getElementById(`allocate_room_inp_document_${id}`).files[0]);

    fread.onload = function(imag) {
      e.target.innerText = String(document.getElementById(`allocate_room_inp_document_${id}`).files[0].name);
      document.getElementById(`allocate_room_inp_document_${id}`).onchange = null;
    }
  }
}

function copytxt(event){
 val = event.target.parentElement.innerText
 navigator.clipboard.writeText(val);
 event.target.parentElement.classList.add("bank-connect-message-noti")
 setTimeout( () => {
   event.target.parentElement.classList.remove("bank-connect-message-noti")
 } , 5000)
}


function bankchanged(data)
{
  if(document.getElementById("bank_list_select").value != "")
  {
    bankdata = data[document.getElementById("bank_list_select").value];
    document.getElementById("external_account_id").classList.remove("bank-row-value-container-empty");
    document.getElementById("external_account_id").innerText =": " +  bankdata.external_account_id;
    document.getElementById("account_holder_name").classList.remove("bank-row-value-container-empty");
    document.getElementById("account_holder_name").innerText = ": " + bankdata.account_holder_name;
    document.getElementById("bank_name").classList.remove("bank-row-value-container-empty");
    document.getElementById("bank_name").innerText = ": " + bankdata.bank_name;
    document.getElementById("account_number").classList.remove("bank-row-value-container-empty");
    document.getElementById("account_number").innerText = ": " + "XXXXXXXX"+String(bankdata.account_number);
    document.getElementById("account_routing").classList.remove("bank-row-value-container-empty");
    document.getElementById("account_routing").innerText = ": " + bankdata.routing_number;
    document.getElementById("account_country").classList.remove("bank-row-value-container-empty");
    document.getElementById("account_country").innerText = ": " + bankdata.country;
    document.getElementById("account_currency").classList.remove("bank-row-value-container-empty");
    document.getElementById("account_currency").innerText = ": " + bankdata.currency;
  }
  else{
    document.getElementById("external_account_id").classList.add("bank-row-value-container-empty");
    document.getElementById("account_holder_name").classList.add("bank-row-value-container-empty");
    document.getElementById("bank_name").classList.add("bank-row-value-container-empty");
    document.getElementById("account_number").classList.add("bank-row-value-container-empty");
    document.getElementById("account_routing").classList.add("bank-row-value-container-empty");
    document.getElementById("account_country").classList.add("bank-row-value-container-empty");
    document.getElementById("account_currency").classList.add("bank-row-value-container-empty");
  }
}
function trchanged(data)
{
  if(document.getElementById("tr_list_select").value != "")
  {
    trdata = data[document.getElementById("tr_list_select").value];
    document.getElementById("tr_cust_name").classList.remove("bank-row-value-container-empty");
    document.getElementById("tr_cust_name").innerText =": " +  trdata.customer_name;
    document.getElementById("tr_ref_status").classList.remove("bank-row-value-container-empty");
    document.getElementById("tr_ref_status").innerText = ": " + trdata.is_reversed;
    document.getElementById("tr_payment_id").classList.remove("bank-row-value-container-empty");
    document.getElementById("tr_payment_id").innerText = ": " + trdata.Payment_id;
    document.getElementById("tr_amount").classList.remove("bank-row-value-container-empty");
    document.getElementById("tr_amount").innerText = ": " + trdata.amount  + " " + String(trdata.currency).toUpperCase();
    document.getElementById("tr_fee").classList.remove("bank-row-value-container-empty");
    document.getElementById("tr_fee").innerText = ": " + trdata.amount * trdata.fees  + " " + String(trdata.currency).toUpperCase();
    document.getElementById("tr_created_at").classList.remove("bank-row-value-container-empty");
    document.getElementById("tr_created_at").innerText = ": " + new Date(trdata.created * 1000).toLocaleString();
    if(trdata.is_reversed == true)
    {
      
      document.getElementById("tr_refund_amount").classList.remove("bank-row-value-container-empty");
      document.getElementById("tr_refund_amount").innerText = ": " + trdata.refund_data.amount + " " + String(trdata.refund_data.currency).toUpperCase()  ;
      document.getElementById("tr_ref_id").classList.remove("bank-row-value-container-empty");
      document.getElementById("tr_ref_id").innerText = ": " + trdata.refund_data.refund_id;
      document.getElementById("tr_refund_created").classList.remove("bank-row-value-container-empty");
      document.getElementById("tr_refund_created").innerText = ": " + new Date(trdata.refund_data.created * 1000).toLocaleString();

      document.getElementById("tr_refund_btn").classList.remove("hidden");
      document.getElementById('tr_refund_btn').onclick = () => {
        document.getElementById("tr_payment_detail").classList.toggle("hidden");
        document.getElementById("tr_refund_detail").classList.toggle("hidden");
      }
    }
    else
    {
      
      document.getElementById("tr_refund_amount").classList.add("bank-row-value-container-empty");
      document.getElementById("tr_ref_id").classList.add("bank-row-value-container-empty");
      document.getElementById("tr_refund_created").classList.add("bank-row-value-container-empty");

      document.getElementById("tr_refund_btn").classList.add("hidden");
      document.getElementById("tr_refund_detail").classList.add("hidden");
      document.getElementById('tr_refund_btn').onclick = null
    }
  }
  else{
    document.getElementById("tr_cust_name").classList.add("bank-row-value-container-empty");
    document.getElementById("tr_ref_status").classList.add("bank-row-value-container-empty");
    document.getElementById("tr_payment_id").classList.add("bank-row-value-container-empty");
    document.getElementById("tr_amount").classList.add("bank-row-value-container-empty");
    document.getElementById("tr_fee").classList.add("bank-row-value-container-empty");
    document.getElementById("tr_created_at").classList.add("bank-row-value-container-empty");


    document.getElementById("tr_refund_amount").classList.add("bank-row-value-container-empty");
    document.getElementById("tr_ref_id").classList.add("bank-row-value-container-empty");
    document.getElementById("tr_refund_created").classList.add("bank-row-value-container-empty");

    document.getElementById("tr_refund_btn").classList.add("hidden");
    document.getElementById("tr_refund_detail").classList.add("hidden");
  }
}

function get_ac_detail(event) {
  event.target.classList.add("bank-connect-btn-disable")
  event.target.innerText = "Processing."
  event.target.onclick = null;
  flag = 1
  var intervalid = setInterval(() => {
    if(flag == 1)
    {
      event.target.innerText = "Processing.."
      flag = 2
    }
    else if(flag == 2)
    {
      event.target.innerText = "Processing..."
      flag = 3
    }
    else if(flag == 3)
    {
      event.target.innerText = "Processing...."
      flag = 4
    }
    else if(flag == 4)
    {
      event.target.innerText = "Processing....."
      flag = 1
    }
  },300)
  console.log("fdsfdsf")
  document.getElementById("bank_detail").classList.add("hidden")
  document.getElementById("bank_rounder").classList.remove("hidden")
  fetch('/api/bank/detail/retrive/' , {
    method: "POST",
    headers : { 'X-CSRFToken' : getCookie('csrftoken') , 'Content-Type': 'application/json'  },
  }).then(res => res.json()).then((result) => {
    console.log(result.data);
    event.target.onclick = (eventx) => get_ac_detail(eventx);
    event.target.classList.remove("bank-connect-btn-disable")
    event.target.innerText = "Refresh Details"
    document.getElementById("bank_detail").classList.remove("hidden")
    document.getElementById("bank_rounder").classList.add("hidden")
    clearInterval(intervalid)
    if(result.code == 200)
    {
      data = result.data

      // tr setup
      document.getElementById("tr_list_select").innerHTML = '<option value="">Select The Transection</option>';
      data.list_of_tr.forEach((listtr) => {
        document.getElementById("tr_list_select").innerHTML += `<option value="${listtr.payment_id}">${listtr.cust_name}</option>`;
      })
      document.getElementById("tr_list_select").onchange = () => {
        trchanged(data.tr_data);
      };




      document.getElementById("bank_list_select").innerHTML = '<option value="">Select The Bank</option>';
      data.list_of_bank.forEach((listbank) => {
        document.getElementById("bank_list_select").innerHTML += `<option value="${listbank.external_account_id}">${listbank.bank_name}</option>`;
      })
      document.getElementById("bank_list_select").onchange = () => {
        bankchanged(data.bankdata);
      };
      document.getElementById("stripe_account_id").classList.remove("bank-row-value-container-empty");
      document.getElementById("stripe_account_id").innerText = ": " + data.acc_id;
      document.getElementById("account_created_at").classList.remove("bank-row-value-container-empty");
      document.getElementById("account_created_at").innerText = ": " + new Date(data.created_at * 1000).toLocaleString();
      document.getElementById("support_mail").classList.remove("bank-row-value-container-empty");
      document.getElementById("support_mail").innerText = ": " + data.support_email;
      document.getElementById("support_contact").classList.remove("bank-row-value-container-empty");
      document.getElementById("support_contact").innerText = ": " + data.support_phone;
      document.getElementById("account_statment_descriptor").classList.remove("bank-row-value-container-empty");
      document.getElementById("account_statment_descriptor").innerText = ": " + data.Statement_Descriptor;
      document.getElementById("account_payout_descriptor").classList.remove("bank-row-value-container-empty");
      document.getElementById("account_payout_descriptor").innerText = ": " + data.Payout_Descriptor;
      document.getElementById("account_payout_schedule").classList.remove("bank-row-value-container-empty");
      document.getElementById("account_payout_schedule").innerText = ": " + data.Payout_Schedule.interval + " ---- " + data.Payout_Schedule.delay_days + " day rolling basis";
      document.getElementById("account_payout_status").classList.remove("bank-row-value-container-empty");
      document.getElementById("account_payout_status").innerText = ": " + data.payout_enable;
      document.getElementById("account_payout_method").classList.remove("bank-row-value-container-empty");
      document.getElementById("account_payout_method").innerText = ": " + data.payout_method;
      document.getElementById("account_panding_balance").parentElement.classList.remove("bank-row-value-container-empty");
      document.getElementById("account_panding_balance").innerText = data.panding_bl;
      document.getElementById("account_available_balance").parentElement.classList.remove("bank-row-value-container-empty");
      document.getElementById("account_available_balance").innerText = data.available_bl;
    }
  })
}

function bank_connect(event)
{
  event.target.classList.add("bank-connect-btn-disable")
  event.target.innerText = "Processing."
  event.target.onclick = null;
  flag = 1
  var intervalid = setInterval(() => {
    if(flag == 1)
    {
      event.target.innerText = "Processing.."
      flag = 2
    }
    else if(flag == 2)
    {
      event.target.innerText = "Processing..."
      flag = 3
    }
    else if(flag == 3)
    {
      event.target.innerText = "Processing...."
      flag = 4
    }
    else if(flag == 4)
    {
      event.target.innerText = "Processing....."
      flag = 1
    }
  },300)
  console.log("fdsfdsf")
  document.getElementById("bank_detail").classList.add("hidden")
  document.getElementById("bank_rounder").classList.remove("hidden")
  fetch("/api/bank/connect/" , {
    method : "POST",
    headers: { 'X-CSRFToken': getCookie('csrftoken') , 'Content-Type': 'application/json' },
    body : JSON.stringify({"foo":"bar"})
  }).then(res => res.json()).then(result => {
    // clearInterval(intervalid)
    if(result.code == 200)
    {
      location.href = result.data.url;
    }
    else if(result.code == 405){ 
      clearInterval(intervalid)
      console.log("sdfsd")
      event.target.onclick = (eventx) => bank_connect(eventx);
      event.target.classList.remove("bank-connect-btn-disable")
      event.target.innerText = "Connect Stripe Account"
      document.getElementById("bank_connect_message").classList.remove("hidden");
      document.getElementById("bank_detail").classList.remove("hidden")
      document.getElementById("bank_rounder").classList.add("hidden")
      document.getElementById("bank_connect_message").innerText = result.detail;
    }
    else
    {
      clearInterval(intervalid)
      event.target.onclick = (eventx) => bank_connect(eventx);
      event.target.classList.remove("bank-connect-btn-disable")
      event.target.innerText = "Connect Stripe Account"
      document.getElementById("bank_connect_message").classList.remove("hidden");
      document.getElementById("bank_detail").classList.remove("hidden")
      document.getElementById("bank_rounder").classList.add("hidden")
      document.getElementById("bank_connect_message").innerText = "Some error occured";
    }
  })
}
function unlink_account(event)
{
  event.target.classList.add("bank-connect-btn-disable")
  event.target.innerText = "Processing."
  event.target.onclick = null;
  flag = 1
  var intervalid = setInterval(() => {
    if(flag == 1)
    {
      event.target.innerText = "Processing.."
      flag = 2
    }
    else if(flag == 2)
    {
      event.target.innerText = "Processing..."
      flag = 3
    }
    else if(flag == 3)
    {
      event.target.innerText = "Processing...."
      flag = 4
    }
    else if(flag == 4)
    {
      event.target.innerText = "Processing....."
      flag = 1
    }
  },300)
  
  document.getElementById("bank_detail").classList.add("hidden")
  document.getElementById("bank_rounder").classList.remove("hidden")
  fetch("/api/bank/unlink/" , {
    method : "POST",
    headers: { 'X-CSRFToken': getCookie('csrftoken') , 'Content-Type': 'application/json' },
    body : JSON.stringify({"foo":"bar"})
  }).then(res => res.json()).then(result => {
    if(result.code == 200)
    {
      location.reload();
    }
    else if(result.code == 400){ 
      clearInterval(intervalid)
      event.target.onclick = (eventx) => bank_connect(eventx);
      event.target.classList.remove("bank-connect-btn-disable")
      event.target.innerText = "Connect Stripe Account"
      document.getElementById("bank_detail").classList.remove("hidden")
      document.getElementById("bank_rounder").classList.add("hidden")
      document.getElementById("bank_connect_message").classList.remove("hidden");
      document.getElementById("bank_connect_message").innerText = result.detail;
    }
    else if(result.code == 405){ 
      clearInterval(intervalid)
      event.target.onclick = (eventx) => bank_connect(eventx);
      event.target.classList.remove("bank-connect-btn-disable")
      event.target.innerText = "Connect Stripe Account"
      document.getElementById("bank_connect_message").classList.remove("hidden");
      document.getElementById("bank_detail").classList.remove("hidden")
      document.getElementById("bank_rounder").classList.add("hidden")
      document.getElementById("bank_connect_message").innerText = result.detail;
    }
    else if(result.code == 406){ 
      clearInterval(intervalid)
      event.target.onclick = (eventx) => bank_connect(eventx);
      event.target.classList.remove("bank-connect-btn-disable")
      event.target.innerText = "Connect Stripe Account"
      document.getElementById("bank_connect_message").classList.remove("hidden");
      document.getElementById("bank_detail").classList.remove("hidden")
      document.getElementById("bank_rounder").classList.add("hidden")
      document.getElementById("bank_connect_message").innerText = result.detail;
    }
  })
}


function getpaymentdetail(pay_id)
{
  let payobj_id = Number(pay_id)
  fetch("/api/payment/landlord/report/" , {
    method : "POST",
    headers: { 'X-CSRFToken': getCookie('csrftoken') },
    body : JSON.stringify({
      payobj_id : payobj_id,
    })
  }).then(res => res.json()).then(result => {
    // console.log(result)
    if(result.code == 200){
      console.log(result.detail)
      
    }
    else if(result.code == 404)
    {
      console.log(result.detail)
    }
    else if(result.code == 405)
    {
      console.log(result.detail)
    }
    
  })
}

//allocate room from basic detail table
function allocate_room(id) {
  console.log("allocated");
  let name = document.getElementById(`allocate_room_inp_name_${id}`).value.trim()
  let price = document.getElementById(`allocate_room_inp_price_${id}`).value.trim()
  let staytime = document.getElementById(`allocate_room_inp_staytime_${id}`).value.trim()
  let documenttype = document.getElementById(`allocate_room_inp_documenttype_${id}`).value.trim()
  let documentt = document.getElementById(`allocate_room_inp_document_${id}`).files
  let flag = 0
  if (name == "") {
    flag = 1;
    document.getElementById(`allocate_room_inp_name_${id}`).style.borderColor = "red";
  } else {
    document.getElementById(`allocate_room_inp_name_${id}`).style.borderColor = "white";

  }
  if (price == "" || isNaN(price)) {
    flag = 1;
    document.getElementById(`allocate_room_inp_price_${id}`).style.borderColor = "red";
  } else {
    document.getElementById(`allocate_room_inp_price_${id}`).style.borderColor = "white";

  }
  if (staytime == "" || isNaN(staytime)) {
    flag = 1;
    document.getElementById(`allocate_room_inp_staytime_${id}`).style.borderColor = "red";
  } else {
    document.getElementById(`allocate_room_inp_staytime_${id}`).style.borderColor = "white";

  }
  if (documenttype == "") {
    flag = 1;
    document.getElementById(`allocate_room_inp_documenttype_${id}`).style.borderColor = "red";
  } else {
    document.getElementById(`allocate_room_inp_documenttype_${id}`).style.borderColor = "white";

  }
  if (Array.from(documentt).length == 0) {
    flag = 1
    document.getElementById(`allocate_room_inp_document_btn_${id}`).style.backgroundColor = "red";
    document.getElementById(`allocate_room_inp_document_btn_${id}`).style.color = "white";
  } else {
    document.getElementById(`allocate_room_inp_document_btn_${id}`).style.backgroundColor = "white";
    document.getElementById(`allocate_room_inp_document_btn_${id}`).style.color = "black";

  }

  if (flag == 0) {

    let cust_data = new FormData()
    cust_data.append("roomid", id)
    cust_data.append("name", name)
    cust_data.append("price", price)
    cust_data.append("staytime", staytime)
    cust_data.append("document_type", documenttype)
    cust_data.append("documentt", document.getElementById(`allocate_room_inp_document_${id}`).files[0])
    fetch("/api/allocation/room/", {
      method: "POST",
      body: cust_data
    }).then(res => res.json()).then((result) => {
      console.log(result);
      if (result.code == 200) {
        location.reload()
      } else if (result.code == 405) {
        console.log(result.detail)
      }
    })
  }

}
//deallocate room from basic detail table
function deallocate_room(id) {
  document.getElementById(`manageroom_rating_container_${id}`).classList.remove("hidden")
  document.getElementById(`change_stay_time_${id}`).classList.remove("hidden")
}


// for final deallocation of room
function deallocate_room_final(id) {

  // stay time
  let staytime = document.getElementById(`change_stay_time_${id}`);
  let data = { "room_id": id, "rate": document.querySelector(`input[name='manageroom_feedback_${id}']:checked`).value }

  if (isNaN(staytime.value.trim())) { // if value is not number then alert
    staytime.style.borderBottomColor = "red";
  } else {

    staytime.borderBottomColor = "white";
    if (staytime.value.trim() != "") { // if value contains some value then add it for change db
      data = { "room_id": id, "rate": document.querySelector(`input[name='manageroom_feedback_${id}']:checked`).value, "staytime": staytime.value.trim() }
    }
    console.log(data);

    // final api calling
    fetch('/api/deallocation/room/', {
      method: "POST",
      body: JSON.stringify(data)
    }).then(res => res.json()).then((result) => {
      console.log(result);
      if (result.code == 200) {
        location.reload()
      } else if (result.code == 406) {
        console.log(result.detail)
      } else if (result.code == 405) {
        console.log(result.detail)
      }
    });

  }
}


// manage_room_detail for open allocating container in basic table
function manage_room_allocate(id) {
  document.getElementById(`manage_room_allocating_basic_container_${id}`).style.display = "flex";
  setTimeout((id) => {
    document.getElementById(`manage_room_allocating_basic_container_${id}`).classList.toggle("manageroom-basic-data-detail-open");
    // if (!Array.from(document.getElementById(`manage_room_detail_basic_container_${id}`).classList).includes("manageroom-basic-data-detail-open")) {

    // }
  }, 1, id)
}
// manage_room_detail for open detail container in basic table
function manage_room_detail(id) {
  document.getElementById(`manage_room_detail_basic_container_${id}`).style.display = "flex";
  setTimeout((id) => {
    document.getElementById(`manage_room_detail_basic_container_${id}`).classList.toggle("manageroom-basic-data-detail-open");
    if (!Array.from(document.getElementById(`manage_room_detail_basic_container_${id}`).classList).includes("manageroom-basic-data-detail-open")) {
      document.getElementById(`manageroom_rating_container_${id}`).classList.add("hidden")
      document.getElementById(`change_stay_time_${id}`).classList.add("hidden")
    }
  }, 1, id)
}
// blocked_room_detail for open detail container in basic table
function blocked_room_detail(id) {

  document.getElementById(`manage_room_detail_basic_${id}`).classList.remove("btn-blocked")
  if(Array.from(document.getElementById(`blocked_room_allocating_basic_container_${id}`).classList).includes("manageroom-basic-data-detail-open"))
  {
    blocked_room_allocate(id)
  }

  fetch("/api/blocked/roomdetail/" , {
    method : "POST",
    headers: { 'X-CSRFToken': getCookie('csrftoken') },
    body: JSON.stringify({
      "room_id" : id,
    })
  }).then(res => res.json()).then((result) => {
    console.log(result)
    if(result.code == 200){
      document.getElementById(`blocked_room_detail_email_${id}`).innerText = result.data.email
      document.getElementById(`blocked_room_detail_fst_date_${id}`).innerText = result.data.fst_date
      document.getElementById(`blocked_room_detail_lst_date_${id}`).innerText = result.data.lst_date
      document.getElementById(`blocked_room_detail_adv_amount_${id}`).innerText = result.data.amount
      document.getElementById(`blocked_room_detail_payment_id_${id}`).innerText = result.data.payment_id
    }
    else if(result.code == 405){
      console.log(result.detail)
    }
  });
  document.getElementById(`blocked_room_detail_basic_container_${id}`).style.display = "flex";
  setTimeout((id) => {
    document.getElementById(`blocked_room_detail_basic_container_${id}`).classList.toggle("manageroom-basic-data-detail-open");
    if (!Array.from(document.getElementById(`blocked_room_detail_basic_container_${id}`).classList).includes("manageroom-basic-data-detail-open")) {
      document.getElementById(`manageroom_rating_container_${id}`).classList.add("hidden")
      document.getElementById(`change_stay_time_${id}`).classList.add("hidden")
    }
  }, 1, id)
}
// blocked_room_detail for open detail container in basic table
function unblocked_room(id) {
  fetch("/api/unblock/room/" , {
    method : "POST",
    headers: { 'X-CSRFToken': getCookie('csrftoken') },
    body: JSON.stringify({
      "room_id" : id,
    })
  }).then(res => res.json()).then((result) => {
    if(result.code == 200){
      console.log(result);
      location.reload();
    }
    else if(result.code == 405){
      console.log(result.detail)
    }
  });
}









// filter starts

function datefilterchange(val)
{
  if(val == 1)
  {
    document.getElementById("time_filter_from").disabled = false;
    document.getElementById("time_filter_to").disabled = false;
    document.getElementById("fixed_selector").disabled = true;
  }
  else if( val == 2)
  {
    document.getElementById("fixed_selector").disabled = false;
    document.getElementById("time_filter_from").disabled = true;
    document.getElementById("time_filter_to").disabled = true;
  }
}
function filterselector(val)
{
  if(document.getElementById(`${val}_selector`).disabled == true)
  {
    document.getElementById(`${val}_selector`).disabled = false;
  }
  else
  {
    document.getElementById(`${val}_selector`).disabled = true;
  }

}


function applyfilter()
{
  let filterdata = {}
  console.log("filter applyed")
  if(document.querySelector("input[name='time-filter']:checked").value == "date")
  {
    let fromval = document.getElementById("time_filter_from");
    let toval = document.getElementById("time_filter_to");
    if(fromval.value != '' && toval.value != '')
    {
      fromval.classList.remove("invalid-field")
      toval.classList.remove("invalid-field")
      let fromvalx = fromval.value.split("-")
      let tovalx = toval.value.split("-")
      let fromdt = new Date(Number(fromvalx[0]) , Number(fromvalx[1]) - 1 , Number(fromvalx[2]),0,0,0).getTime()
      let todt = new Date(Number(tovalx[0]) , Number(tovalx[1]) - 1 , Number(tovalx[2]),0,0,0).getTime()
      if(fromdt < todt && fromdt < new Date().getTime() && todt <= new Date().getTime())
      {
        fromval.classList.remove("invalid-field")
        toval.classList.remove("invalid-field")

        filterdata.time_filter = {
          type : "date",
          data: [fromdt , todt]
        }
      }
      else
      {
        fromval.classList.add("invalid-field")
        toval.classList.add("invalid-field")
      }
    }
    else{
      fromval.classList.add("invalid-field")
      toval.classList.add("invalid-field")
    }
  }
  else if (document.querySelector("input[name='time-filter']:checked").value == "fixed")
  {
    if(document.getElementById("fixed_selector").value != '')
    {
      document.getElementById("fixed_selector").classList.remove("invalid-field")
      filterdata.time_filter = {
        type : "fixed",
        data: document.getElementById("fixed_selector").value
      }
    }
    else{
      document.getElementById("fixed_selector").classList.add("invalid-field")
    }
  }

  if(document.getElementById("status_filter").checked){
    if(document.getElementById("status_filter_selector").value != '')
    {
      document.getElementById("status_filter_selector").classList.remove("invalid-field")
      filterdata.status_filter = {
        data : document.getElementById("status_filter_selector").value
      }
    }
    else{
      document.getElementById("status_filter_selector").classList.add("invalid-field")
    }
  }
  if(document.getElementById("validity_filter").checked){
    if(document.getElementById("validity_filter_selector").value != '')
    {
      document.getElementById("validity_filter_selector").classList.remove("invalid-field")
      filterdata.validity_filter = {
        data : document.getElementById("validity_filter_selector").value
      }
    }
    else{
      document.getElementById("validity_filter_selector").classList.add("invalid-field")
    }
    
    
  }
  if(document.getElementById("name_filter").checked){
    if(document.getElementById("name_filter_selector").value != '')
    {
      document.getElementById("name_filter_selector").classList.remove("invalid-field")
      filterdata.name_filter = {
        data : document.getElementById("name_filter_selector").value
      } 
    }
    else{
      document.getElementById("name_filter_selector").classList.add("invalid-field")
    }
    
  }
  console.log(filterdata)
  if(Object.keys(filterdata).length > 0)
  {
    document.getElementById("payment_detail_table").classList.add("hidden");
    document.getElementById("apply_filter_rounder").classList.remove("hidden");
    fetch("/api/payment/filter/landlord/",{
      method:"POST",
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
      body : JSON.stringify({
        filter_data : filterdata
      })
    }).then(res => res.json()).then((result) => {
      console.log(result)
      if(result.code == 200)
      {
        if(result.data.length > 0)
        { 
              document.getElementById("payment_detail_table").innerHTML = `
                    <tr>
                        <th>Date & Time</th>
                        <th>Payment Id</th>
                        <th>Room Name</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>validity</th>
                        <th style="resize: none; border: none;">      </th>
                    </tr>
                `;
              result.data.forEach(payobj => {
                document.getElementById("payment_detail_table").innerHTML += `
                
                <tr>
                    <td>${payobj.datetime}</td>
                    <td>${payobj.payment_id}</td>
                    <td>${payobj.room_name}</td>
                    <td>${payobj.amount}</td>
                    <td>${payobj.status}</td>
                    <td>${payobj.validity}</td>
                    <td><div class="payment-query-btn" onclick="getpaymentdetail('${payobj.pay_id}')">Detail</div></td>
                </tr> 
                
                `;
                
              });

              document.getElementById("payment_detail_table").classList.remove("hidden");
              document.getElementById("apply_filter_rounder").classList.add("hidden");
              document.getElementById("filter_message").classList.add("hidden");
        
        }
        else
        {
          document.getElementById("filter_message").innerText = "No Data Available"
          document.getElementById("filter_message").classList.remove("hidden");
          document.getElementById("apply_filter_rounder").classList.add("hidden");
        }
      }
      else if(result.code = 405)
      {
        console.log(result.detail)
        document.getElementById("filter_message").innerText = result.detail
        document.getElementById("filter_message").classList.remove("hidden");
        document.getElementById("apply_filter_rounder").classList.add("hidden");
      }
    })
  }
  else
  {
    console.log("no data")
  }
}


// filter ends

















function blocked_room_allocate(id) {
  document.getElementById(`blocked_room_allocating_basic_container_${id}`).classList.toggle("flx");
  setTimeout((id) => {
    document.getElementById(`blocked_room_allocating_basic_container_${id}`).classList.toggle("manageroom-basic-data-detail-open");
    // if (!Array.from(document.getElementById(`blocked_room_allocating_basic_container_${id}`).classList).includes("manageroom-basic-data-detail-open")) {

    // }
  }, 1, id)
}
// add facility tag while press enter
document.getElementById("add_room_facility_inp").addEventListener('keypress', function(event) {
  if (event.key == "Enter" && document.getElementById('add_room_facility_inp').value.trim() != "") {
    document.getElementById("add_room_facilities").innerHTML += `
        <p class="add-room-facility" onclick=delete_i(event) title="Click To Delete">
        ${document.getElementById('add_room_facility_inp').value.trim()}</p>
        `;
    facility.push(document.getElementById('add_room_facility_inp').value.trim());
    document.getElementById('add_room_facility_inp').value = "";
  }
});

// side bar pages crousal
pages.forEach((page_id) => {
  document.getElementById(`${page_id}_btn`).addEventListener('click', () => {
    pages.forEach((inner_page_id) => {
      document.getElementById(inner_page_id).classList.add("hidden");
    });
    document.getElementById(page_id).classList.remove("hidden");
    clearpages();
    if (page_id == "add_room_page") {
      room_data = new FormData();
      facility = new Array();
    }
  });
})
// side bar pages crousal
payment_pages.forEach((page_id) => {
  document.getElementById(`${page_id}_btn`).addEventListener('click', () => {
    payment_pages.forEach((inner_page_id) => {
      document.getElementById(inner_page_id).classList.add("hidden");
    });
    document.getElementById(page_id).classList.remove("hidden");
  });
})


var clearpages = () => {
  room_data = null;
  facility = null;
  document.getElementById("add_room_facilities").innerHTML = "";
  document.getElementById("add_room_img_container").innerHTML = "";

}
document.getElementById("payment_history_page_btn").click();

//   document.getElementById("add_room_popup_tag_clear_btn").onclick = () => {
//     document.getElementById("facility_tag_container").innerHTML = "";
//     document.getElementById("add_room_preview_img_container").innerHTML = "";
//     document.getElementById("add_room_price").value = "";
//     document.getElementById("add_room_name").value = "";
//     facility = new Array();
//     room_data = new FormData();
//   }
document.getElementById("add_room_photo_btn_visual_btn").onclick = () => {
  document.getElementById("add_room_photo_btn").click();
}

document.getElementById("add_room_photo_btn").onchange = () => {
  var fread = new FileReader();
  fread.readAsDataURL(document.getElementById("add_room_photo_btn").files[0]);

  fread.onload = function(imag) {
    console.log();
    document.getElementById("add_room_img_container").innerHTML += `
                  <img class="add-room-photo" src="${imag.target.result}" alt="">
              `;

    fetch(imag.target.result)
      .then(res => res.blob())
      .then((res) => {
        room_data.append(String(document.getElementById("add_room_photo_btn").files[0].name), res);
        document.getElementById("add_room_photo_btn").value = null;

      })

  }
}



document.getElementById("add_room_btn").onclick = () => {
  let flg = 1
  if (document.getElementById("add_room_price").value == "" || isNaN(document.getElementById("add_room_price").value)) {
    flg = 0;
    document.getElementById("add_room_price").style.borderBottomColor = "red";
  } else {
    document.getElementById("add_room_price").style.borderBottomColor = "white";
    room_data.append("price", document.getElementById("add_room_price").value);
  }

  if (document.getElementById("add_room_name").value == "") {
    flg = 0;
    document.getElementById("add_room_name").style.borderBottomColor = "red";
  } else {
    document.getElementById("add_room_name").style.borderBottomColor = "white";
    room_data.append("room_name", document.getElementById("add_room_name").value);
  }

  if (document.getElementById("add_room_facilities").childElementCount == 0) {
    flg = 0;
    document.getElementById("add_room_facility_inp").style.borderBottomColor = "red";
  } else {
    document.getElementById("add_room_facility_inp").style.borderBottomColor = "white";
    room_data.append("facilities", facility);
  }

  if (document.getElementById("add_room_img_container").childElementCount == 0) {
    flg = 0;
    document.getElementById("add_room_photo_btn_visual_btn").style.backgroundColor = "red";
  } else {

    document.getElementById("add_room_photo_btn_visual_btn").style.backgroundColor = "white";
  }

  for (var pair of room_data.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }

  if (flg == 1) {

    fetch("/api/add/room/", {
      method: "POST",
      body: room_data
    }).then(res => res.json()).then((res) => {
      console.log(res);
    })
    facility = [];
    room_data = new FormData()
  }
}

let isMobileFieldChange = false,
  profile_backup_mobile = document.getElementById("profile_page_mobile_field").value,
  profile_backup_email = document.getElementById("profile_page_email_field").value,
  isEmailFieldChange = false,
  isLocationField = document.getElementById("see_loc"),
  isLocationFieldChange = false,
  mobileInputChangeListenerRef = null,
  emailInputChangeListenerRef = null,
  submitButton = document.getElementById("profile_save_btn"),
  cancelButton = document.getElementById("profile_cancel_btn"),
  profile_update_form_details = new FormData();

document.getElementById("profile_img_update_btn").onclick = () => {
  console.log("log image");
  document.getElementById("profile_detail_img_hidden_inp").click();
  document.getElementById("profile_img_update_btn").classList.add("hidden");
  document.getElementById("profile_pic_upload_rounder").classList.remove("colleps");
  profile_update_form_details = new FormData();
  document.body.onfocus = () => {
    if (document.getElementById("profile_detail_img_hidden_inp").files.length < 1) {
      document.getElementById("profile_img_update_btn").classList.remove("hidden");
      document.getElementById("profile_pic_upload_rounder").classList.add("colleps");
    }
    document.body.onfocus = null;
  }
}


function save_loc()
{
  document.getElementById("loc_save_box").classList.add("hidden");
  document.getElementById("choose_location_container").classList.add("hidden");
  document.getElementById("profile_page_content").classList.remove("hidden");
  document.getElementById("choose_loc_btn").innerText = "Change Location";
  enableProfileFormsSubmitButtons();
  isLocationFieldChange = true;
  console.log(document.getElementById("see_loc").innerText);
}
function cancel_loc()
{
  document.getElementById("loc_save_box").classList.add("hidden");
  document.getElementById("choose_location_container").classList.add("hidden");
  document.getElementById("profile_page_content").classList.remove("hidden");
  isLocationField.innerText = "";
}
function choose_loc()
{
  document.getElementById("profile_page_content").classList.add("hidden");
  document.getElementById("choose_location_container").classList.remove("hidden");
}


document.getElementById("profile_detail_img_hidden_inp").onchange = () => {
  var fread = new FileReader();
  if (document.getElementById("profile_detail_img_hidden_inp").files.length != 0) {
    fread.readAsDataURL(document.getElementById("profile_detail_img_hidden_inp").files[0]);

    fread.onload = function(imag) {
      console.log();
      document.getElementById("profile_detail_img").setAttribute("src", imag.target.result)

      fetch(imag.target.result)
        .then(res => res.blob())
        .then((res) => {
          profile_update_form_details.append(String(document.getElementById("profile_detail_img_hidden_inp").files[0].name), res);
          document.getElementById("profile_img_update_btn").classList.remove("hidden");
          document.getElementById("profile_pic_upload_rounder").classList.add("colleps");
          enableProfileFormsSubmitButtons();
        })

    }
  }
}




document.getElementById("profile_page_mobile_field_btn").onclick = () => {
  console.log("log mobile");
  document.getElementById("profile_page_mobile_field_btn").style.display = 'none';
  const input = document.getElementById("profile_page_mobile_field");
  profile_backup_mobile = input.value;
  input.removeAttribute("disabled");
  input.focus();
  input.parentElement.style.borderColor = "#000000";
  mobileInputChangeListenerRef = input.addEventListener("input", (event) => {
    isMobileFieldChange = event.target.value != profile_backup_mobile ? true : false;
  })
  enableProfileFormsSubmitButtons();
}

document.getElementById("profile_page_email_field_btn").onclick = () => {
  document.getElementById("profile_page_email_field_btn").style.display = 'none';
  const input = document.getElementById("profile_page_email_field");
  profile_backup_email = input.value;
  input.removeAttribute("disabled");
  input.focus();
  input.parentElement.style.borderColor = "#000000";
  emailInputChangeListenerRef = input.addEventListener("input", (event) => {
    isEmailFieldChange = event.target.value != profile_backup_email ? true : false;

  })
  enableProfileFormsSubmitButtons();
}

function enableProfileFormsSubmitButtons() {
  document.getElementById("profile_submit_button").classList.remove("hidden")
}

document.getElementById("profile_cancel_btn").onclick = () => {
  profile_update_form_details = new FormData();
  document.getElementById("profile_save_rounder").classList.remove("colleps");
  document.getElementById("profile_page_mobile_field_btn").style.display = 'block';
  document.getElementById("profile_page_mobile_field").value = profile_backup_mobile;
  document.getElementById("profile_page_mobile_field").parentElement.style.borderColor = "#525252";
  document.getElementById("profile_page_email_field").parentElement.style.borderColor = "#525252";
  document.getElementById("profile_page_email_field").value = profile_backup_email;
  document.getElementById("profile_page_mobile_field").setAttribute("disabled", true);
  document.getElementById("profile_page_email_field").setAttribute("disabled", true);
  document.getElementById("profile_page_email_field_btn").style.display = 'block';
  document.getElementById("profile_detail_img").setAttribute("src", "/media/" + default_profile);
  document.getElementById("profile_save_rounder").classList.add("colleps");
  document.getElementById("profile_submit_button").classList.add("hidden");
  isLocationFieldChange = false;
}
document.getElementById("profile_save_btn").onclick = () => {
  document.getElementById("profile_page_mobile_field").parentElement.style.borderColor = "#525252";
  document.getElementById("profile_page_email_field").parentElement.style.borderColor = "#525252";
  isMobileFieldChange == true ? profile_update_form_details.append("mobile", document.getElementById("profile_page_mobile_field").value) : profile_update_form_details.delete("mobile");
  isEmailFieldChange == true ? profile_update_form_details.append("email", document.getElementById("profile_page_email_field").value) : profile_update_form_details.delete("email");
  isLocationFieldChange == true ? profile_update_form_details.append("location",isLocationField.innerText) : profile_update_form_details.delete("location");

  document.getElementById("profile_save_rounder").classList.remove("colleps");
  fetch("/api/update/landlord/profile/", {
    method: "POST",
    body: profile_update_form_details
  }).then(res => res.json()).then((result) => {
    console.log(result);
    document.getElementById("profile_save_rounder").classList.add("colleps");

    if (result.code == 200) {
      document.getElementById("profile_page_mobile_field_btn").style.display = 'block';
      document.getElementById("profile_page_mobile_field").parentElement.style.borderColor = "#525252";
      document.getElementById("profile_page_email_field").parentElement.style.borderColor = "#525252";
      document.getElementById("profile_page_email_field_btn").style.display = 'block';
      document.getElementById("profile_submit_button").classList.add("hidden");
    } else if (result.code == 406) {
      console.log(result.detail)
    } else if (result.code == 405) {
      console.log(result.detail)
    }

  })
}




document.getElementById("contact_submit_btn").onclick = () => {
  document.getElementById("contact_submit_rounder").classList.remove("hidden");
  document.getElementById("contact_response_message").classList.add("hidden");
  let message = document.getElementById("contact_message"),
    flag = true,
    isrobot = document.getElementById("contact_not_robot"),
    email = document.getElementById("contact_email"),
    subject = document.getElementById("contact_subject");
  console.log("message sent");
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
    fetch("/api/contact/query/", {
      method: "POST",
      body: JSON.stringify({
        subject: subject.value,
        email: email.value,
        message: message.value
      })
    }).then(res => res.json()).then((result) => {
      console.log(result);
      document.getElementById("contact_submit_rounder").classList.add("hidden");
      if (result.code == 200) {
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