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

// MODERNIZED RECIPE DISPLAY
$(document).ready(function () {
  $('#get-recipes').click(function () {
    $.get('http://localhost:8080/recipes', function (response) {
      const recipesContainer = $('#recipes-result');
      recipesContainer.empty();

      const recipes = response.recipes.split(/\n\d+\.\s/).filter(Boolean);

      recipes.forEach((recipe, index) => {
        const recipeDiv = $('<div>').addClass('recipe-card');
        recipeDiv.html(`
          <h3>Przepis ${index + 1}</h3>
          <p>${recipe.replace(/-\s/g, "<br>• ")}</p>
        `);
        recipesContainer.append(recipeDiv);
      });
    }).fail(function () {
      alert("Błąd podczas pobierania przepisów");
    });
  });
});


    flatpickr("#expiryDate", {
      dateFormat: "d.m.Y",     // 24.05.2025
      locale: "pl"
    });