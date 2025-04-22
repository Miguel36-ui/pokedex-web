document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("pokemon-container");
  
    fetch("https://pokeapi.co/api/v2/pokemon?limit=10")
      .then(response => response.json())
      .then(data => {
        data.results.forEach(pokemon => {
          const div = document.createElement("div");
          div.textContent = pokemon.name;
          container.appendChild(div);
        });
      })
      .catch(error => {
        console.error("Error al cargar los Pokémon:", error);
      });
  });