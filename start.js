const { ServiceBroker } = require("moleculer");
const HTTPServer = require("moleculer-web");

const brokerNode1 = new ServiceBroker({
  nodeID: "node-1",
  transporter: "NATS"
})

brokerNode1.createService({
  name: "gateway",
  mixins: [HTTPServer],

  settings: {
    routes: [
      {
        aliases: {
          "POST /register": "auth.register",
          "POST /login": "auth.login",
          "POST /validate": "auth.validate"
        },
        cors: {
          origin: ["http://localhost:4200"],
          methods: ["GET", "OPTIONS", "POST"],
          credentials: false
        },
      }
    ]
  }
})




const brokerNode2 = new ServiceBroker({
  nodeID: "node-2",
  transporter: "NATS"
})



const auth = {
  tokens: {

  },
  users: {
    "asda@asda.asda": {
      userdata: {
        email: "asda@asda.asda"
      },
      password: "pwhsh"
    }
  }
}

function validateLogin(email, password) {
  return auth.users[email]?.password === password
}

function getUserByToken(token) {
  return auth.users[auth.tokens[token]]?.userdata
}

brokerNode2.createService({
  name: "auth",

  actions: {
    register(ctx) {
      if (!auth.users[ctx.params.email]) {
        auth.users[ctx.params.email] = {
          userdata: {
            email: ctx.params.email
          },
          password: ctx.params.password
        }
        return 'OK'
      }
      return 'REGISTRATION FAILED'
    },
    login(ctx) {
      if (validateLogin(ctx.params.email, ctx.params.password)) {
        let token = 'token__' + ctx.params.email
        auth.tokens[token] = ctx.params.email
        return token
      }
      return 'LOGIN FAILED'
    },
    validate(ctx) {
      let user = getUserByToken(ctx.params.token)
      if (!user) {
        return 'TOKEN INVALID'
      }
      return user
    }
  }
})

Promise.all([brokerNode1.start(), brokerNode2.start()]);