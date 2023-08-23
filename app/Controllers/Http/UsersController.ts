import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
    public async showProfile({ view }: HttpContextContract) {
        return view.render('users/profile')
    }

    public async getPosts({ view, auth }: HttpContextContract) {
        const user = auth.user!
        const jokes = await user.related('jokes').query()
        
        return view.render('users/posts', { jokes })
    }
}
