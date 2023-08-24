import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.createMany([
      {
        email: 'joke@educ.com',
        password: 'password',
      },
      {
        email: 'ton@educ.com',
        password: 'password'
      }
    ])
    
  }
}
