import img from './error.png'

const ErrorMessage = () => {
  return (
    <img src={img} alt={'Error 404'} style={{margin: 'auto', display: 'block'}}/>
  )
}

export default ErrorMessage;