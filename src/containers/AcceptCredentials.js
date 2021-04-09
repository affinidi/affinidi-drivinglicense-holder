import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import {storeSignedVCs} from '../utils/apiService';
import {Button} from 'react-bootstrap';
import DisplayCredentials from './DisplayCredentials';

const AcceptCredentials = (props) => {
    const [cred, setCred] = useState();

    const saveCredential = async (credential) => {
        try {
            const {credentialIds} = await storeSignedVCs({
                data: [credential]
              });
            console.log(credentialIds[0]);
          alert('You have saved your credential.')
          props.setAcceptVCLink(null)
          props.history.push('/');
        } catch (error){
            console.log(error)
        }
    }

    const fetchCredential = async (endPoint) => {
        try {
            const credential = await fetch(endPoint).then(res => res.json())
            console.log(credential)
            setCred(credential)
        } catch (error){
            console.log(error)
        }
    }

    useEffect(() => {
      const checkLogin = async () => {
          try {
              const { did } = await window.sdk.getDidAndCredentials();
              props.userHasAuthenticated(true)
          } catch (error){
              if(queryString.parse(props.location.search).vcURL){
                props.setAcceptVCLink(queryString.parse(props.location.search).vcURL);
              }
              alert('Please login.')
              props.history.push('/login')
          }
      }
      
      try {
        checkLogin()
        if (queryString.parse(props.location.search).vcURL) {
          console.log(queryString.parse(props.location.search).vcURL);
          fetchCredential(queryString.parse(props.location.search).vcURL);
        }
      } catch (error) {
        console.log(error)
      }
    }, [])

    return (
        <div className='tutorial'>
          <div className='tutorial__step'>
            { cred ? (
              <>
                <DisplayCredentials cred={cred}/>
                <Button style={{display: 'block', margin: '10px 0 0 0'}} onClick={() => saveCredential(cred)}>Save VC</Button>       
                <Button style={{display: 'block', margin: '10px 0 0 0'}} onClick={() => props.history.push('/')}>Reject VC</Button>       
              </>
              ) : <h3>No Verifiable Credential found</h3> }
            
        </div>
      </div>
    )
}

export default AcceptCredentials