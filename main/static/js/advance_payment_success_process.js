window.onload = () => {
    document.getElementById("initial_page_success").classList.remove("hidden")
    setTimeout(() => {
        document.getElementById("initial_page_success").classList.remove("swipe-up1");
    }, 500)
    console.log("jwt : ")
    document.getElementById("initial_page_dashboard_btn").onclick = () => {
        document.getElementById("initial_page_success").classList.add("swipe-up");
        setTimeout(() => {
            location.href = "/user/dashboard/"+jwt;
        }, 500)
    }
}