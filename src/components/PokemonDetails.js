import React from "react";
import "./PokemonDetails.css";
import { Link } from "react-router-dom";

const PokemonDetails = ({ pokemon }) => {
  //포켓몬 데이터가 없으면 로딩 중
  if (!pokemon) {
    return <p>Loading...</p>;
  }
  //포켓몬 데이터가 있으면 포켓몬 데이터 보여주기
  const renderTypes = () => {
    //포켓몬 타입을 보여주는 함수
    return pokemon.types.map((type, index) => (
      <span key={type.type.name} className="type">
        {type.type.korean_name}
      </span>
    ));
  };
  //포켓몬 특성을 보여주는 함수
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
  return isfirst ? (
    <div className="pokemon-details">
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
        <Link to={`/pokemon/${pokemon.id + 1}`}>
          <span className="next" />
        </Link>
      </p>
    </div>
  ) : islast ? (
    <div className="pokemon-details">
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
        <Link to={`/pokemon/${pokemon.id - 1}`}>
          <span className="prev" />
        </Link>
      </p>
    </div>
  ) : (
    <div className="pokemon-details">
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
        <Link to={`/pokemon/${pokemon.id - 1}`}>
          <span className="prev" />
        </Link>
        <Link to={`/pokemon/${pokemon.id + 1}`}>
          <span className="next" />
        </Link>
      </p>
    </div>
  );
};

export default PokemonDetails;
