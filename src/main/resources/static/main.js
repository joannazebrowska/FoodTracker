window.onload = () => {
  fetch("http://localhost:8080/products")
    .then((response) => response.json())
    .then((data) => fillProductTable(data));
};

function formatDatePL(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

function fillProductTable(data) {
  let table = document.querySelector("#product-table tbody");
  data.forEach((x) => {
    let newRow = document.createElement("tr");

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
}

document.querySelector(".add-product-form").addEventListener("submit", (event) => {
  addProduct(event);
});

function addProduct(event) {
  event.preventDefault();
  let data = new FormData(event.target);
  let newProduct = {};

  data.forEach((value, key) => {
    if (key === "expiryDate") {
      const [day, month, year] = value.split(".");
      newProduct[key] = `${year}-${month}-${day}`; // backend-friendly format
    } else {
      newProduct[key] = value;
    }
  });

  fetch("http://localhost:8080/products", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify([newProduct]),
  }).then((response) => {
    if (response.ok) {
      location.reload();
    } else {
      console.error("Błąd podczas dodawania produktu");
    }
  });
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const productId = event.target.getAttribute("data-id");
    deleteProduct(productId);
  }
});

function deleteProduct(id) {
  fetch(`http://localhost:8080/products/${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (response.ok) {
      location.reload();
    } else {
      console.error("Błąd podczas usuwania produktu");
    }
  });
}



$(document).ready(function () {
  $('#get-recipes').click(function () {
    $.get('http://localhost:8080/recipes', function (response) {
      const recipesContainer = $('#recipes-result');
      recipesContainer.empty();

      const recipes = response.recipes.split('===').map(r => r.trim()).filter(Boolean);

      recipes.forEach((recipe, index) => {
        const lines = recipe.split('\n');
        const title = lines[0];
        const content = lines.slice(1).join('<br>');

        const recipeDiv = $('<div>').addClass('recipe-card').text(title);
        recipeDiv.click(function () {
          $('#modal-title').text(title);
          $('#modal-body').html(content);
          $('body').addClass('blurred'); // dodaj klasę rozmycia
          $('#recipe-modal').removeClass('hidden');
        });

        recipesContainer.append(recipeDiv);
      });

      $('.close-modal').click(function () {
        $('#recipe-modal').addClass('hidden');
        $('body').removeClass('blurred');
      });
    }).fail(function () {
      alert("Błąd podczas pobierania przepisów");
    });
  });
});



flatpickr("#expiryDate", {
  dateFormat: "d.m.Y",  
  locale: "pl"
});