window.onload = () => {
  fetch("http://localhost:8080/products")
    .then((response) => response.json())
    .then((data) => fillProductTable(data));
};

function fillProductTable(data) {
  let table = document.querySelector("#product-table tbody");

  data.forEach((x) => {
    let newRow = document.createElement("tr");

    let id = document.createElement("td");
    id.textContent = x.id;
    newRow.appendChild(id);

    let name = document.createElement("td");
    name.textContent = x.name;
    newRow.appendChild(name);

    let expiryDate = document.createElement("td");
    expiryDate.textContent = x.expiry_date;
    newRow.appendChild(expiryDate);

    table.appendChild(newRow);
  });
}
