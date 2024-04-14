import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'

import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [comicsEnded, setcomicsEnded] = useState(false)
    const [offset, setOffset] = useState(0)

    const { loading, error, getAllComics } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset)
            .then(onAddComic)
    }

    const onAddComic = (comics) => {
        let ended = false
        if (comics.length < 8) {
            ended = true
        }

        setComicsList(comicsList => [...comicsList, ...comics])
        setNewItemLoading(false)
        setOffset(offset + 8)
        setcomicsEnded(ended)
    }

    const comics = (comicsList) => {
        const items = comicsList.map((el, id) => {
            let styleCont = { objectFit: 'cover' };
            if (el.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                styleCont = { objectFit: 'fill' }
            }
            const delay = `${id * 50}ms`
            return (
                <CSSTransition key={id} classNames='comics__item' timeout={500} style={{ transitionDelay: delay }}>
                    <li className="comics__item" >
                        <Link to={`/comics/${el.id}`}>
                            <img src={el.thumbnail} alt={el.title} className="comics__item-img" style={styleCont} />
                            <div className="comics__item-name">{el.title}</div>
                            <div className="comics__item-price">{el.price}</div>
                        </Link>
                    </li>
                </CSSTransition>
            )
        })
        return (
            <TransitionGroup component={'ul'} className="comics__grid">
                {items}
            </TransitionGroup>
        )
    }

    const spinner = loading && !newItemLoading ? <Spinner /> : null
    const errorMsg = error ? <ErrorMessage /> : null
    const items = comics(comicsList)

    return (
        <div className="comics__list">
            {spinner}
            {errorMsg}
            {items}
            <button
                disabled={newItemLoading}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;