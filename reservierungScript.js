"use strict";
let reservierungsButton = document.getElementById("reservierung");
reservierungsButton.addEventListener("click", reservieren);
async function reservieren() {
    let nameInput = document.getElementById("name");
    let reservierung = JSON.parse(localStorage.getItem("reservierungen"));
    reservierung.name = nameInput.value.trim();
    console.log(reservierung.name);
    await fetch("http://127.0.0.1:8100/reservierung", {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(reservierung)
    });
    window.location.href = "http://127.0.0.1:5500/home.html";
}
//# sourceMappingURL=reservierungScript.js.map