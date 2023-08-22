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
  Route.get('/jokes', 'JokesController.index')
  Route.get('/jokes/create', 'JokesController.create')
  Route.post('/jokes', 'JokesController.store')
  Route.get('/jokes/:id', 'JokesController.show')
  Route.put('/jokes/:id', 'JokesController.update')
  Route.delete('/jokes/:id', 'JokesController.destroy')
  Route.post('/jokes/:id/interactions', 'JokesController.interactions')
}).middleware('auth')