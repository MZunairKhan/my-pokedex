import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import PokemonListItem from '../Models/PokemonListItem';
import PokeApiService from '../Services/PokeApi-service';
import StorageService from '../Services/Storage-service';
import CONSTANTS from '../App.Constants';

function List() {
  const navigate = useNavigate();

  const [listType, setListType] = useState('Normal');
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

  const switchList = () => {
    setListType(listType === 'Normal' ? 'Favorite' : 'Normal');
    const list = StorageService.getData(listType === 'Normal' ? CONSTANTS.STORAGE.FAVORITE_LIST : CONSTANTS.STORAGE.NORMAL_LIST);
    setPokemonArray(list);
  }

  return (
    <div>
      <h2>Pokemon List</h2>
      <button onClick={switchList}>View {listType === 'Normal' ? 'Favorite' : 'Full'} List</button>
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
