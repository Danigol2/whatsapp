import { useState, useEffect, useRef } from "react";
const pokemons = [
  { id: 1, nombre: "Pikachu", tipo: "Eléctrico", fuerza: 55 },
  { id: 2, nombre: "Charizard", tipo: "Fuego", fuerza: 84 },
  { id: 3, nombre: "Bulbasaur", tipo: "Planta", fuerza: 49 },
  { id: 4, nombre: "Squirtle", tipo: "Agua", fuerza: 44 },
  { id: 5, nombre: "Jigglypuff", tipo: "Normal", fuerza: 45 },
  { id: 6, nombre: "Gengar", tipo: "Fantasma", fuerza: 65 },
  { id: 7, nombre: "Eevee", tipo: "Normal", fuerza: 55 },
  { id: 8, nombre: "Machamp", tipo: "Lucha", fuerza: 130 },
  { id: 9, nombre: "Alakazam", tipo: "Psíquico", fuerza: 50 },
  { id: 10, nombre: "Onix", tipo: "Roca", fuerza: 45 },
];

function Formulario() {
  // en arrPokemons tenemos el array filtrado
  const [arrPokemons, setArrPokemons] = useState([]);
  // en todosPokemons tenemos el array original
  const todosPokemons = useRef([]);
  // estado para guardar datos input, no es necesario
  const [filtro, setFiltro] = useState("");
  useEffect(() => {
    const newArray = [...pokemons];
    todosPokemons.current = [...newArray];
    // la linea de arriba soluciona que useState es asincrono
    setArrPokemons(newArray);
  }, []);
  function handleClick(e) {
    // si un formulario solo tiene un boton este es de tipo submit aunque no lo ponga
    // no olvidar el preventDefault
    e.preventDefault();
    const input = document.getElementById("id-nombre").value;
    const newArray = todosPokemons.current.filter((pok) => {
      return pok.nombre.toLowerCase().includes(input.toLowerCase());
    });
    setArrPokemons(newArray);
  }
  function handleChange(e) {
    const input = e.target.value;
    console.log(input);
    setFiltro(input);
    // quitar comentarios de abajo para ver que filtra mientras escribes
    /*
    const newArray = todosPokemons.current.filter((pok) => {
      return pok.nombre.toLowerCase().includes(input.toLowerCase());
    });
    setArrPokemons(newArray);
    */
  }

  return (
    <>
      <h1>Pokemons</h1>
      <form id="mi-formulario">
        <input
          id="id-nombre"
          type="text"
          placeholder="Nombre"
          onChange={handleChange}
        ></input>
        <button onClick={handleClick}>Buscar</button>
      </form>
      <ol>
        {arrPokemons.map((pok) => (
          <li key={pok.id}>{pok.nombre + " " + pok.tipo + " " + pok.fuerza}</li>
        ))}
      </ol>
    </>
  );
}
export default Formulario;
