import { AffinityWallet as Wallet } from '@affinidi/wallet-browser-sdk'
import { __dangerous } from '@affinidi/wallet-core-sdk'
import { JwtService } from "@affinidi/common";
import SdkError from "@affinidi/wallet-core-sdk/dist/shared/SdkError";
import config from "../config";
import cloudWalletApi from './apiService'
import LOCAL_STORAGE_KEY from './consts'

const { SDK_ACCESS_TOKEN } = LOCAL_STORAGE_KEY

const { WalletStorageService } = __dangerous
const SDK_OPTIONS = {
  env: config.env,
  apiKey: config.apiKey
}

class SDKConfigurator
{
  static getSdkOptions()
  {
    const { env, apiKey } = SDK_OPTIONS
    const options = Wallet.setEnvironmentVarialbles({ env })

    return Object.assign({}, options, { apiKey, env })
  }
}

class SdkService
{
  constructor()
  {
    this.sdk = Wallet
    this.jwtService = JwtService
  }

  async init()
  {
    const accessToken = localStorage.getItem(SDK_ACCESS_TOKEN)
    if (!accessToken) {
      throw new SdkError('COR-9')
    }

    const { env, apiKey } = SDK_OPTIONS
    const { keyStorageUrl } = SDKConfigurator.getSdkOptions(env, apiKey)
    const encryptedSeed = await WalletStorageService.pullEncryptedSeed(accessToken, keyStorageUrl, SDK_OPTIONS)
    const encryptionKey = await WalletStorageService.pullEncryptionKey(accessToken)

    return new this.sdk(encryptionKey, encryptedSeed, { ...SDK_OPTIONS, cognitoUserTokens: { accessToken } })
  }

  async signOut()
  {
    await cloudWalletApi.post('/users/logout')
    localStorage.removeItem(SDK_ACCESS_TOKEN)
  }

  async signUp(username, password, messageParameters)
  {
    const signUpParams = { username, password }
    const { data: token } = await cloudWalletApi.post('/users/signup', signUpParams)

    return token
  }

  async confirmSignUp(token, confirmationCode, options = {})
  {
    const signUpConfirmParams = { token, confirmationCode }
    const response = await cloudWalletApi.post('/users/signup/confirm', signUpConfirmParams)
    const { accessToken } = response.data
    SdkService._saveAccessTokenToLocalStorage(accessToken)
  }

  async getDidAndCredentials()
  {
    const networkMember = await this.init()

    const did = networkMember.did

    let credentials = []
    try {
      credentials = await networkMember.getCredentials()
    } catch (error) {
      console.log('no credentials', error)
    }

    return { did, credentials }
  }

  async fromLoginAndPassword(username, password)
  {
    const loginParams = { username, password }
    const response = await cloudWalletApi.post('/users/login', loginParams)
    const { accessToken } = response.data
    SdkService._saveAccessTokenToLocalStorage(accessToken)
  }

  async getCredentials(credentialShareRequestToken, fetchBackupCredentials)
  {
    const networkMember = await this.init()
    return networkMember.getCredentials(credentialShareRequestToken, fetchBackupCredentials)
  }

  async saveCredentials(credentials)
  {
    const networkMember = await this.init()
    return networkMember.saveCredentials(credentials)
  }

  async createCredentialShareResponseToken(credentialShareRequestToken, suppliedCredentials)
  {
    const networkMember = await this.init()
    return networkMember.createCredentialShareResponseToken(credentialShareRequestToken, suppliedCredentials)
  }

  parseToken(token)
  {
    return JwtService.fromJWT(token)
  }

  static _saveAccessTokenToLocalStorage(accessToken)
  {
    try {
      localStorage.setItem(SDK_ACCESS_TOKEN, accessToken)
    } catch (err) {
      console.error(err)
    }
  }
}

export default SdkService
