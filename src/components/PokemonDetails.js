import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PokemonDetails.css";

const PokemonDetails = ({ pokemon }) => {
  const [transition, setTransition] = useState(false);

  // 포켓몬 변경 시 페이드 인 애니메이션 처리
  useEffect(() => {
    setTransition(true);
    const timer = setTimeout(() => setTransition(false), 300);
    return () => clearTimeout(timer);
  }, [pokemon]);

  if (!pokemon) {
    return <div className="loading-spinner">로딩 중...</div>;
  }

  // 타입 색상 매핑
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

  // 타입 렌더링
  const renderTypes = () =>
    pokemon.types.map((type) => (
      <span
        key={type.type.name}
        className={`type ${type.type.name}`}
        style={{ backgroundColor: getTypeBackgroundColor(type.type.name) }}
      >
        {type.type.korean_name}
      </span>
    ));

  // 특성 렌더링
  const renderAbilities = () =>
    pokemon.abilities.map((ability) => (
      <span key={ability.ability.name} className="ability">
        {ability.ability.korean_name}
      </span>
    ));

  // 스탯 목록 정의
  const statList = [
    { name: "hp", value: pokemon.stats[0].base_stat },
    { name: "attack", value: pokemon.stats[1].base_stat },
    { name: "defense", value: pokemon.stats[2].base_stat },
    { name: "spAtk", value: pokemon.stats[3].base_stat },
    { name: "spDef", value: pokemon.stats[4].base_stat },
    { name: "speed", value: pokemon.stats[5].base_stat },
  ];

  // 이전/다음 포켓몬 여부
  const isFirst = pokemon.id === 1;
  const isLast = pokemon.id === 1025;

  return (
    <div className={`pokemon-details ${transition ? "fade-in" : ""}`}>
      {/* 제목과 홈 링크 */}
      <div className="details-title">
        <h2>
          {pokemon.korean_name} (#{pokemon.id})
        </h2>
        <Link to={`/`} className="home"></Link>
      </div>

      {/* 포켓몬 상세 정보 */}
      <div className="details">
        {/* 이미지 */}
        <div className="details-image">
          <div className="default">
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

        {/* 기본 정보 */}
        <div className="details-about">
          <p>
            이름: {pokemon.korean_name} ({pokemon.name})
          </p>
          <p>키: {pokemon.height / 10}m</p>
          <p>무게: {pokemon.weight / 10}kg</p>
          <p>속성: {renderTypes()}</p>
          <p>특성: {renderAbilities()}</p>
        </div>

        {/* 스탯 정보 */}
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

      {/* 이전/다음 포켓몬 이동 버튼 */}
      <p className="button">
        {isFirst ? (
          <Link to={`/pokemon/${pokemon.id + 1}`}>
            <span className="next" />
          </Link>
        ) : isLast ? (
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
