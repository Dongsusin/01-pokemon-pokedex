import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./pokedex.css";

const TYPE_INFO = {
  fire: { color: "#F08030", ko: "불꽃" },
  water: { color: "#6890F0", ko: "물" },
  grass: { color: "#78C850", ko: "풀" },
  electric: { color: "#F8D030", ko: "전기" },
  bug: { color: "#A8B820", ko: "벌레" },
  normal: { color: "#A8A878", ko: "노말" },
  poison: { color: "#A040A0", ko: "독" },
  fighting: { color: "#C03028", ko: "격투" },
  psychic: { color: "#F85888", ko: "에스퍼" },
  ghost: { color: "#705898", ko: "고스트" },
  dark: { color: "#705848", ko: "어둠" },
  fairy: { color: "#EE99AC", ko: "페어리" },
  dragon: { color: "#7038F8", ko: "드래곤" },
  rock: { color: "#B8A038", ko: "바위" },
  ice: { color: "#98D8D8", ko: "얼음" },
  ground: { color: "#E0C068", ko: "땅" },
  steel: { color: "#B8B8D0", ko: "강철" },
  flying: { color: "#A890F0", ko: "비행" },
};

const getTypeColor = (type) => TYPE_INFO[type]?.color || "#FFFFFF";
const getKoreanTypeName = (type) => TYPE_INFO[type]?.ko || type;

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem("currentPage");
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [selectedType, setSelectedType] = useState("all");
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [searchError, setSearchError] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const pokemonPerPage = 30;
  const totalPokemon = 1025;
  const totalPages = Math.ceil(totalPokemon / pokemonPerPage);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    const fetchPokemons = async () => {
      setIsLoading(true);
      const start = (currentPage - 1) * pokemonPerPage + 1;
      const end = Math.min(currentPage * pokemonPerPage, totalPokemon);

      try {
        const fetches = [];
        for (let i = start; i <= end; i++) {
          fetches.push(
            axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`),
            axios.get(`https://pokeapi.co/api/v2/pokemon-species/${i}`)
          );
        }

        const results = await Promise.all(fetches);
        const mergedData = [];
        for (let i = 0; i < results.length; i += 2) {
          const pokemon = results[i].data;
          const species = results[i + 1].data;
          const koreanName =
            species.names.find((n) => n.language.name === "ko")?.name || "";
          mergedData.push({ ...pokemon, korean_name: koreanName });
        }

        setOriginalList(mergedData);
        setPokemonList(mergedData);
        setSearchError(false);
      } catch (error) {
        console.error("포켓몬 데이터를 불러오는 중 오류 발생:", error);
      }
      setIsLoading(false);
    };

    fetchPokemons();
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(query);

    const filtered = originalList.filter((p) =>
      hasKorean
        ? p.korean_name.toLowerCase().includes(query)
        : p.name.toLowerCase().includes(query)
    );

    setSearchError(filtered.length === 0);
    setPokemonList(filtered);
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
    setSearchError(false);

    if (type === "all") {
      setPokemonList(originalList);
    } else {
      const filtered = originalList.filter((p) =>
        p.types.some((t) => t.type.name === type)
      );
      setPokemonList(filtered);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const displayed = showFavoritesOnly
    ? pokemonList.filter((p) => favorites.includes(p.id))
    : pokemonList;

  return (
    <>
      <div className="header">
        <h1 className="title">포켓몬 도감</h1>
        <div className="search-bar">
          <input
            type="text"
            className="search"
            placeholder="포켓몬 이름 검색(영문/한글)"
            onChange={handleSearch}
          />
          <button
            className="advanced-btn"
            onClick={() => setShowAdvancedFilter((p) => !p)}
          >
            상세 검색
          </button>
        </div>

        {showAdvancedFilter && (
          <div className="filter">
            <button
              className={`filter-btn ${selectedType === "all" ? "active" : ""}`}
              onClick={() => handleTypeFilter("all")}
            >
              전체
            </button>
            {Object.keys(TYPE_INFO).map((type) => (
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
              onClick={() => setShowFavoritesOnly((p) => !p)}
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
          displayed.map((p) => (
            <div
              key={p.id}
              className="pokemon"
              style={{ animation: "fadeIn 0.5s" }}
            >
              <div
                className="favorite-icon"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(p.id);
                }}
              >
                {favorites.includes(p.id) ? "❤️" : "🤍"}
              </div>
              <Link to={`/pokemon/${p.id}`}>
                <img
                  className="image"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${p.id}.gif`}
                  alt={p.korean_name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = p.sprites.front_default;
                  }}
                />
                <div className="about">
                  <div className="name">
                    <p>{p.korean_name}</p>
                    <p>({p.name})</p>
                  </div>
                  <p>도감번호: {p.id}</p>
                  <div className="types">
                    {p.types.map((t) => (
                      <span
                        key={t.type.name}
                        className="type"
                        style={{ backgroundColor: getTypeColor(t.type.name) }}
                      >
                        {getKoreanTypeName(t.type.name)}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="pc"
        >
          ⏮ 첫 페이지
        </button>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀ 이전
        </button>

        {Array.from({ length: 5 }, (_, i) => {
          const page = Math.floor((currentPage - 1) / 5) * 5 + i + 1;
          return (
            page <= totalPages && (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          );
        })}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          다음 ▶
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="pc"
        >
          마지막 페이지 ⏭
        </button>
      </div>
    </>
  );
};

export default Pokedex;
