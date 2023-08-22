import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
    public async registerForm({ view }: HttpContextContract) {
      return view.render('auth/register')
    }

    public async register({ request, response, auth }: HttpContextContract) {
        const validator = schema.create({
            username: schema.string({ trim: true },[
              rules.unique({
                table: 'users',
                column: 'username',
                caseInsensitive: true
              })
            ]),
            email: schema.string({}, [
                rules.email(),
                rules.unique({
                  table: 'users',
                  column: 'email',
                  caseInsensitive: true
                })
            ]),
            password: schema.string({}, [
                rules.confirmed(),
                rules.minLength(6)
              ])
        })

        try {
            const payload = await request.validate({schema: validator})
            const user = await User.create(payload)

            await auth.login(user)
        
            response.status(201)
            response.redirect().toPath('/jokes')
            // return response.json({ message: 'User registered successfully', user})
            // session.flash('successMessage', 'User registered successfully')
          } catch (error) {
            response.redirect().back()
            // session.flash('errorMessages', error.messages)
            // response.badRequest(error.messages)
          }
    }

    public async loginForm({ view }: HttpContextContract) {
      return view.render('auth/login')
  }

    public async login({ request, response, auth, session }: HttpContextContract) {
        // const { email, password } = request.all()
        const { email, password } = request.only(['email', 'password'])

        try {
            // const token = await auth.attempt(email, password)
            // return token

            await auth.attempt(email, password)
            response.redirect().toPath('/jokes')

        } catch(error) {
            // return response.unauthorized('Invalid credentials')
            session.flash('form', 'Your username, email or password is incorrect')
            return response.redirect().back()
        }
    }

    public async logout({ response, auth}: HttpContextContract) {
      await auth.logout()

      return response.redirect('/login')
    }
}
