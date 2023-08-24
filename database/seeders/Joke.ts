import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Joke from 'App/Models/Joke'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Joke.createMany([
      {
        userId: 1,
        content: 'This is the initial content for user 1',
      },
      {
        userId: 2,
        content: 'This is the initial content for user 2'
      }
    ])
  }
}
