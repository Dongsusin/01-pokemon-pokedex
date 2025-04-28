import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PokemonDetails.css";

const PokemonDetails = ({ pokemon }) => {
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    setTransition(true);
    const timer = setTimeout(() => setTransition(false), 300);
    return () => clearTimeout(timer);
  }, [pokemon]);

  if (!pokemon) {
    return <div className="loading-spinner">로딩 중...</div>;
  }

  const renderTypes = () => {
    return pokemon.types.map((type, index) => (
      <span
        key={type.type.name}
        className={`type ${type.type.name}`}
        style={{ backgroundColor: getTypeBackgroundColor(type.type.name) }}
      >
        {type.type.korean_name}
      </span>
    ));
  };

  const getTypeBackgroundColor = (typeName) => {
    const typeColors = {
      fire: "#F08030",
      water: "#6890F0",
      grass: "#78C850",
      electric: "#F8D030",
      bug: "#A8B820",
      normal: "#A8A878",
      psychic: "#F85888",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      ice: "#98D8D8",
      fairy: "#EE99AC",
      dark: "#705848",
      steel: "#B8B8D0",
      flying: "#A890F0",
    };
    return typeColors[typeName] || "#e8e8e8";
  };

  const renderAbilities = () => {
    return pokemon.abilities.map((ability, index) => (
      <span key={ability.ability.name} className="ability">
        {ability.ability.korean_name}
      </span>
    ));
  };

  const statList = [
    {
      name: "hp",
      value: pokemon.stats[0].base_stat,
    },
    {
      name: "attack",
      value: pokemon.stats[1].base_stat,
    },
    {
      name: "defense",
      value: pokemon.stats[2].base_stat,
    },
    {
      name: "spAtk",
      value: pokemon.stats[3].base_stat,
    },
    {
      name: "spDef",
      value: pokemon.stats[4].base_stat,
    },
    {
      name: "speed",
      value: pokemon.stats[5].base_stat,
    },
  ];

  const isfirst = pokemon.id === 1;
  const islast = pokemon.id === 1025;

  return (
    <div className={`pokemon-details ${transition ? "fade-in" : ""}`}>
      <div className="details-title">
        <h2>
          {pokemon.korean_name} (#{pokemon.id})
        </h2>
        <Link to={`/`} className="home"></Link>
      </div>
      <div className="details">
        <div className="details-image">
          <div className="defualt">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.korean_name}
            />
            <img src={pokemon.sprites.back_default} alt={pokemon.korean_name} />
          </div>
          <div className="shiny">
            <img src={pokemon.sprites.front_shiny} alt={pokemon.korean_name} />
            <img src={pokemon.sprites.back_shiny} alt={pokemon.korean_name} />
          </div>
        </div>
        <div className="details-about">
          <p>
            이름: {pokemon.korean_name}({pokemon.name})
          </p>
          <p>키: {pokemon.height / 10 + "m"}</p>
          <p>무게: {pokemon.weight / 10 + "kg"}</p>
          <p>속성: {renderTypes()}</p>
          <p>특성: {renderAbilities()}</p>
        </div>
        <div className="details-stats">
          <h3>스탯</h3>
          <div className="stats-list-data">
            {statList.map((stat, index) => (
              <div key={index} className="stats-list">
                <p>{stat.name}</p>
                <p>{stat.value}</p>
                <div className="stats-bar">
                  <div
                    className="stats-bar-fill"
                    style={{ width: `${stat.value / 2}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="button">
        {isfirst ? (
          <Link to={`/pokemon/${pokemon.id + 1}`}>
            <span className="next" />
          </Link>
        ) : islast ? (
          <Link to={`/pokemon/${pokemon.id - 1}`}>
            <span className="prev" />
          </Link>
        ) : (
          <>
            <Link to={`/pokemon/${pokemon.id - 1}`}>
              <span className="prev" />
            </Link>
            <Link to={`/pokemon/${pokemon.id + 1}`}>
              <span className="next" />
            </Link>
          </>
        )}
      </p>
    </div>
  );
};

export default PokemonDetails;
