import React, { useState } from 'react'
import { Modal, Checkbox } from 'antd';
import { cloneDeep } from 'lodash-es';
import { getSharedCredential, shareBBSVC } from '../utils/apiService';
import { ifDateThenFormat, removeProp } from '../utils/commonFunctions';
import 'antd/dist/antd.css';
import { Spin } from 'antd';

const ShareVC = ({ selectedCard, onClose, setCred }) =>
{
  const [checkedValues, setcheckedValues] = useState([]);
  const [loading, setLoading] = useState(false)

  const handleOk = async () =>
  {
    setLoading(true)
    const { sharingUrl } = await shareBBSVC(selectedCard.id, checkedValues)
    const response = await getSharedCredential(sharingUrl);
    if (response) {
      setCred(response);
      setLoading(false);
      onClose();
    } else {
      setLoading(false);
    }
  };

  const getJSON = (json) =>
  {
    delete json['color'];
    delete json['id'];
    delete json['sharingUrl'];
    return JSON.stringify(json, undefined, 2).replace(/{|}|\[|]|,|"/g, '');
  };

  const getKey = (item) =>
  {
    var result = item.replace(/([A-Z])/g, ' $1');
    var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  }

  const getCheckbox = () =>
  {
    let checkboxData = removeProp(cloneDeep(selectedCard.credentialSubject.data), '@type')
    checkboxData = removeProp(checkboxData, 'hasIDDocument')

    const options = Object.keys(checkboxData).map((key) =>
    {
      if (key === 'birthDate') {
        return {
          value: key,
          label: <div id='share_item'> <label>{getKey(key)}  </label>:
            <pre>{ifDateThenFormat(Object.prototype.hasOwnProperty.call(checkboxData, key))}</pre>
          </div>
        }
      }
      else {
        return {
          value: key,
          label: <div id='share_item'> <label>{getKey(key)}  </label>:
            <pre>{getJSON(Object.prototype.hasOwnProperty.call(checkboxData, key))}</pre>
          </div>
        }
      }
    })

    const onChange = (checkedValues) =>
    {
      setcheckedValues(checkedValues);
    }

    return (
      <Checkbox.Group options={options} onChange={onChange} style={{ display: 'flex', 'flexDirection': 'column' }} />
    );
  }

  return (
    <>
      <Modal title="Please select the data which you want to share:" visible={true} onOk={() => handleOk()} onCancel={() => onClose()}>
        {loading ? <Spin /> : getCheckbox()}
      </Modal>
    </>
  )
}

export default ShareVC
