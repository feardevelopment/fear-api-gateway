const { ServiceBroker } = require("moleculer");
const HTTPServer = require("moleculer-web");

const brokerNode1 = new ServiceBroker({
  nodeID: "node-1",
  transporter: "NATS",
  hotReload: true
})

brokerNode1.createService({
  name: "gateway",
  mixins: [HTTPServer],

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
  transporter: "NATS",
  hotReload: true
})

const brokerNode3 = new ServiceBroker({
  nodeID: "node-3",
  transporter: "NATS",
  hotReload: true
})

const brokerNode4 = new ServiceBroker({
  nodeID: "node-4",
  transporter: "NATS",
  hotReload: true
})

const brokerNode5 = new ServiceBroker({
  nodeID: "ANY",
  transporter: "NATS",
  hotReload: true
})

const brokerNode6 = new ServiceBroker({
  nodeID: "user-node",
  transporter: "NATS",
  hotReload: true
})
 

brokerNode2.loadService('./mocks/auth')
brokerNode3.loadService('./mocks/email')
brokerNode4.loadService('./mocks/studies')
brokerNode5.loadService('./mocks/any')
brokerNode6.loadService('./mocks/user')

  
Promise.all([brokerNode1.start(), brokerNode2.start(), brokerNode3.start(), brokerNode4.start(),  brokerNode5.start(), brokerNode6.start()]);
