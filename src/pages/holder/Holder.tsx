import React, { useEffect, useState} from 'react';
import {Button, Table} from 'react-bootstrap';
import 'pages/holder/Holder.scss'
import ApiService from 'utils/apiService';
import {GetSignedCredentialsFireBaseOutput} from 'utils/firebase/index';
import {GetSavedCredentialsOutput, UnsignedW3cCredential, W3cCredential} from 'utils/apis';
import FireBaseService from 'utils/firebaseService';

interface State {
  currentUnsignedVC: UnsignedW3cCredential | null,
  currentSignedVC: W3cCredential | null,
  isCurrentVCVerified: boolean,
}

interface SignedVC {
  signedVCs: GetSignedCredentialsFireBaseOutput,
  isLoadingSignedVCs: boolean
}


interface StoredVC {
  storedVCs: GetSavedCredentialsOutput,
  isLoadingStoredVCs: boolean
}

/**
 * Stateful component responsible for rendering the showcase of this app.
 * The basic parts of SSI cycle are covered with this component.
 * */
const Holder = () => {
  const [state, setState] = useState<State>({
    currentUnsignedVC: null,
    currentSignedVC: null,
    isCurrentVCVerified: false
  })

  const [signedVC, setSignedVC] = useState<SignedVC>({
    signedVCs: [],
    isLoadingSignedVCs: true
  })

  const [storeVC, setStoreVC] = useState<StoredVC>({
    storedVCs: [],
    isLoadingStoredVCs: true
  })
  
  const data = ApiService.getDidTokenToLocalStorage();
  const didToken = data? data: "Not available" // Will clean this up next time
  const firebaseService = new FireBaseService(didToken.split(';')[0]);

  /**
   * 1. Get stored VCs from user cloud wallet on component mount.
   **/
  useEffect(() => {
    const getSavedVCs = async () => {
      try {
        const arrayOfStoredVCs = await ApiService.getSavedVCs();
        console.log(arrayOfStoredVCs)
        setStoreVC({
          storedVCs: [...arrayOfStoredVCs],
          isLoadingStoredVCs: false
        })
      } catch (error) {
        ApiService.alertWithBrowserConsole(error.message)

        setStoreVC({
          ...storeVC,
          isLoadingStoredVCs: false
        })
      }
    }
    getSavedVCs();
  }, []);

  /**
   * Function for deleting a stored VC.
   * */
  const deleteStoredVC = async (index: number) => {
    try {
      await ApiService.deleteStoredVC(storeVC.storedVCs[index].id);

      setStoreVC({
        ...storeVC,
        storedVCs: storeVC.storedVCs.filter((value, idx) => idx !== index)
      })

      alert('Verified VC successfully deleted from your cloud wallet.');
    } catch(error) {
      ApiService.alertWithBrowserConsole(error.message)
    }
  }

  return (
    <div className='tutorial'>
          <div className='py-3'>
            <h3>Stored VC</h3>
            <Table bordered>
              <thead className="thead-light">
                <tr>
                  <th>Index</th>
                  <th>ID</th>
                  <th>VC Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {storeVC.storedVCs.map((storedVCs,index)=>{
                  return (
                    <tr>
                    <th scope="row">{index+1}</th>
                    <td>{storedVCs.id.split(":")[1]}</td>
                    <td>Driving License</td>
                    <td>
                      <Button variant="danger" size="sm" block onClick={() => deleteStoredVC(index)}>Del</Button>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
          
        {/* </div>
      </div> */}
    </div>
  )
}

export default Holder
