import { useHttp } from "../hooks/http.hook"

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/'
  const _apiKey = 'apikey=3054266d4bf914d0a2cfc0c10ab8deda'
  const _baseOffset = 210

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter)
  }

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`)
    return _transformCharacter(res.data.results[0])
  }

  const getCharacterByName = async (name) => {
    const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`)
    return res.data.results.map(_transformCharacter)
  }

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`)
    return _transformComic(res.data.results[0])
  }

  const _transformCharacter = (char) => {
    return {
      name: char.name,
      description: char.description ? char.description.length > 200 ? `${char.description.slice(0, 200)}...` : char.description : 'There is no information about this character.',
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      id: char.id,
      comics: char.comics.items
    }
  }

  const _transformComic = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      price: comic.prices[0].price ? `$${comic.prices[0].price}` : 'Not available',
      thumbnail: `${comic.thumbnail.path}.jpg`,
      url: comic.urls[0].url,
      description: comic.description || 'There is no description',
      pageCount: comic.pageCount ? `${comic.pageCount} p.` : 'No information about the number of pages',
      language: comic.language || 'en-us'
    }
  }

  const getAllComics = async (offset = 0) => {
    const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`)
    return res.data.results.map(_transformComic)
  }

  return { loading, error, getAllCharacters, getCharacter, getCharacterByName, clearError, getAllComics, getComic }
}

export default useMarvelService;

