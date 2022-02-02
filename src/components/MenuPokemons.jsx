/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-template */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal/lib/components/Modal';
import { useDispatch } from 'react-redux';
import { addPokemonCartAction } from '../redux/actions';
import * as S from '../styles/MenuPokemonsCSS';
import pricesList from '../data/prices';
import { fetchPokemons } from '../service/pokemonsAPI';
import ModalPokemon from './ModalPokemon';

export default function MenuPokemon() {
  const dispatch = useDispatch();
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [detailsPokemon, setDetailsPokemon] = useState({});

  async function loadingPokemons(URL) {
    console.log(URL);
    if (URL !== null) {
      try {
        const list = await fetchPokemons(URL);
        console.log(list.previous, list.next);
        setPage([list.previous, list.next]);
        return list.results;
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function detailsPokemons(URL) {
    const pokemonsResult = await loadingPokemons(URL);
    const listPokemons = [];
    for (const poke of pokemonsResult) {
      const pokemonsDetails = await fetch('https://pokeapi.co/api/v2/pokemon/' + poke.name)
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => error);
      listPokemons.push({
        namePokemon: poke.name,
        typePokemon: pokemonsDetails.types[0].type.name,
      });
    }
    console.log(listPokemons);
    console.log(listPokemons[0].typePokemon);
    setPokemons(listPokemons);
  }

  function addPokemonToCart(img, name, price) {
    const pokemonBought = {
      img,
      name,
      price,
      count: 1,
    };

    console.log(pokemonBought);

    dispatch(addPokemonCartAction(pokemonBought));
  }

  function showPokemonDetails(name, type, price) {
    const pokemonDetails = {
      name,
      type,
      price,
    };
    console.log(pokemonDetails);
    setDetailsPokemon(pokemonDetails);

    // dispatch(showPokemonDetailsAction(pokemonDetails));
  }

  useEffect(() => {
    const URL = 'https://pokeapi.co/api/v2/pokemon';
    detailsPokemons(URL);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <S.ContainerPokemon>
      <ModalPokemon modalOpen={ modalOpen } funcModalOpen={ setModalOpen } details= { detailsPokemon } />
      <div className="flex items-center justify-between w-full mb-6 -mt-10">
        <S.Button
          color="#717171"
          font="18px"
          onClick={ () => detailsPokemons(page[0]) }
          type="button"
        >
          <S.Icon1 />
          <p>PREVIUS</p>
        </S.Button>
        <S.Title>POKEMONS</S.Title>
        <S.Button
          color="#717171"
          font="18px"
          onClick={ () => detailsPokemons(page[1]) }
          type="button"
        >
          <p>NEXT</p>
          <S.Icon2 />
        </S.Button>
      </div>
      <ul>
        { pokemons.map((item, index) => (
          <S.CardPokemon key={ index }>
            <S.Picture src={ `https://img.pokemondb.net/artwork/large/${item.namePokemon}.jpg` } />
            <S.Name>{ item.namePokemon }</S.Name>
            <S.Type>{`Pokemon Type ${item.typePokemon}`}</S.Type>
            <S.Detail
              onClick={ () => {
                showPokemonDetails(item.namePokemon, item.typePokemon, pricesList[index]);
                setModalOpen(true);
              }
              }
            >
              + detalhes
            </S.Detail>
            <S.Price>{ `R$ ${pricesList[index]}` }</S.Price>
            <S.Button
              bgcolor="#717171"
              onClick={ () => addPokemonToCart(
                `https://img.pokemondb.net/artwork/large/${item.name}.jpg`,
                item.namePokemon,
                pricesList[index],
              ) }
            >
              Adicionar ao carrinho
            </S.Button>
          </S.CardPokemon>
        ))}
      </ul>
    </S.ContainerPokemon>
  );
}
