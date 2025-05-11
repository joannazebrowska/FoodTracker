window.onload = () => { //kod uruchomi sie dopiero gdy strona calkowicie sie zaladuje (html,css,obrazki etc.)
  fetch("http://localhost:8080/products") //wysyla zapytanie typu get do backendu springboot pod adresem /products
    .then((response) => response.json()) //konwercja odp. http do formatu json(czyli obiektu JS)
    .then((data) => fillProductTable(data));  //po pobraniu danych, przekazuje je do funkcji fillproducttable,ktora:
};

function formatDatePL(dateStr) {
    if (!dateStr) return "";
    const[year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
}

function fillProductTable(data) {
  let table = document.querySelector("#product-table tbody"); //zbiera referencje do tabeli w html (tbody)

  data.forEach((x) => { //do kazdego produktu z backendu (x) tworzy wiersz tr i 3 komorki td
    let newRow = document.createElement("tr");

    // let id = document.createElement("td");
    // id.textContent = x.id;
    // newRow.appendChild(id);

    let name = document.createElement("td");
    name.textContent = x.name;
    newRow.appendChild(name);

    let expiryDate = document.createElement("td");
    expiryDate.textContent = formatDatePL(x.expiryDate);
    newRow.appendChild(expiryDate);

    let deleteButton = document.createElement("td");
    deleteButton.innerHTML = `<button class="delete-btn" data-id="${x.id}">Usuń</button>`;
    newRow.appendChild(deleteButton);

    table.appendChild(newRow);
  });
  //ugulnie dane z backendu leca przez fetch, sa zamieniane na js-owy obiekt i automatycznie wysweitlane jako wiersze tabeli w htlm
}

document.querySelector(".add-product-form").addEventListener('submit', event => {
    addProduct(event);
})

function addProduct(event) {
    event.preventDefault();
    let data = new FormData(event.target);
    let newProduct = {}

    data.forEach((value, key) => newProduct[key] = value)

    fetch("http://localhost:8080/products", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([newProduct])
    })
    .then(response => {
        if(response.ok) {
            location.reload();
        }
    })
}


document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const productId = event.target.getAttribute("data-id");
    deleteProduct(productId);
  }
});

function deleteProduct(id) {
  fetch(`http://localhost:8080/products/${id}`, {
    method: "DELETE"
  })
  .then(response => {
    if (response.ok) {
      location.reload(); 
    } else {
      console.error("Błąd podczas usuwania produktu");
    }
  });
}
