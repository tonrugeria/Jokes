import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
    public async register({ request, response }: HttpContextContract) {
        const validator = schema.create({
            username: schema.string(),
            email: schema.string({}, [
                rules.email()
            ]),
            password: schema.string([
                rules.confirmed(),
                rules.minLength(6)
              ])
        })

        try {
            const payload = await request.validate({
              schema: validator,
              messages: {
                'email': 'Improper format email',
                'password': 'Password is too short',
                'password_confirmation.confirmed': 'Password do not match'
              }
            })

            // const userData = request.only(['username', 'email', 'password'])
            const user = await User.create(payload)
        
            response.status(201)

            return response.json({ message: 'User registered successfully', user})
          } catch (error) {
            response.badRequest(error.messages)
          }

        
    }

    public async login({ request, response, auth }: HttpContextContract) {
        // const email = request.input('email')
        // const password = request.input('password')

        const { email, password } = request.all()
        // console.log("REQUEST ALL", request.all());
        

        try {
            const token = await auth.attempt(email, password)
            return token
        } catch {
            return response.unauthorized('Invalid credentials')
        }
    }
}
