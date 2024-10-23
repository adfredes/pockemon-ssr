const TOTAL_POKEMONS = 150;
const TOTAL_PAGES = 20;

(async () => {

  const fs = require('fs');

  // Por id de pokemon
  const pokemonIds = Array.from({length: TOTAL_POKEMONS}, (_, i) => i + 1);

  let fileContent = pokemonIds.map(
    id => `/pokemons/${id}`
  ).join('\n');


  // Paginas de pokemones
  const pageNumbers = Array.from({length: TOTAL_PAGES}, (_, i) => i + 1);

  fileContent += '\n';
  fileContent += pageNumbers.map(
    pageNumber => `/pokemons/page/${pageNumber}`
  ).join('\n');

  // Por nombres de Pokémons
  const pokemonNameList = await fetch( `https://pokeapi.co/api/v2/pokemon?limit=${ TOTAL_POKEMONS }` )
    .then( res => res.json() );

  fileContent += '\n';
  fileContent += pokemonNameList.results.map(
    pokemon => `/pokemons/${ pokemon.name }`
  ).join( '\n' );



  fs.writeFileSync('routes.txt', fileContent);

})();
