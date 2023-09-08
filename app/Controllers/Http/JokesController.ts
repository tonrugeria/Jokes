import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Joke from 'App/Models/Joke';
import Rating from 'App/Models/Rating';
import Database from '@ioc:Adonis/Lucid/Database';
import JokeValidator from 'App/Validators/JokeValidator';
import RatingValidator from 'App/Validators/RatingValidator';
import CommentValidator from 'App/Validators/CommentValidator';
import { timeAgo } from '../Utils/TimeUtils';

export default class JokesController {

  public async index({ view, auth }: HttpContextContract) {
    const user = auth.user!
    const jokes = await Database.from('jokes')
      .join('users', 'users.id', '=', 'jokes.user_id')
      .select('jokes.*', 'users.username', 'users.image')
      .orderBy('jokes.updated_at', 'desc')
      .groupBy('jokes.id', 'users.username', 'users.image');
    
  return view.render('jokes/index', { 
    jokes, 
    user, 
    timeAgo,
    })
}

  public async create({ view, auth }: HttpContextContract) {
    const user = auth.user!
    return view.render('jokes/posting', { user})
  }

  public async store({ request, response, auth, session }: HttpContextContract) {
    const payload = await request.validate(JokeValidator)
    const user = auth.user!
    
    await user.related('jokes').create({
      content: payload.content
    })
    session.flash('success', 'Joke created successfully');
    return response.redirect().back()
  }

  public async show({ view, params, auth }: HttpContextContract) {
    const user = auth.user!
    const jokeId = params.id
    const userId = auth.user?.id
    const joke = await Joke.find(jokeId)
    const ratings = await joke?.related('ratings').query();
    const findRating = await Rating.query()
      .where('joke_id', jokeId)
      .where('user_id', userId!)
    const personalRating = findRating[0]?.value
    
    const comments = await Database.from('comments')
      .join('users', 'users.id', '=', 'comments.user_id')
      .join('jokes', 'jokes.id', '=', 'comments.joke_id')
      .where('joke_id', jokeId)
      .select('comments.*')
      .orderBy('comments.updated_at', 'desc')
    const ratingsLength = ratings?.length ?? 0
    const totalRatings = ratings?.reduce((sum, rating) => sum + rating.value, 0) ?? 0
    const averageRating = ratingsLength === 0 ? 0 : totalRatings / ratingsLength;
    const ratingCounts = [0, 0, 0, 0, 0];
    
    ratings?.forEach(rating => {
      ratingCounts[rating.value - 1]++;
    });

    const ratingPercentages = ratingCounts.map(count => (count / ratingsLength) * 100);
    const roundedPercent = ratingPercentages.map(percentage => Math.round(percentage));
    
    return view.render('jokes/comments_ratings', {
      joke, 
      user,
      comments,
      ratingsLength, 
      averageRating,
      roundedPercent,
      timeAgo,
      personalRating
    })
  }

  public async edit({ view, params, auth }: HttpContextContract) {
    const user = auth.user!
    const { id } = params
    const joke = await Joke.find(id)

    return view.render('jokes/edit', { joke, user })
  }

  public async update({ request, response, params, session }: HttpContextContract) {
    const payload = await request.validate(JokeValidator)
    
    try {
      const joke = await Joke.findOrFail(params.id);
  
      joke.content = payload.content;
      
      await joke.save();
  
      session.flash('success', 'Joke updated successfully');
    } catch (error) {
      session.flash('error', 'Joke not found or could not be updated');
    }

    return response.redirect().back()
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

    return response.redirect().back()
  }

  
  public async editRating({ params, request, response, auth, session }: HttpContextContract) {
    
    try {
      const payload = await request.validate(RatingValidator)
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
      
      return response.redirect().back()

    } catch (error) {
      session.flash('errors.rating.required', 'Please Rate a valid Rating!')
      return response.redirect().back()
    }
  }

  public async postComment({ response, request, params, auth, session }: HttpContextContract) {
    const payload = await request.validate(CommentValidator)
    const user = auth.user!
    const joke = await Joke.find(params.id)
    
    await user.related('comments').create({
      jokeId: joke?.id,
      content: payload.content
    })
    session.flash('commentSuccess', 'Comment posted Successfully');
    
    return response.redirect().back()
  }
}
