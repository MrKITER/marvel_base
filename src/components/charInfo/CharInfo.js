import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../error/ErrorMes';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {

    const { charId } = props;

    const [char, setChar] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        if (charId) {
            updateChar();
        }
    }, [charId]);

    const updateChar = () => {
        if (!charId) {
            return
        }

        onCharLoading();

        marvelService.getCharacter(charId)
            .then(onCharLoaded)
            .catch(errorUpdate)
    }

    const onCharLoaded = (char) => {
        setChar(char);
        setLoaded(false);
    }

    const errorUpdate = () => {
        setLoaded(false);
        setError(true);
    }

    const onCharLoading = () => {
        setLoaded(true);
    }

    const skeleton = char || loaded || error ? null : <Skeleton/>
    const spinner = loaded ? <Spinner/> : null;
    const errorMes = error ? <ErrorMessage/> : null;
    const content = !(loaded || error || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {spinner}
            {errorMes}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const { name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = {'objectFit': 'cover'};

    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit': 'unset'}
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics to show'}
                {
                    comics.map((item, i) => {
                        if (i > 9) return;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;