const fastify = require('fastify')({ logger: true })
const dummy = require("./dummies/users.json")


// Declare a route
fastify.post('/login', async (request, reply) => {
    if(request.body.username === dummy.user1.username && request.body.password === dummy.user1.password){
        return {token: 'abcdefghijkl'}
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