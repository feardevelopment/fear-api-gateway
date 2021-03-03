const { BrokerNode } = require("moleculer");


module.exports = {
    name: "any",
    actions: {
        call(ctx) {
            console.log(ctx.params);
            return ctx.call(ctx.params.service, ctx.params.params)
        }
    }
};