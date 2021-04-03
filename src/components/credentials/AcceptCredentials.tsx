import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import ApiService from 'utils/apiService'
import {Button} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { routes } from 'constants/routes';
import DisplayCredentials from 'components/credentials/DisplayCredentials';

const AcceptCredentials = (props: any) => {
    const history = useHistory();

    const [cred, setCred] = useState<any>();
    // https://cloud-wallet-api.prod.affinity-project.org/api/v1/share/7cb3f941e660db7df81c2624e1123fb09b6cb2f661b804f48bcbb2820ad1a7ed?key=d281e9e457d01cdf73d0a0dff15bded0d3d6c6dc6e06c535cb5ac2b4a8b13874
    // http://localhost:3000/accept-credentials?vcURL=https://cloud-wallet-api.prod.affinity-project.org/api/v1/share/7cb3f941e660db7df81c2624e1123fb09b6cb2f661b804f48bcbb2820ad1a7ed?key=d281e9e457d01cdf73d0a0dff15bded0d3d6c6dc6e06c535cb5ac2b4a8b13874

    const saveCredential = async (credential: any) => {
        try {
            const {credentialIds} = await ApiService.storeSignedVCs({
                data: [credential]
              });
            console.log(credentialIds[0]);
          history.push(routes.ROOT);
        } catch (error){
            console.log(error)
        }
    }

    const setCredential = async (endPoint: any) => {
        try {
            const credential = await fetch(endPoint).then(res => res.json())
            console.log(credential)
            setCred(credential)
        } catch (error){
            console.log(error)
        }
    }

    useEffect(() => {
        if (queryString.parse(props.location.search).vcURL) {
            console.log(queryString.parse(props.location.search).vcURL);
            setCredential(queryString.parse(props.location.search).vcURL);
        }
    }, [])

    return (
        <div className='tutorial'>
          <div className='tutorial__step'>
            { cred ? (
              <DisplayCredentials cred={cred}/>
              ) : <h3>No Verifiable Credential found</h3> }
            <Button style={{display: 'block', margin: '10px 0 0 0'}} onClick={() => saveCredential(cred)}>Save VC</Button>       
            <Button style={{display: 'block', margin: '10px 0 0 0'}} onClick={() => history.push(routes.ROOT)}>Reject VC</Button>       
        </div>
      </div>
    )
}
export default AcceptCredentials