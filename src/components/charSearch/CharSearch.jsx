import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charSearch.scss'

const CharSearch = () => {
  const [char, setChar] = useState(null)
  const { error, loading, getCharacterByName, clearError } = useMarvelService()

  const onCharLoaded = (char) => {
    setChar(char)
  }

  const updateChar = (name) => {
    clearError()

    getCharacterByName(name)
      .then(onCharLoaded)
  }
  const errorMsg = error ? <div><ErrorMessage /></div> : null;

  const result = !char ? null : char.length > 0 ?
    <div className='search-form__result'>
      <div className='search-form__success'>There is! Visit {char[0].name} page?</div>
      <Link to={`/characters/${char[0].id}`} className='button button__secondary'>
        <div className='inner'>To page</div>
      </Link>
    </div> :
    <div className="error">
      The character was not found. Check the name and try again
    </div>;

  return (
    <div className='search-form'>
      <Formik
        initialValues={{
          characterName: '',
        }}
        validationSchema={Yup.object({
          characterName: Yup.string()
            .min(2, 'Minimum 2 symbols')
            .required('This field is required')
        })}
        onSubmit={({ characterName }) => {
          updateChar(characterName)
          console.log(char)
        }}>
        <Form >
          <label htmlFor='characterName' className='search-form__label' >Or find a character by name:</label>
          <div>
            <Field
              name='characterName'
              id='characterName'
              type='text'
              className='search-form__input' />
            <button type='submit' className='button button__main' disabled={loading}>
              <div className='inner'>Find</div>
            </button>
          </div>
          <FormikErrorMessage className='error' name='characterName' component='div' />
        </Form>
      </Formik>
      {errorMsg}
      {result}
    </div>
  )
}

export default CharSearch