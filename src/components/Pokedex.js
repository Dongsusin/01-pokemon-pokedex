import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import "./pokedex.css";

const Pokedex = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPokemonData, setFilteredPokemonData] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [selectedType, setSelectedType] = useState("all"); // 속성 필터링
  const pokemonPerPage = 30;
  const totalPokemon = 1025;

  useEffect(() => {
    const fetchData = async () => {
      const allPokemonData = [];
      for (
        let i = 1;
        i <= Math.min(currentPage * pokemonPerPage, totalPokemon);
        i++
      ) {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${i}`
        );
        const speciesResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${i}`
        );
        const koreanName = speciesResponse.data.names.find(
          (name) => name.language.name === "ko"
        );
        allPokemonData.push({ ...response.data, korean_name: koreanName.name });
      }
      setPokemonData(allPokemonData);
      setFilteredPokemonData(allPokemonData);
    };

    fetchData();
  }, [currentPage]);

  const fetchMoreData = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(searchTerm);

    if (hasKorean) {
      const filteredPokemon = pokemonData.filter((pokemon) =>
        pokemon.korean_name.toLowerCase().includes(searchTerm)
      );

      if (filteredPokemon.length === 0) {
        setSearchError(true);
      } else {
        setSearchError(false);
      }

      setFilteredPokemonData(filteredPokemon);
    } else {
      const filteredPokemon = pokemonData.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm)
      );

      if (filteredPokemon.length === 0) {
        setSearchError(true);
      } else {
        setSearchError(false);
      }

      setFilteredPokemonData(filteredPokemon);
    }
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
    if (type === "all") {
      setFilteredPokemonData(pokemonData);
    } else {
      const filteredByType = pokemonData.filter((pokemon) =>
        pokemon.types.some((t) => t.type.name === type)
      );
      setFilteredPokemonData(filteredByType);
    }
  };

  if (pokemonData.length === 0) {
    return <div className="loading-spinner">로딩 중...</div>;
  }

  return (
    <>
      <InfiniteScroll
        dataLength={filteredPokemonData.length}
        next={fetchMoreData}
        hasMore={currentPage * pokemonPerPage < totalPokemon}
        loader={<h4 className="loaded">로딩 중...</h4>}
      >
        <div className="header">
          <h1 className="title">포켓몬 도감</h1>
          <input
            type="text"
            className="search"
            placeholder="포켓몬 이름을 검색하세요(영문/한글)"
            onChange={handleSearch}
          />
          <div className="filter">
            <button
              className={`filter-btn ${selectedType === "all" ? "active" : ""}`}
              onClick={() => handleTypeFilter("all")}
            >
              전체
            </button>
            {[
              "fire",
              "water",
              "grass",
              "electric",
              "bug",
              "normal",
              "poison",
              "fighting",
              "psychic",
              "ghost",
              "dark",
              "fairy",
              "dragon",
              "rock",
              "ice",
              "ground",
              "steel",
              "flying",
            ].map((type) => (
              <button
                key={type}
                className={`filter-btn ${
                  selectedType === type ? "active" : ""
                }`}
                onClick={() => handleTypeFilter(type)}
              >
                {getKoreanTypeName(type)}
              </button>
            ))}
          </div>
        </div>
        <div className="container">
          {searchError ? (
            <h2 className="centered-message">해당하는 포켓몬이 없습니다.</h2>
          ) : (
            filteredPokemonData.map((pokemon) => (
              <div
                key={pokemon.id}
                className="pokemon"
                style={{ animation: "fadeIn 0.5s ease-in" }}
              >
                <Link to={`/pokemon/${pokemon.id}`}>
                  <img
                    className="image"
                    src={pokemon.sprites.front_default}
                    alt={pokemon.korean_name}
                  />
                  <div className="about">
                    <div className="name">
                      <p>{pokemon.korean_name}</p>
                      <p>({pokemon.name})</p>
                    </div>
                    <p>도감번호:{pokemon.id}</p>
                    <div className="types">
                      {pokemon.types.map((typeInfo) => (
                        <span
                          key={typeInfo.type.name}
                          className="type"
                          style={{
                            backgroundColor: getTypeColor(typeInfo.type.name),
                          }}
                        >
                          {getKoreanTypeName(typeInfo.type.name)}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </InfiniteScroll>
    </>
  );
};

const getTypeColor = (type) => {
  switch (type) {
    case "fire":
      return "#F08030"; // 불꽃
    case "water":
      return "#6890F0"; // 물
    case "grass":
      return "#78C850"; // 풀
    case "electric":
      return "#F8D030"; // 전기
    case "bug":
      return "#A8B820"; // 벌레
    case "normal":
      return "#A8A878"; // 노말
    case "poison":
      return "#A040A0"; // 독
    case "fighting":
      return "#C03028"; // 격투
    case "psychic":
      return "#F85888"; // 에스퍼
    case "ghost":
      return "#705898"; // 고스트
    case "dark":
      return "#705848"; // 어둠
    case "fairy":
      return "#EE99AC"; // 요정
    case "dragon":
      return "#7038F8"; // 드래곤
    case "rock":
      return "#B8A038"; // 바위
    case "ice":
      return "#98D8D8"; // 얼음
    case "ground":
      return "#E0C068"; // 땅
    case "steel":
      return "#B8B8D0"; // 강철
    case "flying":
      return "#A890F0"; // 비행
    default:
      return "#FFFFFF"; // 기본 흰색
  }
};

const getKoreanTypeName = (type) => {
  switch (type) {
    case "fire":
      return "불꽃";
    case "water":
      return "물";
    case "grass":
      return "풀";
    case "electric":
      return "전기";
    case "bug":
      return "벌레";
    case "normal":
      return "노말";
    case "poison":
      return "독";
    case "fighting":
      return "격투";
    case "psychic":
      return "에스퍼";
    case "ghost":
      return "고스트";
    case "dark":
      return "어둠";
    case "fairy":
      return "요정";
    case "dragon":
      return "드래곤";
    case "rock":
      return "바위";
    case "ice":
      return "얼음";
    case "ground":
      return "땅";
    case "steel":
      return "강철";
    case "flying":
      return "비행";
    default:
      return type; // 기본값은 영어로 반환
  }
};

export default Pokedex;
