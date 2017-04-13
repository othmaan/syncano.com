import hello from 'hellojs'
import Cookies from 'js-cookie'
import {action} from 'mobx'

const LOGIN_URL = `${process.env.API_URL}/v1.1/account/auth/`
const REGISTER_URL = `${process.env.API_URL}/v1.1/account/register/`

export default class Auth {
  constructor (props) {
    this.initHello()
  }

  @action.bound rebuildSession () {
    this.store.isLoggedIn = Boolean(Cookies.get('logged_in'))
  }

  @action.bound async login (credentials) {
    const {request} = this.services
    const {messages} = this.stores

    messages.delete('auth.login')

    try {
      const res = await request.post(LOGIN_URL, credentials)

      this.redirectToDashboard(res.data.account_key)
    } catch (err) {
      const {data} = err.response

      messages.set('auth.login', data)
    }
  }

  @action.bound async register (credentials) {
    const {request} = this.services
    const {messages} = this.stores

    messages.delete('auth.register')

    try {
      const res = await request.post(REGISTER_URL, credentials)

      this.redirectToDashboard(res.data.account_key, true)
    } catch (err) {
      const {data} = err.response

      messages.set('auth.register', data)
    }
  }

  @action.bound socialAuth (network) {
    const {messages} = this.stores
    const {request} = this.services

    this.hello(network).login(async social => {
      const {access_token} = social.authResponse

      if (social.network === 'google') {
        social.network = 'google-oauth2'
      }

      try {
        const res = await request.post(`${LOGIN_URL}${social.network}/`, {access_token})

        this.redirectToDashboard(res.data.account_key, res.data.created)
      } catch (err) {
        messages.set('auth.social', err.message)
      }
    }, err => {
      messages.set('auth.social', err)
    })
  }

  redirectToDashboard = (token, signUpMode = false) => {
    let redirectUrl = `${process.env.DASHBOARD_URL}/#/login?token=${token}`

    if (signUpMode) {
      redirectUrl = `${process.env.DASHBOARD_URL}#/setup?token=${token}&signUpMode=${signUpMode}`
    }

    window.location.href = redirectUrl
  }

  initHello () {
    const credentials = {
      facebook: process.env.HELLO_FACEBOOK,
      google: process.env.HELLO_GOOGLE,
      github: process.env.HELLO_GITHUB
    }

    const options = {
      scope: 'email',
      redirect_uri: process.env.HELLO_REDIRECT_URI
    }

    hello.init(credentials, options)

    this.hello = hello.bind(hello)
  }
}