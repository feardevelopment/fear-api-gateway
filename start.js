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
    cors: {
      // Configures the Access-Control-Allow-Origin CORS header.
      origin: "*",
      // Configures the Access-Control-Allow-Methods CORS header. 
      methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
      // Configures the Access-Control-Allow-Headers CORS header.
      allowedHeaders: [],
      // Configures the Access-Control-Expose-Headers CORS header.
      exposedHeaders: [],
      // Configures the Access-Control-Allow-Credentials CORS header.
      credentials: false,
      // Configures the Access-Control-Max-Age CORS header.
      maxAge: 3600
  },
  },

  settings: {
    routes: [
      {
        aliases: {
          "POST /user/register": "user.registerUser",
          "POST /auth/login": "auth.login",
          "POST /validate": "auth.validate",

          //training
          "GET /studies/trainings/available": "studies.getAvailableTrainings",
          "POST /user/training/new": "user.setTraining",

          //emails
          "GET /user/mailbox": "email.getMailBox",
          "GET /user/mailbox/:uid": "email.getMail",
          "POST /user/mailbox/generate": "email.generateMailsForUser",

          // any
          "POST /any/call": "any.call"
        },
        cors: {
          origin: ["http://localhost:4200", "https://localhost:4000"],
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

const brokerNode3 = new ServiceBroker({
  nodeID: "node-3",
  transporter: "NATS"
})

const brokerNode4 = new ServiceBroker({
  nodeID: "node-4",
  transporter: "NATS"
})

const brokerNode5 = new ServiceBroker({
  nodeID: "ANY",
  transporter: "NATS"
})

const brokerNode6 = new ServiceBroker({
  nodeID: "user-node",
  transporter: "NATS"
})


brokerNode2.createService(require('./mocks/auth'))
brokerNode3.createService(require('./mocks/email'))
brokerNode4.createService(require('./mocks/studies'))
brokerNode5.createService(require('./mocks/any'))
brokerNode6.createService(require('./mocks/user'))
/*
(new ServiceBroker({
  nodeID: "node-5",
  transporter: "NATS"
})).createService(require('./mocks/email'))
*/

  
Promise.all([brokerNode1.start(), brokerNode2.start(), brokerNode3.start(), brokerNode4.start(),  brokerNode5.start(), brokerNode6.start()]);