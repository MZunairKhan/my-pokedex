import CONSTANTS from "../App.Constants";

const PokeApiService =  {

    getPokemon: (offset: number) => fetch(`${CONSTANTS.BASE_URL}?offset=${offset}&limit=${CONSTANTS.LIMIT}`),

    getPokemonByName: (name: string) => fetch(`${CONSTANTS.BASE_URL}/${name}`),

}

export default PokeApiService;
