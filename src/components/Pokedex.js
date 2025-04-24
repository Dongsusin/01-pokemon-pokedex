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
  //로딩 상태
  useEffect(() => {
    const fetchData = async () => {
      //포켓몬 데이터 가져오기
      const allPokemonData = []; //모든 포켓몬 데이터
      //모든 포켓몬 데이터
      for (
        let i = 1; //i <= totalPokemon; //1부터 1025까지
        i <= Math.min(currentPage * pokemonPerPage, totalPokemon); //현재 페이지 * 포켓몬 수, 총 포켓몬 수
        i++
      ) {
        const response = await axios.get(
          //포켓몬 데이터 가져오기
          `https://pokeapi.co/api/v2/pokemon/${i}` //포켓몬 API
        );
        const speciesResponse = await axios.get(
          //포켓몬 종족 데이터 가져오기
          `https://pokeapi.co/api/v2/pokemon-species/${i}` //포켓몬 종족 API
        );
        const koreanName = speciesResponse.data.names.find(
          //한국어 이름 찾기
          (name) => name.language.name === "ko" //한국어
        );
        allPokemonData.push({ ...response.data, korean_name: koreanName.name }); //포켓몬 데이터에 한국어 이름 추가
      }
      setPokemonData(allPokemonData); //포켓몬 데이터 설정
    };

    fetchData(); //포켓몬 데이터 가져오기
  }, [currentPage]); //현재 페이지가 바뀔 때마다 포켓몬 데이터 가져오기
  //포켓몬 데이터 가져오기
  const fetchMoreData = () => {
    setCurrentPage((prevPage) => prevPage + 1); //현재 페이지 + 1
  };

  return (
    //포켓몬 데이터 무한 스크롤
    <InfiniteScroll
      dataLength={pokemonData.length} //포켓몬 데이터 길이
      next={fetchMoreData} //다음 페이지 가져오기
      hasMore={currentPage * pokemonPerPage < totalPokemon} //다음 페이지가 있는지
      loader={<h4 className="loaded">Loading...</h4>} //로딩 중
    >
      <div className="header">
        <h1 className="title">포켓몬 도감</h1>
        <input
          type="text"
          className="search"
          placeholder="포켓몬 이름을 검색하세요.(개발중)"
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
                <p>{pokemon.korean_name}</p>
                <p>도감번호: {pokemon.id}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default Pokedex;
