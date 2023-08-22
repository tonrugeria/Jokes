import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import AuthValidator from 'App/Validators/AuthValidator'

export default class AuthController {
  public async registerForm({ view }: HttpContextContract) {
    return view.render('auth/register')
  }

  public async register({ request, response, auth }: HttpContextContract) {
    try {
      const payload = await request.validate(AuthValidator)
      const user = await User.create(payload)

      await auth.login(user)
  
      response.status(201)
      response.redirect().toPath('/jokes')
    } catch (error) {
      response.redirect().back()
    }
  }

  public async loginForm({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  public async login({ request, response, auth, session }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
      await auth.attempt(email, password)
      response.redirect().toPath('/jokes')
    } catch(error) {
      session.flash('form', 'Your username, email or password is incorrect')
      return response.redirect().back()
    }
  }

  public async logout({ response, auth}: HttpContextContract) {
    await auth.logout()

    return response.redirect('/login')
  }
}
