let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Fetch and display all toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach((toy) => renderToy(toy));
      });
  }

  // Render a single toy card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="toy-${toy.id}">Like ❤️</button>
    `;
    
    const likeButton = card.querySelector(".like-btn");
    likeButton.addEventListener("click", () => increaseLikes(toy, card));
    
    toyCollection.appendChild(card);
  }

  // Handle adding a new toy
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newToy = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0,
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((toy) => {
        renderToy(toy);
        toyForm.reset();
      });
  });

  // Handle increasing likes
  function increaseLikes(toy, card) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        toy.likes = updatedToy.likes;
        card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      });
  }

  fetchToys();
});
