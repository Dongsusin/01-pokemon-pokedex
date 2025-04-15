import React from "react";
import "./PokemonDetails.css";

const PokemonDetails = ({ pokemon }) => {
  if (!pokemon) {
    return <p>Loading...</p>;
  }

  const renderTypes = () => {
    return pokemon.types.map((type, index) => (
      <span key={type.type.name} className="type">
        {type.type.korean_name}
      </span>
    ));
  };

  const renderAbilities = () => {
    return pokemon.abilities.map((ability, index) => (
      <span key={ability.ability.name} className="ability">
        {ability.ability.korean_name}
      </span>
    ));
  };

  return (
    <div className="pokemon-details">
      <h2>
        {pokemon.korean_name} (#{pokemon.id})
      </h2>
      <div className="details-image">
        <div className="defualt">
          <img src={pokemon.sprites.front_default} alt={pokemon.korean_name} />
          <img src={pokemon.sprites.back_default} alt={pokemon.korean_name} />
        </div>
        <div className="shiny">
          <img src={pokemon.sprites.front_shiny} alt={pokemon.korean_name} />
          <img src={pokemon.sprites.back_shiny} alt={pokemon.korean_name} />
        </div>
      </div>
      <p>이름: {pokemon.korean_name}</p>
      <p>키: {pokemon.height}</p>
      <p>무게: {pokemon.weight}</p>
      <p>속성: {renderTypes()}</p>
      <p>특성: {renderAbilities()}</p>
    </div>
  );
};

export default PokemonDetails;
