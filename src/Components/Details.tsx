import React, { useEffect, useState } from 'react';
import '../App.css'
import { useNavigate, useParams } from 'react-router-dom';
import PokeApiService from '../Services/PokeApi-service';
import StorageService from '../Services/Storage-service';
import PokemonListItem from '../Models/PokemonListItem';
import CONSTANTS from '../App.Constants';

function Details() {
  const navigate = useNavigate();

  const { name } = useParams();

  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [details, setDetails] = useState({} as any);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setLoaded(false);

    const data = StorageService.getData(name as string);
    if (data) {
      updateState(data);
    } else {
      getDetails();
    }

    const index = checkIsFavorite();
    setIsFavorite(index > -1);
  }, []);

  const getDetails = () => {
    const connectionTimerId = checkConnection();
    PokeApiService.getPokemonByName(name as string)
      .then(async (response: any) => {
        window.clearTimeout( connectionTimerId );
        const parsedResponse = await response.json();
        updateState(parsedResponse);
        StorageService.addData(name as string, parsedResponse);
      })
      .catch(e => console.log(e))
  }

  const updateState = (data: any) => {
    setDetails(data);
    setLoaded(true);
    setError('');
  }

  const routeToList = () => {
    navigate(`/`);
  }

  const checkConnection = () => {
    return window.setTimeout(() => {
      setError("Internet connection seems to be slow");
    }, 2000 );
  }

  const addToFavorite = () => {
    const favorites: PokemonListItem[] = StorageService.getData(CONSTANTS.STORAGE.FAVORITE_LIST) || [];
    const index = checkIsFavorite();

    if (index > -1) {
      favorites.splice(index as number, 1);
      setIsFavorite(false);
    } else {
      const data: PokemonListItem = { name: name as string, url: `${CONSTANTS.BASE_URL}/${name}/` };
      favorites.push(data);
      setIsFavorite(true);
    }

    StorageService.addData(CONSTANTS.STORAGE.FAVORITE_LIST, favorites);
  }

  const checkIsFavorite = () => {
    const favorites: PokemonListItem[] = StorageService.getData(CONSTANTS.STORAGE.FAVORITE_LIST) || [];
    const index = favorites.findIndex(favorite => favorite.name === name as string);
    return index;
  }

  return (
    <div className="pokemon-details">

      <div className="pokemon-details-header">
        <button onClick={routeToList}>Back</button>
        <h2>Pokemon Details</h2>
      </div>

      <div>
        <button onClick={addToFavorite}>{isFavorite ? 'Remove From Favorites' : 'Add To Favorites'}</button>
      </div>
      {
        loaded
        ?
        <div className="pokemon-details-data">
          <img src={details?.sprites?.front_default}/>
          <span>Name : {name}</span>
          <span>Weight : {details.weight} lb</span>
          <span>Types : | {details.types.map((typeData: any) => <span key={typeData.type.name}>{typeData.type.name} | </span>)}</span>

          <div className="stat-container">
            {
              details.stats.map((statData: any) => <div key={statData.stat.name} className="stat">
                  {statData.stat.name} : {statData.base_stat}
                </div>
              )
            }
          </div>
        </div>
        :
        <h2>Loading ...</h2>
      }

      {
        error
      }
    </div>
  );
}

export default Details;
