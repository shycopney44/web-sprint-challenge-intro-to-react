import React,{ useState, useEffect } from 'react'
import axios from 'axios'
import Character from './Character'

const urlPlanets = 'http://localhost:9009/api/planets'
const urlPeople = 'http://localhost:9009/api/people'

function App() {
  // ❗ Create state to hold the data from the API
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // ❗ Create effects to fetch the data and put it in state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [peopleResponse, planetsResponse] = await Promise.all([
          axios.get(urlPeople),
          axios.get(urlPlanets),
        ]);
        const characters = peopleResponse.data;
        const planets = planetsResponse.data;

        const mergedData = characters.map(character => {
          const homeworld = planets.find(planet => planet.id === character.homeworld);
          return {
            ...character,
            homeworld: homeworld ? { id: homeworld.id, name: homeworld.name } : null
          };
        });

        setCharacters(mergedData);
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message || 'Error fetching data'}</p>;
 
  return (
    <div className="app">
      <h2>Star Wars Characters</h2>
      <p>See the README of the project for instructions on completing this challenge</p>
      {/* ❗ Map over the data in state, rendering a Character at each iteration */}
      {characters.map(character => (
        <Character
        key={character.id}
        name={character.name}
        homeworld={character.homeworld ? character.homeworld.name : 'Unknown'}
        />
      ))}
    </div>
  )
}

export default App

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = App
