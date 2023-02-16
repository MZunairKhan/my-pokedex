import React, { useEffect, useState } from 'react';
import '../App.css'
import { useNavigate, useParams } from 'react-router-dom';
import PokeApiService from '../Services/PokeApi-service';
import StorageService from '../Services/Storage-service';

function Details() {
  const navigate = useNavigate();

  const { name } = useParams();

  const [loaded, setLoaded] = useState(false);
  const [details, setDetails] = useState({} as any);

  useEffect(() => {
    setLoaded(false);

    const data = StorageService.getData(name as string);
    if (data) {
      updateState(data);
    } else {
      getDetails();
    }
  }, []);

  const getDetails = () => {
    PokeApiService.getPokemonByName(name as string)
      .then(async (response: any) => {
        const parsedResponse = await response.json();
        updateState(parsedResponse);
        StorageService.addData(name as string, parsedResponse);
      })
      .catch(e => console.log(e))
  }

  const updateState = (data: any) => {
    setDetails(data);
    setLoaded(true);
  }

  const routeToList = () => {
    navigate(`/`);
  }

  return (
    <div className="pokemon-details">

      <div className="pokemon-details-header">
        <button onClick={routeToList}>Back</button>
        <h2>Pokemon Details</h2>
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
    </div>
  );
}

export default Details;
