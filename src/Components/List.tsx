import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import PokemonListItem from '../Models/PokemonListItem';
import PokeApiService from '../Services/PokeApi-service';
import StorageService from '../Services/Storage-service';
import CONSTANTS from '../App.Constants';

function List() {
  const navigate = useNavigate();

  const [PokemonArray, setPokemonArray] = useState([]);

  useEffect(() => {
    const pokemonList = StorageService.getData(CONSTANTS.STORAGE.NORMAL_LIST) || [];
    if (pokemonList.length === 0) {
      getPokemon();
    } else {
      setPokemonArray(pokemonList);
    }
  }, []);

  const getPokemon = () => {
    const offset = StorageService.getData(CONSTANTS.STORAGE.OFFSET);
    PokeApiService.getPokemon(offset)
    .then(async (response: any) => {
      const parsedResponse = await response.json();
      updateData(parsedResponse.results);
    })
    .catch(e => console.log(e))
  }

  const updateData = (data: PokemonListItem[]) => {
    StorageService.addListData(data);
    const pokemonList = StorageService.getData(CONSTANTS.STORAGE.NORMAL_LIST);
    setPokemonArray(pokemonList);
  }

  const routeToPokemon = (name: string) => {
    navigate(`/Details/${name}`);
  }

  const handleScroll = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) { getPokemon() }
  }

  return (
    <div>
      <h2>Pokemon List</h2>
      <div className="pokemon-list" onScroll={handleScroll}>
        {
          PokemonArray?.map((result: PokemonListItem) =>
          <li key={result.name} onClick={() => routeToPokemon(result.name)}>{result.name}</li>
          )
        }
      </div>
    </div>
  );
}

export default List;
