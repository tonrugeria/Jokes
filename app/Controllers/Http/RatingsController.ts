import { schema, rules } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RatingsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({ request, response, auth }: HttpContextContract) {
    const validator = schema.create({
      joke_id: schema.number(),
      value: schema.number([rules.range(1,10)])
    })

    try {
      const payload = await request.validate({
        schema: validator,
        messages: {
          'joke_id.required': 'Joke ID is required',
          'value.required': 'Rating is required',
          'value.range': 'Rating must be 1 through 10'
        }
      })

      const user = auth.user!
      const rating = await user.related('ratings').create(payload)

      return response.created({ message: 'Joke posted Successfully', rating})

    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
