import Application from '@ioc:Adonis/Core/Application';
import type { HttpContextContract, } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import PasswordValidator from 'App/Validators/PasswordValidator';
import UserValidator from 'App/Validators/UserValidator'
import { DateTime } from 'luxon'

export default class UsersController {
    public async showProfile({ view, auth }: HttpContextContract) {
      const user = auth.user!
      const findUser = await User.find(user.id)
      const image = findUser?.image
      return view.render('users/profile', {image})
    }

    public async updateProfile({auth, request, response, session}: HttpContextContract) {
      const user = auth.user!
      const findUser = await User.find(user.id)
      if (!findUser) {
        return response.status(404).send("User not found");
      }

      const payload = await request.validate(UserValidator)

      if (payload.image) {
        await payload.image.move(Application.publicPath("images"));
        
          findUser.image = payload.image.fileName;
          await findUser.save();
          session.flash("success", "Profile updated successfully");
      }
      return response.redirect().back()
    }

    public async getPosts({ view, auth }: HttpContextContract) {
        const user = auth.user!
        function timeAgo(jokeDate) {
            const formattedJokeDate = DateTime.fromJSDate(jokeDate)
            const dateNow = DateTime.now()
            const diff = dateNow.diff(formattedJokeDate, ['days', 'hours', 'minutes'])
            
            if (diff.days > 0) {
              return `${diff.days} day${diff.days === 1 ? '' : 's'} ago`;
            } else if (diff.hours > 0) {
              return `${diff.hours} hour${diff.hours === 1 ? '' : 's'} ago`;
            } else if (diff.minutes > 0) {
              const roundedMinutes = Math.floor(diff.minutes);
              return `${roundedMinutes} minute${roundedMinutes === 1 ? '' : 's'} ago`;
            } else {
              return 'Just now';
            }
          }  

          const jokes = await Database.from('jokes')
            .join('users', 'users.id', '=', 'jokes.user_id')
            .where('users.id', user.id)
            .select('jokes.*', 'users.username', 'users.image')
            .orderBy('jokes.updated_at', 'desc')
            .groupBy('jokes.id', 'users.username', 'users.image');
        
        return view.render('users/posts', { jokes, timeAgo })
    }

    public async showChangePassword({view, auth}: HttpContextContract) {
      const user = auth.user!
      return view.render('users/password', { user })
    }

    public async changePassword({ auth, request, session, response }: HttpContextContract) {
      const user = auth.user!
      const payload = await request.validate(PasswordValidator)

      user.password = payload.password

      await user.save()
      session.flash('success', 'Registration Successfully')
      response.redirect().back()
    }
}
