'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

/**
 * Order.js controller
 *
 * @description: A set of functions called "actions" for managing `Order`.
 */

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
    /**
   * Create a/an order record.
   *
   * @return {Object}
   */

   create: async (ctx) => {
     const { address, amount, dishes, token, city, state } = JSON.parse(ctx.request.body);
     // const sripeAmount = Math.floor(amount * 100);
     // charge on stripe
     // todo: verify that amount

     const charge = await stripe.charges.create({
       amount,
       currency: "usd",
       description: `Order ${new Date()} by ${ctx.state.user.email}`,
       source: token,
     });

     // register the order in the database
     // todo: store list of dishes from the order in content type orderDetail
     const order = await strapi.services.order.create({
       user: ctx.state.user.email,
       charge_id: charge.id,
       amount,
       address,
       dishes,
       city,
       state,
     });

     return order;
   }
};
