import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./pokedex.css";

const Pokedex = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPokemonData, setFilteredPokemonData] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 상세 검색 토글 상태
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const pokemonPerPage = 30;
  const totalPokemon = 1025;
  const totalPages = Math.ceil(totalPokemon / pokemonPerPage);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const allPokemonData = [];
      for (
        let i = (currentPage - 1) * pokemonPerPage + 1;
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
        allPokemonData.push({
          ...response.data,
          korean_name: koreanName.name,
        });
      }
      setPokemonData(allPokemonData);
      setFilteredPokemonData(allPokemonData);
      setIsLoading(false);
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(searchTerm);

    const filtered = pokemonData.filter((pokemon) =>
      hasKorean
        ? pokemon.korean_name.toLowerCase().includes(searchTerm)
        : pokemon.name.toLowerCase().includes(searchTerm)
    );

    setSearchError(filtered.length === 0);
    setFilteredPokemonData(filtered);
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

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  };

  const displayedPokemon = showFavoritesOnly
    ? filteredPokemonData.filter((pokemon) => favorites.includes(pokemon.id))
    : filteredPokemonData;

  return (
    <>
      <div className="header">
        <h1 className="title">포켓몬 도감</h1>

        {/* ✅ 검색창 + 상세 검색 버튼 */}
        <div className="search-bar">
          <input
            type="text"
            className="search"
            placeholder="포켓몬 이름을 검색하세요(영문/한글)"
            onChange={handleSearch}
          />
          <button
            className="advanced-btn"
            onClick={() => setShowAdvancedFilter((prev) => !prev)}
          >
            {showAdvancedFilter ? "상세 검색" : "상세 검색"}
          </button>
        </div>

        {/* ✅ 조건부 렌더링된 필터 영역 */}
        {showAdvancedFilter && (
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
            <button
              className={`filter-btn ${showFavoritesOnly ? "active" : ""}`}
              onClick={() => setShowFavoritesOnly((prev) => !prev)}
            >
              {showFavoritesOnly ? "전체 보기" : "즐겨찾기만 보기 ❤️"}
            </button>
          </div>
        )}
      </div>

      <div className="container">
        {isLoading ? (
          <div className="loading-spinner">로딩 중...</div>
        ) : searchError ? (
          <h2 className="centered-message">해당하는 포켓몬이 없습니다.</h2>
        ) : (
          displayedPokemon.map((pokemon) => (
            <div
              key={pokemon.id}
              className="pokemon"
              style={{ animation: "fadeIn 0.5s ease-in" }}
            >
              <div
                className="favorite-icon"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(pokemon.id);
                }}
              >
                {favorites.includes(pokemon.id) ? "❤️" : "🤍"}
              </div>
              <Link to={`/pokemon/${pokemon.id}`}>
                <img
                  className="image"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.id}.gif`}
                  alt={pokemon.korean_name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = pokemon.sprites.front_default;
                  }}
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

      {/* 페이지네이션 */}
      <div className="pagination">
        <button
          className="pc"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          ⏮ 첫 페이지
        </button>

        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀ 이전
        </button>

        {Array.from({ length: 5 }, (_, index) => {
          const page = Math.floor((currentPage - 1) / 5) * 5 + index + 1;
          if (page > totalPages) return null;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          다음 ▶
        </button>

        <button
          className="pc"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          마지막 페이지 ⏭
        </button>
      </div>
    </>
  );
};

// 타입 색상
const getTypeColor = (type) => {
  switch (type) {
    case "fire":
      return "#F08030";
    case "water":
      return "#6890F0";
    case "grass":
      return "#78C850";
    case "electric":
      return "#F8D030";
    case "bug":
      return "#A8B820";
    case "normal":
      return "#A8A878";
    case "poison":
      return "#A040A0";
    case "fighting":
      return "#C03028";
    case "psychic":
      return "#F85888";
    case "ghost":
      return "#705898";
    case "dark":
      return "#705848";
    case "fairy":
      return "#EE99AC";
    case "dragon":
      return "#7038F8";
    case "rock":
      return "#B8A038";
    case "ice":
      return "#98D8D8";
    case "ground":
      return "#E0C068";
    case "steel":
      return "#B8B8D0";
    case "flying":
      return "#A890F0";
    default:
      return "#FFFFFF";
  }
};

// 타입 한글 이름
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
      return "페어리";
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
      return type;
  }
};

export default Pokedex;
