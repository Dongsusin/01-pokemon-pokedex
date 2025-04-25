import React, { useState, useEffect } from "react";
import axios from "axios";
import "./pokedex.css";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const Pokedex = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPokemonData, setFilteredPokemonData] = useState([]);
  const [searchError, setSearchError] = useState(false);
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
      alert("포켓몬 이름을 영어로 검색하세요.");
      return;
    }
    const filteredPokemon = pokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );

    if (filteredPokemon.length === 0) {
      setSearchError(true);
    } else {
      setSearchError(false);
    }

    setFilteredPokemonData(filteredPokemon);
  };

  if (pokemonData.length === 0) {
    return <h1 className="all-loaded">Loading...</h1>;
  }

  return (
    <>
      <InfiniteScroll
        dataLength={filteredPokemonData.length}
        next={fetchMoreData}
        hasMore={currentPage * pokemonPerPage < totalPokemon}
        loader={<h4 className="loaded">Loading...</h4>}
      >
        <div className="header">
          <h1 className="title">포켓몬 도감</h1>
          <input
            type="text"
            className="search"
            placeholder="포켓몬 이름을 검색하세요(영문).(한글개발중)"
            onChange={handleSearch}
          />
        </div>
        <div className="container">
          {searchError ? (
            <h2 className="centered-message">해당하는 포켓몬이 없습니다.</h2>
          ) : (
            filteredPokemonData.map((pokemon) => (
              <div key={pokemon.id} className="pokemon">
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

export default Pokedex;
