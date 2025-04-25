import React, { useState, useEffect } from "react";
import axios from "axios";
import "./pokedex.css";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const Pokedex = () => {
  const [pokemonData, setPokemonData] = useState([]); //포켓몬 데이터
  const [currentPage, setCurrentPage] = useState(1); //포켓몬 페이지
  const pokemonPerPage = 30; //한 페이지에 보여줄 포켓몬 수
  const totalPokemon = 1025; //총 포켓몬 수

  useEffect(() => {
    const fetchData = async () => {
      const allPokemonData = []; //모든 포켓몬 데이터
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
      setPokemonData(allPokemonData); //포켓몬 데이터 설정
    };

    fetchData(); //포켓몬 데이터 가져오기
  }, [currentPage]);

  const fetchMoreData = () => {
    setCurrentPage((prevPage) => prevPage + 1); //현재 페이지 + 1
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPokemon = pokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );
    setPokemonData(filteredPokemon);
    if (searchTerm === "") {
      setCurrentPage(1);
      fetchMoreData();
    }
  };

  if (pokemonData.length === 0) {
    return <h1 className="all-loaded">Loading...</h1>;
  }

  return (
    <>
      {/* 포켓몬 도감 화면 */}
      <InfiniteScroll
        dataLength={pokemonData.length}
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
          {pokemonData.map((pokemon) => (
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
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default Pokedex;
