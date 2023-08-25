import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NotfoundController {
    public async index({ view }: HttpContextContract) {
        return view.render('not_found')
    }
}
