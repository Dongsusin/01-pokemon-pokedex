import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PokemonDetails from "./PokemonDetails";

const PokemonDetailsPage = () => {
  const { id } = useParams(); // URL 파라미터로부터 포켓몬 ID 가져오기
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 포켓몬 기본 데이터 요청
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        // 2. 포켓몬 종족 데이터 요청 (한국어 이름 포함)
        const speciesResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );
        const koreanNameEntry = speciesResponse.data.names.find(
          (name) => name.language.name === "ko"
        );

        // 3. 타입별 한국어 이름 병합
        const typesWithKoreanNames = await Promise.all(
          response.data.types.map(async (type) => {
            const typeResponse = await axios.get(type.type.url);
            const koreanTypeName = typeResponse.data.names.find(
              (name) => name.language.name === "ko"
            )?.name;
            return {
              ...type,
              type: {
                ...type.type,
                korean_name: koreanTypeName,
              },
            };
          })
        );

        // 4. 특성별 한국어 이름 병합
        const abilitiesWithKoreanNames = await Promise.all(
          response.data.abilities.map(async (ability) => {
            const abilityResponse = await axios.get(ability.ability.url);
            const koreanAbilityName = abilityResponse.data.names.find(
              (name) => name.language.name === "ko"
            )?.name;
            return {
              ...ability,
              ability: {
                ...ability.ability,
                korean_name: koreanAbilityName,
              },
            };
          })
        );

        // 5. 전체 데이터를 통합해서 상태 업데이트
        setPokemonData({
          ...response.data,
          korean_name: koreanNameEntry?.name || response.data.name,
          types: typesWithKoreanNames,
          abilities: abilitiesWithKoreanNames,
        });
      } catch (error) {
        console.error("포켓몬 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, [id]);

  // 로딩 또는 오류 상태에 따라 조건부 렌더링 가능
  return <PokemonDetails pokemon={pokemonData} />;
};

export default PokemonDetailsPage;
