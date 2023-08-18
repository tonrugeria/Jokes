import { schema, rules } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Joke from 'App/Models/Joke';
import Rating from 'App/Models/Rating';
import Comment from 'App/Models/Comment';
import User from 'App/Models/User';

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

      return response.created({ message: 'Interactions recorded Successfully'})

    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  public async index({}: HttpContextContract) {
    const jokes = await Joke.all()
    return jokes
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response, auth }: HttpContextContract) {
    const validator = schema.create({
      content: schema.string()
    })

    try {
      const payload = await request.validate({
        schema: validator,
        messages: {
          'content.required': 'Joke content is required'
        }
      })

      const user = auth.user!
      await user.related('jokes').create({
        content: payload.content
      })

      return response.created({
        message: "Joke created successfully"
      })
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  public async show({ params }: HttpContextContract) {
    const joke = await Joke.findBy('id', params.id)

    return joke
  }

  public async edit({}: HttpContextContract) {}

  public async update({ params, request, auth, response }: HttpContextContract) {
    const validator = schema.create({
      content: schema.string()
    })

    try {
      const payload = await request.validate({
        schema: validator,
        messages: {
          'content.required': 'Joke content is required'
        }
      })

      const user = auth.user!
      const joke = await Joke.find(params.id)

      if(!joke) {
        return response.notFound({ message: 'Joke not found' })
      }

      if (joke.userId !== user.id) {
        return response.forbidden({ message: 'You do not have permission to edit this Joke'})
      }

      joke.content = payload.content
      await joke.save()

      return response.ok({ message: 'Joke updated successfully' })
    } catch (error) {
      return response.badRequest(error.message)
    }

    
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const user = auth.user!
    const joke = await Joke.find(params.id)

    if(!joke) {
      return response.notFound({ message: 'Joke not found' })
    }

    if (joke.userId !== user.id) {
      return response.forbidden({ message: 'You do not have permission to delete this Joke'})
    }

    await joke.delete()

    return response.ok({ message: 'Joke deleted successfully' })
  }
}
