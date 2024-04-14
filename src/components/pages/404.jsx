import { Helmet } from "react-helmet"
import { Link, useNavigate } from "react-router-dom"

import ErrorMessage from "../errorMessage/ErrorMessage"

const Page404 = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Helmet>
        <meta name="description"
          content={`Error page`} />
        <title>Error</title>
      </Helmet>
      <ErrorMessage />
      <p style={{ 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': 40, 'color': '#9F0013' }}>Page does not exist</p>
      <Link style={{ 'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px' }} onClick={() => { navigate(-1) }}>Back to main page</Link>
    </div>
  )
}

export default Page404