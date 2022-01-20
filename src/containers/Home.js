import React, { Component, Fragment } from 'react'
import './Home.css'
import queryString from 'query-string'
import CredentialTable from '../vendors/CredentialTable';
import { getSharedCredential } from './../utils/apiService';

class ValidatableCredential
{
  constructor(credential, status = undefined, errorMessage = '')
  {
    this.credential = credential
    this.status = status
    this.errorMessage = errorMessage
  }
}

class Home extends Component
{
  constructor(props)
  {
    super(props)

    const { processToken } = queryString.parse(this.props.location.search)

    this.state = {
      isLoading: false,
      isDeleteModalShown: false,
      areCredentialDetailsShown: false,
      credentials: [],
      did: null,
      verifiableCredentials: [],
      verifiablePresentationModalCredential: undefined,
      credentialShareRequestToken: processToken || undefined,
      credentialShareRequestModalToken: processToken || undefined,
    }
  }

  makeVerifiableCredentials(credentials)
  {
    return credentials.map(credential => new ValidatableCredential(credential))
  }

  async componentDidMount()
  {
    try {
      const response = await getSharedCredential();
      console.log(response)
      this.props.userHasAuthenticated(true)
      const verifiableCredentials = this.makeVerifiableCredentials(response)

      this.setState({ credentials: response, verifiableCredentials })
    } catch (error) {
      console.log(error)
      this.props.userHasAuthenticated(false)
      this.props.history.push('/login')
    }
  }

  render()
  {
    const { verifiableCredentials } = this.state
    const haveCredentials = verifiableCredentials && verifiableCredentials.length > 0
    const { isAuthenticated } = this.props

    return (
      <Fragment>
        <div className='Home'>
          <form className='Form container'>
            <h1 className='Title'>Wallet</h1>
            {isAuthenticated && haveCredentials ?
              <div className='Credentials'>
                <CredentialTable credentials={verifiableCredentials} />
              </div>
              : <p>You have no credentials.</p>}
          </form>
        </div>
      </Fragment>
    )
  }
}

export default Home
