let todosLosPokemones = [];
let pokemonesFiltrados = [];
let paginaActual = 1;
const porPagina = 50;
let tarjetaAbierta = null;

// Elementos del DOM
const container = document.getElementById("pokemon-container");
const inputNombre = document.getElementById("busqueda-nombre");
const tipoSelect = document.getElementById("busqueda-tipo");
const pesoMin = document.getElementById("peso-min");
const pesoMax = document.getElementById("peso-max");
const alturaMin = document.getElementById("altura-min");
const alturaMax = document.getElementById("altura-max");
const btnFiltrar = document.getElementById("filtrar");

const music = document.getElementById('music');
const icon = document.getElementById('soundIcon');

function toggleMusic() {
  if (music.paused) {
    music.play();
    icon.textContent = "🔊";  // Icono de sonido activado
  } else {
    music.pause();
    icon.textContent = "🔇";  // Icono de sonido desactivado
  }
}

// --- Navegación ---
document.getElementById("siguiente").addEventListener("click", () => {
  if (paginaActual * porPagina < pokemonesFiltrados.length) {
    paginaActual++;
    mostrarPagina();
  }
});

document.getElementById("anterior").addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    mostrarPagina();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
    .then(res => res.json())
    .then(data => {
      const promesas = data.results.map(p => fetch(p.url).then(r => r.json()));
      Promise.all(promesas).then(pokemones => {
        todosLosPokemones = pokemones;
        pokemonesFiltrados = pokemones; // 👈 esto es importante
        mostrarPagina();
      });
    });
});

function mostrarPagina() {
  container.innerHTML = "";
  const inicio = (paginaActual - 1) * porPagina;
  const pagina = pokemonesFiltrados.slice(inicio, inicio + porPagina);
  pagina.forEach(mostrarTarjeta);
  document.getElementById("pagina-actual").textContent = paginaActual;
}

function mostrarTarjeta(pokemon) {
  const card = document.createElement("div");
  const tipo = pokemon.types[0].type.name;
  card.className = `card tipo-${tipo}`;

  card.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h3>${pokemon.id}. ${pokemon.name}</h3>
    <p>Tipo: ${traducirTipo(tipo)}</p>
    <p>Habilidades: ${pokemon.abilities.map(h => traducirHabilidad(h.ability.name)).join(", ")}</p>
  `;

  const detalle = document.createElement("div");
  detalle.className = "card detalle";
  detalle.style.display = "none";

  card.addEventListener("click", () => {
    if (tarjetaAbierta && tarjetaAbierta !== detalle) {
      tarjetaAbierta.style.display = "none";
    }
    detalle.style.display = (detalle.style.display === "none") ? "block" : "none";
    tarjetaAbierta = detalle.style.display === "block" ? detalle : null;
    cargarDetalle(pokemon.name, detalle);
  });

  card.appendChild(detalle);
  container.appendChild(card);
}

function cargarDetalle(nombre, contenedor) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
    .then(res => res.json())
    .then(data => {
      contenedor.innerHTML = `
        <p><strong>Altura:</strong> ${data.height / 10} m</p>
        <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
      `;
    });
}

function traducirTipo(tipo) {
  const traduccionesTipos = {
    fire: "Fuego", water: "Agua", grass: "Planta", electric: "Eléctrico",
    psychic: "Psíquico", normal: "Normal", fighting: "Lucha", flying: "Volador",
    poison: "Veneno", ground: "Tierra", rock: "Roca", bug: "Bicho",
    ghost: "Fantasma", steel: "Acero", ice: "Hielo", dragon: "Dragón",
    dark: "Siniestro", fairy: "Hada"
  };
  return traduccionesTipos[tipo] || tipo;
}

function traducirHabilidad(habilidad) {
  const traduccionesHabilidades = {
    "overgrow": "Sobrecrecimiento", "blaze": "Llama", "torrent": "Torrente",
    "shield-dust": "Polvo Escudo", "run-away": "Huir", "keen-eye": "Ojo Clavo",
    "chlorophyll": "Clorofila", "pickup": "Recogida", "intimidate": "Intimidación",
    "adaptability": "Adaptabilidad", "hydration": "Hidratación", "insomnia": "Insomnio",
    "synchronize": "Sincronizar", "rain-dish": "Lluvia", "ice-body": "Cuerpo de Hielo",
    "suction-cups": "Ventosas", "serene-grace": "Gracia Serena"
  };
  return traduccionesHabilidades[habilidad] || habilidad;
}

// --- Filtro por características ---
btnFiltrar.addEventListener("click", () => {
  const tipo = tipoSelect.value;
  const pesoMinimo = parseFloat(pesoMin.value);
  const pesoMaximo = parseFloat(pesoMax.value);
  const alturaMinima = parseFloat(alturaMin.value);
  const alturaMaxima = parseFloat(alturaMax.value);

  const filtrados = todosLosPokemones.filter(p => {
    const peso = p.weight / 10;
    const altura = p.height / 10;
    const coincideTipo = tipo === "all" || tipo === "" || p.types[0].type.name === tipo;
    const dentroPeso = (!pesoMinimo || peso >= pesoMinimo) && (!pesoMaximo || peso <= pesoMaximo);
    const dentroAltura = (!alturaMinima || altura >= alturaMinima) && (!alturaMaxima || altura <= alturaMaxima);
    return coincideTipo && dentroPeso && dentroAltura;
  });

  pokemonesFiltrados = filtrados;
  paginaActual = 1;
  mostrarPagina();
});

// --- Filtro por nombre ---
inputNombre.addEventListener("input", () => {
  const nombre = inputNombre.value.toLowerCase().trim();
  if (nombre) {
    container.innerHTML = "";
    fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
      .then(res => res.json())
      .then(data => mostrarTarjeta(data))
      .catch(() => {
        container.innerHTML = "<p>Pokémon no encontrado</p>";
      });
  } else {
    pokemonesFiltrados = todosLosPokemones;
    mostrarPagina();
  }
});

// --- Filtro por tipo ---
tipoSelect.addEventListener("change", () => {
  const tipo = tipoSelect.value;
  if (tipo === "" || tipo === "all") {
    pokemonesFiltrados = todosLosPokemones;
  } else {
    pokemonesFiltrados = todosLosPokemones.filter(p => p.types[0].type.name === tipo);
  }
  paginaActual = 1;
  mostrarPagina();
});



