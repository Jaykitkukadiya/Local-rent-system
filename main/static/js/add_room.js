window.onload = () => {
  let cards = document.getElementById("card_container");
  document.getElementById("cards_scroll_left").onclick = () => {
    cards.scroll(cards.scrollLeft - 520, 0)
  }
  document.getElementById("cards_scroll_right").onclick = () => {
    cards.scroll(cards.scrollLeft + 520, 0)
  }
  var room_data = null;
  var facility = null;

  document.getElementById("add-room-popup-opner").onclick = () => {
    document.getElementById("add_room_popup").classList.remove("hidd");
    room_data = new FormData();
    facility = new Array()
  }
  document.getElementById("add-room-popup-opner-initial").onclick = () => {
    document.getElementById("add-room-popup-opner").click();
  }
  document.getElementById("add-room-popup-closer").onclick = () => {
    document.getElementById("add_room_popup").classList.add("hidd");
    room_data = null;
    facility = null;
  }

  document.getElementById("add_facility_tag").onclick = () => {
    document.getElementById("facility_tag_container").innerHTML += `
        <p class="facility-tag">${document.getElementById('facility_tag_text').value}</p>
        `;
    facility.push(document.getElementById('facility_tag_text').value);
    document.getElementById('facility_tag_text').value = "";
    console.log(facility);
  }
  document.getElementById("add_room_popup_tag_clear_btn").onclick = () => {
    document.getElementById("facility_tag_container").innerHTML = "";
    document.getElementById("add_room_preview_img_container").innerHTML = "";
    document.getElementById("add_room_price").value = "";
    document.getElementById("add_room_name").value = "";
    facility = new Array();
    room_data = new FormData();
  }
  document.getElementById("add_room_add_img_btn").onclick = () => {
    document.getElementById("add_room_add_img").click();
  }

  document.getElementById("add_room_add_img").onchange = () => {
    var fread = new FileReader();
    fread.readAsDataURL(document.getElementById("add_room_add_img").files[0]);

    fread.onload = function(imag) {
      document.getElementById("add_room_preview_img_container").innerHTML += `
                <img class="preview-img" src="${imag.target.result}" alt="">
            `;
      document.getElementById("add_room_add_img").value = null;

      fetch(imag.target.result)
        .then(res => res.blob())
        .then((res) => {
          room_data.append(`image${document.getElementById("add_room_preview_img_container").childElementCount }`, res);

        })

    }
  }
  document.getElementById("facility_tag_text").addEventListener('keypress', function(event) {
    if (event.key == "Enter") {
      document.getElementById("add_facility_tag").click();
    }
  });

  document.getElementById("add_room_btn").onclick = () => {
    let flg = 1
    if (document.getElementById("add_room_price").value == "") {
      flg = 0;
      document.getElementById("add_room_price").style.borderBottomColor = "red";
    } else {
      room_data.append("price", document.getElementById("add_room_price").value);
    }

    if (document.getElementById("add_room_name").value == "") {
      flg = 0;
      document.getElementById("add_room_name").style.borderBottomColor = "red";
    } else {
      room_data.append("room_name", document.getElementById("add_room_name").value);
    }

    if (document.getElementById("facility_tag_container").childElementCount == 0) {
      flg = 0;
      document.getElementById("facility_tag_container").style.border = "1px solid red";
    } else {
      room_data.append("facilities", facility);
    }

    if (document.getElementById("add_room_preview_img_container").childElementCount == 0) {
      flg = 0;
      document.getElementById("add_room_preview_img_container").style.border = "1px solid red";
    }

    for (var pair of room_data.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    if (flg == 1) {
      document.getElementById("add_room_price").style.borderBottomColor = "black";
      document.getElementById("add_room_name").style.borderBottomColor = "black";
      document.getElementById("facility_tag_container").style.border = "1px solid black";
      document.getElementById("add_room_preview_img_container").style.border = "1px solid black";
      // code to upload data here
      if (document.getElementById("card_container_inner").childElementCount == 0) {
        document.getElementById("initial_add_comonent").classList.add("hidd")
        document.getElementById("followed_rooms_component").classList.remove("hidd")
      }
      document.getElementById("card_container_inner").innerHTML += `
            <div class="bdy-room-card">
            <img class="bdy-room-card-img" src="${document.getElementById("add_room_preview_img_container").firstElementChild.src}" alt="">
            <div class="bdy-room-card-title-container">
                <p class="bdy-room-card-title">${document.getElementById("add_room_name").value}</p>
                <p class="bdy-room-card-title">RS.${document.getElementById("add_room_price").value} per night</p>
            </div>
            </div>
            `;
      document.getElementById("add_room_popup_tag_clear_btn").click();
      document.getElementById("add-room-popup-closer").click();
    }
  }
}