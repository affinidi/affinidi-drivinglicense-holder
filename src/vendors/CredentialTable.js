import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap'
import { unset } from 'lodash-es'

const CredentialTable = ({ credentials }) =>
{
  const [vcData, setVCData] = useState([]);

  useEffect(() =>
  {
    const removeProp = (obj, propToDelete) =>
    {
      for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
          if (property === propToDelete) {
            unset(obj, property)
          } else if (typeof Object.prototype.hasOwnProperty.call(obj, property) == 'object') {
            removeProp(Object.prototype.hasOwnProperty.call(obj, property), propToDelete);
          }
        }
      }
      return obj
    }

    const initialiseVCData = (vcData) =>
    {
      let processedVCData = []
      for (let vc in vcData) {
        processedVCData[parseInt(vc)] = vcData[parseInt(vc)].credential.credentialSubject.data
        processedVCData[parseInt(vc)] = removeProp(processedVCData[parseInt(vc)], '@type')
      }
      return processedVCData
    }

    setVCData(initialiseVCData(credentials))
  }, [credentials])

  const extractEmailFromIDDocument = (cred) =>
  {
    if (cred.hasIDDocument) {
      return JSON.parse(cred.hasIDDocument.hasIDDocument.idClass).email
    } else {
      return null
    }
  }

  return <div>
    <Table bordered>
      <thead className="thead-light">
        <tr>
          <th>Index</th>
          <th>Given Name</th>
          <th>Family Name</th>
          <th>Email</th>
          <th>VC Type</th>
        </tr>
      </thead>
      <tbody>
        {
          vcData.map((cred, index) =>
          {
            return (
              <tr key={index + 1}>
                <th scope='row'>{index + 1}</th>
                <td>{cred.givenName || cred.name}</td>
                <td>{cred.familyName || ''}</td>
                <td>{cred.email || extractEmailFromIDDocument(cred) || ''}</td>
                <td>{cred.hasIDDocument ? cred.hasIDDocument.hasIDDocument.documentType : 'ID Document'}</td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
  </div>
}

export default CredentialTable;