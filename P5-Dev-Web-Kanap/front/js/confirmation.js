let idOrder = window.location.search.split("?orderId=").join("");
let spanID = document.querySelector("#orderId");
spanID.innerHTML = idOrder;