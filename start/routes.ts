/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/register', "AuthController.registerForm")
  Route.post('/register', "AuthController.register")
  Route.get('/login', "AuthController.loginForm")
  Route.post('/login', "AuthController.login")
}).middleware('guest')

Route.get('/logout', "AuthController.logout")

Route.group(() => {
  Route.get('/', async ({ view }) => {
    return view.render('jokes/index')
  })
  Route.resource('jokes', 'JokesController')

  Route.get('/jokes/:id/rate-comment', 'JokesController.showJoke')
  Route.post('/jokes/:id/interactions', 'JokesController.interactions')

  Route.get('/posts', 'UsersController.getPosts')
  Route.get('/profile', 'UsersController.showProfile')
  Route.patch('/profile', 'UsersController.updateProfile')
  Route.get('/change-password', "UsersController.showChangePassword")
  Route.patch('/change-password', "UsersController.changePassword")

  Route.get('*', 'NotFoundController.index').as('notFound');
}).middleware('auth')
