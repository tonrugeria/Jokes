import { schema, rules } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Joke from 'App/Models/Joke';
import Rating from 'App/Models/Rating';
import Comment from 'App/Models/Comment';

export default class JokesController {
  public async interactions({ params, request, response, auth }: HttpContextContract) {
    const validator = schema.create({
      rating: schema.number.optional([
        rules.range(1, 10)
      ]),
      comment: schema.string.optional()
    })

    try {
      const payload = await request.validate({
        schema: validator
      })

      const user = auth.user!
      const joke = await Joke.find(params.id)

      if(!joke) {
        return response.notFound({
          message: 'Joke not found'
        })
      }

      const existingRating = await Rating
        .query()
        .where('user_id', user.id)
        .where('joke_id', joke.id)
        .first()

      const existingComment = await Comment
        .query()
        .where('user_id', user.id)
        .where('joke_id', joke.id)
        .first()

      if(payload.rating) {
        if (existingRating) {
          existingRating.value = payload.rating
          await existingRating.save()
        } else {
          await user.related('ratings').create({
            jokeId: joke.id,
            value: payload.rating
          })
        }
      }

      if(payload.comment) {
        if (existingComment) {
          existingComment.content = payload.comment
          await existingComment.save()
        } else {
          await user.related('comments').create({
            jokeId: joke.id,
            content: payload.comment
          })
        }
      }

      // if(payload.comment) {
      //   await user.related('comments').create({
      //     jokeId: joke.id,
      //     content: payload.comment
      //   })
      // }

      return response.created({ message: 'Interactions recorded Successfully'})

    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
