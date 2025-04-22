const container = document.getElementById("pokemon-container");
const detalle = document.getElementById("detalle-pokemon");
const form = document.getElementById("formulario");

function mostrarPokemon(data) {
  console.log("Mostrando Pokémon:", data); // Agregado para depurar

  const volverBtn = document.getElementById("volver");

  const card = document.createElement("div");
  card.classList.add("card");

  const img = document.createElement("img");
  img.src = data.sprites.front_default;
  img.alt = data.name;

  const name = document.createElement("h3");
  name.textContent = `#${data.id} ${data.name}`;

  const tipos = document.createElement("p");
  tipos.textContent = "Tipo: " + data.types.map(t => t.type.name).join(", ");

  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(tipos);

  card.addEventListener("click", () => mostrarDetalle(data));

  container.appendChild(card);
}

function mostrarDetalle(data) {
  console.log("Mostrando detalles del Pokémon:", data); // Agregado para depurar

  detalle.innerHTML = `
    <h2>${data.name} (#${data.id})</h2>
    <img src="${data.sprites.other['official-artwork'].front_default}" width="200">
    <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
    <p><strong>Altura:</strong> ${data.height / 10} m</p>
    <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
  `;
}

function cargarIniciales() {
  console.log("Iniciando carga de Pokémon...");

  fetch("https://pokeapi.co/api/v2/pokemon?limit=30")
    .then(res => {
      console.log("Respuesta de la API:", res); // Muestra la respuesta de la API
      if (!res.ok) throw new Error('Error al obtener datos de la API');
      return res.json();
    })
    .then(data => {
      console.log("Lista de Pokémon:", data); // Aquí mostramos los datos que lleguen
      data.results.forEach(poke => {
        console.log("Cargando Pokémon:", poke.name); // Muestra cada Pokémon que está procesando
        fetch(poke.url)
          .then(res => {
            if (!res.ok) throw new Error(`Error al obtener datos de ${poke.name}`);
            return res.json();
          })
          .then(data => {
            console.log("Datos del Pokémon:", data); // Datos de cada Pokémon
            mostrarPokemon(data);
          })
          .catch(error => console.error("Error al obtener Pokémon individual:", error));
      });
    })
    .catch(error => console.error("Error al obtener la lista de Pokémon:", error)); // Si hay un error al obtener la lista
}

function buscarPokemon(nombre) {
  container.innerHTML = "";
  detalle.innerHTML = "";

  fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
    .then(res => {
      if (!res.ok) throw new Error("No encontrado");
      return res.json();
    })
    .then(data => mostrarPokemon(data))
    .catch(err => {
      container.innerHTML = "<p>Pokémon no encontrado</p>";
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("search").value.toLowerCase().trim();
  if (nombre) buscarPokemon(nombre);
});

document.addEventListener("DOMContentLoaded", cargarIniciales);