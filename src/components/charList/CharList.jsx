import { Component } from 'react';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import MarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types'
import './charList.scss';


class CharList extends Component {

	state = {
		charList: [],
		loading: true,
		error: false,
		newItemLoading: false,
		offset: 210,
		charEnded: false
	}

	marvelService =	new MarvelService()

	onCharListLoading = () => {
		this.setState({
			newItemLoading: true
		});
	}

	onScrollLoading = () => {

	}

	onAddChars = (newCharList) => {
		let ended = false
		if (newCharList.length < 9) {
			ended = true
		}

		this.setState(({charList, offset}) => ({
			charList: [...charList, ...newCharList],
			loading: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended
		}))
	}

	componentDidMount() {
    this.onRequest();
	}

	onRequest = (offset) => {
		this.onCharListLoading();
		this.marvelService
			.getAllCharacters(offset)
			.then(this.onAddChars)
			.catch(this.onError)
	}

	onError = () => {
		this.setState({
			loading: false,
			error: true
		})
	}

	refsArr = []

	setRefs = (ref) => {
		this.refsArr.push(ref)
	}

	onHighlightChar = (id) => {
		this.refsArr.forEach(el => el.classList.remove('char__item_selected'))
		this.refsArr[id].classList.add('char__item_selected')
		this.refsArr[id].focus()
	}


	cards = (charsArray) => {
		const items = charsArray.map((el, id) => {
			let styleCont = {objectFit: 'cover'};
			if (el.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
				styleCont = {objectFit: 'fill'}
			}
			return(
				<li 
				className="char__item" 
				key={el.id} 
				ref={this.setRefs} 
				onClick={() => {this.props.onCharSelected(el.id); this.onHighlightChar(id)}} 
				tabIndex={0}
				onKeyDown={e => {
					if (e.key === ' ' || e.key === 'Enter') {
						this.props.onCharSelected(el.id)
						this.onHighlightChar(id)
					}
				}}>
					<img src={el.thumbnail} alt="hero" style={styleCont}/>
					<div className="char__name">{el.name}</div>
				</li>
			)
		})
		return (
			<ul className="char__grid">
				{items}
			</ul>
		)
	}

	render() {
		const { charList, loading, error, newItemLoading, offset, charEnded } = this.state

		const errorMessage = error ? <ErrorMessage/> : null;
		const spinner = loading ? <Spinner/> : null;
		const content = !(loading || error) ? this.cards(charList) : null;


		return (
			<div className="char__list">
					{errorMessage}
					{spinner}
					{content}
				<button className="button button__main button__long" disabled={newItemLoading} style={{'display': charEnded ? 'none' : 'block'}} onClick={() => this.onRequest(offset)}>
						<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList;

