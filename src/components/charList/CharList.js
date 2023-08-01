import React, { useState, useEffect, useRef } from 'react';

import useMarvelService from '../../services/MarvelService';
import './charList.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMes';

const CharList = (props) => {

    const [chars, setChars] = useState([]);
    const [offset, setOffset] = useState(1);
    const [newLoaded, setNewLoaded] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const itemRefs = useRef([]);

    const { loaded, error, getAllCharacters } = useMarvelService();

    useEffect(() => {
        onRequest(true);
    }, [])

    const onRequest = (initial) => {
        initial ? setNewLoaded(false) : setNewLoaded(true);
        getAllCharacters(offset)
            .then(onCharsLoaded)
    }

    const onCharsLoaded = (charList) => {
        let ended = false;
        if (charList.length < 9) {
            ended = true
        }

        setChars(chars => [...chars, ...charList]);
        setOffset(offset => offset + 9);
        setNewLoaded(false);
        setCharEnded(ended);
    }

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const renderChars = (arr) => {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit': 'cover'};

            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'unset'}
            }

            return (
                <li 
                    className="char__item"
                    key={item.id}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onUpdateChar(item.id)
                        focusOnItem(i)}}
                    tabIndex={0}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = renderChars(chars);

    const spinner = loaded && !newLoaded ? <Spinner/> : null;
    const errorMes = error ? <ErrorMessage/> : null;

    return (
        <div className="char__list">
            {spinner}
            {errorMes}
            
            {items}
            <button 
                className="button button__main button__long"
                onClick={onRequest}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;