import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PokemonDetails from "./PokemonDetails";

const PokemonDetailsPage = () => {
  const { id } = useParams();
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${id}`
      );
      const speciesResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
      );
      const koreanName = speciesResponse.data.names.find(
        (name) => name.language.name === "ko"
      );

      const typesWithKoreanNames = await Promise.all(
        response.data.types.map(async (type) => {
          const typeResponse = await axios.get(type.type.url);
          const koreanTypeName = typeResponse.data.names.find(
            (name) => name.language.name === "ko"
          ).name;
          return {
            ...type,
            type: { ...type.type, korean_name: koreanTypeName },
          };
        })
      );

      const abilitiesWithKoreanNames = await Promise.all(
        response.data.abilities.map(async (ability) => {
          const abilityResponse = await axios.get(ability.ability.url);
          const koreanAbilityName = abilityResponse.data.names.find(
            (name) => name.language.name === "ko"
          ).name;
          return {
            ...ability,
            ability: { ...ability.ability, korean_name: koreanAbilityName },
          };
        })
      );

      setPokemonData({
        ...response.data,
        korean_name: koreanName.name,
        types: typesWithKoreanNames,
        abilities: abilitiesWithKoreanNames,
      });
    };

    fetchData();
  }, [id]);

  return <PokemonDetails pokemon={pokemonData} />;
};

export default PokemonDetailsPage;
