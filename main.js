const fastify = require('fastify')({ logger: true })
const dummy = require("./dummies/users.json")


// Declare a route
fastify.post('/login', async (request, reply) => {
    if(dummy[request.body.username]?.password === request.body.password){
        return { token: 'abcdefghijkl'+ request.body.username}
    }
  return { status: 'wrong username or password' }
})

fastify.post('/register', async (request, reply) => {
  if(!dummy[request.body.username]){
      dummy[request.body.username] = {
        password: request.body.password
      }
      return { message: 'Registration done!' }
  }
return { status: 'wrong username or password' }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()