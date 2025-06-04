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

function createDateCell(dateStr) {
  const expiryDate = document.createElement("td");

  const today = new Date();
  const productDate = new Date(dateStr);
  const diffDays = Math.ceil((productDate - today) / (1000 * 60 * 60 * 24));

  const indicator = document.createElement("span");
  indicator.classList.add("date-indicator");

  if (diffDays < 0) {
    indicator.classList.add("expired");
  } else if (diffDays <= 7) {
    indicator.classList.add("warning");
  } else {
    indicator.classList.add("fresh");
  }

  expiryDate.appendChild(indicator);
  expiryDate.appendChild(document.createTextNode(formatDatePL(dateStr)));

  return expiryDate;
}

function fillProductTable(data) {
  let table = document.querySelector("#product-table tbody");
  table.innerHTML = "";
  data.forEach((x) => {
    let newRow = document.createElement("tr");

    let name = document.createElement("td");
    name.textContent = x.name;
    newRow.appendChild(name);

    newRow.appendChild(createDateCell(x.expiryDate));

    let deleteButton = document.createElement("td");
    deleteButton.innerHTML = `
      <button class="delete-btn" data-id="${x.id}" title="Usuń">
        <img src="bin.png" alt="Usuń" class="delete-icon" />
      </button>
    `;
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
      newProduct[key] = `${year}-${month}-${day}`;
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
    body: JSON.stringify(newProduct),
  }).then((response) => {
    if (response.ok) {
        response.json().then((product) => {
          appendProductToTable(product);
        });
      event.target.reset();
    } else {
      console.error("Błąd podczas dodawania produktu");
    }
  });
}

function appendProductToTable(product) {
  let table = document.querySelector("#product-table tbody");
  let newRow = document.createElement("tr");

  let name = document.createElement("td");
  name.textContent = product.name;
  newRow.appendChild(name);

  newRow.appendChild(createDateCell(product.expiryDate));

  let deleteButton = document.createElement("td");
  deleteButton.innerHTML = `
    <button class="delete-btn" data-id="${product.id}" title="Usuń">
      <img src="bin.png" alt="Usuń" class="delete-icon" />
    </button>
  `;
  newRow.appendChild(deleteButton);

  table.appendChild(newRow);
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
      const button = document.querySelector(`.delete-btn[data-id="${id}"]`);
      if (button) {
        const row = button.closest("tr");
        row.remove();
      }
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

      const raw = response.recipes.trim();

      const recipes = raw
        .split(/^\s*=+\s*$/m)
        .map(r => r.trim())
        .filter(Boolean);

      recipes.forEach((recipe, index) => {
        const lines = recipe.split('\n');
        const title = lines[0] || `Przepis ${index + 1}`;
        const content = lines.slice(1).join('<br>');

        const recipeDiv = $('<div>').addClass('recipe-card').text(title);
        recipeDiv.click(function () {
          showGeneratedRecipeInModal({ title, content });
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


function saveRecipe(title, content) {
  const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
  if (!saved.find(r => r.title === title)) {
    saved.push({ title, content });
    localStorage.setItem("savedRecipes", JSON.stringify(saved));
    renderSavedRecipes();
  }
}

function deleteRecipe(title) {
  let saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
  saved = saved.filter(r => r.title !== title);
  localStorage.setItem("savedRecipes", JSON.stringify(saved));
  renderSavedRecipes();
  closeModal();
}

function renderSavedRecipes() {
  const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
  const container = $("#saved-recipes");
  container.empty();

  saved.forEach((recipe, index) => {
    const card = $("<div>").addClass("recipe-card").text(recipe.title);

    card.click(() => {
      $("#modal-title").text(recipe.title);
      $("#modal-body").html(recipe.content);
      $("#recipe-modal").removeClass("hidden");
      $("body").addClass("blurred");

      // serduszko usuwa przepis z ulubionych
      $(".save-modal").text("♡").attr("title", "Usuń przepis");
      $(".save-modal").off("click").on("click", () => {
        deleteRecipe(recipe.title);
      });

      $(".close-modal").off("click").on("click", closeModal);
    });

    container.append(card);
  });
}


function showGeneratedRecipeInModal(recipe) {
  const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
  const alreadySaved = saved.find(r => r.title === recipe.title);

  $("#modal-title").text(recipe.title);
  $("#modal-body").html(recipe.content);
  $("#recipe-modal").removeClass("hidden");
  $("body").addClass("blurred");

  $(".save-modal").text("♡");

  if (alreadySaved) {
    $(".save-modal").attr("title", "Usuń przepis").off("click").on("click", () => {
      deleteRecipe(recipe.title);
    });
  } else {
    $(".save-modal").attr("title", "Zapisz przepis").off("click").on("click", () => {
      saveRecipe(recipe.title, recipe.content);
      $(".save-modal").attr("title", "Usuń przepis");
    });
  }

  $(".close-modal").off("click").on("click", closeModal);
}

function closeModal() {
  $("#recipe-modal").addClass("hidden");
  $("body").removeClass("blurred");
}

$(document).ready(function () {
  renderSavedRecipes();
  $(".close-modal").click(closeModal);
});
