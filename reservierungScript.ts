let reservierungsButton: HTMLElement = document.getElementById("reservierung");
reservierungsButton.addEventListener("click", reservieren);

async function reservieren(): Promise<void>  {
    let nameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("name");
    let reservierung: Reservierung = JSON.parse(localStorage.getItem("reservierungen"));
    reservierung.name = nameInput.value.trim();
    await fetch("https://asta-gis-2021.herokuapp.com/reservierung", {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(reservierung)
    });
    window.location.href = "https://doanmaip.github.io/GiS-Pruefung-2020/home.html";
}
