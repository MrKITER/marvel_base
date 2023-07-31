import React, { useState, useEffect, useRef } from 'react';

import MarvelService from '../../services/MarvelService';
import './charList.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMes';

const CharList = (props) => {

    const [chars, setChars] = useState([]);
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(true);
    const [offset, setOffset] = useState(1);
    const [newLoaded, setNewLoaded] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const itemRefs = useRef([]);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, [])

    const onRequest = () => {
        if (offset === 1) {
            onCharListLoading();
        } else {
            onCharLoading();
        }
        
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharsLoaded)
            .catch(errorUpdate)
    }

    const onCharListLoading = () => {
        setNewLoaded(true)
    }

    const onCharsLoaded = (charList) => {
        let ended = false;
        if (charList.length < 9) {
            ended = true
        }

        setChars(chars => [...chars, ...charList]);
        setOffset(offset => offset + 9);
        setLoaded(false);
        setError(false);
        setNewLoaded(false);
        setCharEnded(ended);
    }

    const onCharLoading = () => {
        setLoaded(true)
    }

    const errorUpdate = () => {
        setLoaded(false);
        setError(true);
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

    const spinner = loaded ? <Spinner/> : null;
    const errorMes = error ? <ErrorMessage/> : null;
    const content = !(loaded || error) ? items : null;

    return (
        <div className="char__list">
            {spinner}
            {errorMes}
            
            {content}
            <button 
                className="button button__main button__long"
                onClick={onRequest}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;