import { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types'

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';


const CharList = (props) => {

	const [charList, setCharList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false)

	const { loading, error, getAllCharacters } = useMarvelService()


	useEffect(() => {
		onRequest(offset, true)
		// eslint-disable-next-line
	}, [])

	const onAddChars = async (newCharList) => {
		let ended = false
		if (newCharList.length < 9) {
			ended = true
		}

		setCharList(charList => [...charList, ...newCharList])
		setOffset(offset => offset + 9)
		setCharEnded(ended)
		setNewItemLoading(false);
	}

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);
		getAllCharacters(offset)
			.then(onAddChars)
	}



	const refsArr = useRef([])

	const onHighlightChar = (id) => {
		refsArr.current.forEach(el => el.classList.remove('char__item_selected'))
		refsArr.current[id].classList.add('char__item_selected')
		refsArr.current[id].focus()
	}


	function cards(charsArray) {
		const items = charsArray.map((el, id) => {
			let styleCont = { objectFit: 'cover' };
			if (el.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
				styleCont = { objectFit: 'fill' }
			}
			const delay = `${id * 50}ms`
			return (
				<CSSTransition key={el.id} timeout={500} classNames="char__item" style={{ transitionDelay: delay }}>
					<li
						className="char__item"
						ref={el => refsArr.current[id] = el}
						onClick={() => { props.onCharSelected(el.id); onHighlightChar(id) }}
						tabIndex={0}
						onKeyDown={e => {
							if (e.key === ' ' || e.key === 'Enter') {
								props.onCharSelected(el.id)
								onHighlightChar(id)
							}
						}}>
						<img src={el.thumbnail} alt="hero" style={styleCont} />
						<div className="char__name">{el.name}</div>
					</li>
				</CSSTransition>
			)
		})
		return (
			<TransitionGroup component={'ul'} className="char__grid">
				{items}
			</TransitionGroup>
		)
	}

	const items = cards(charList)

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading && !newItemLoading ? <Spinner /> : null;

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			{items}
			<button className="button button__main button__long" disabled={newItemLoading} style={{ 'display': charEnded ? 'none' : 'block' }} onClick={() => onRequest(offset)}>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList;

