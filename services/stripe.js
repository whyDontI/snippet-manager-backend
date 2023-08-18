/**
 * @module services/stripe
 */

const stripeApiKey =
  "sk_test_51MgcWzKrdCDpdCy0bXFPlJXeavvOdgd1NqauHudzXYSRox2iSGsvsTRcuJoz8o085cduM1xU8Gs6sF9goQvwIGmQ000UtEb9m4";

const stripePromise = require("stripe")(stripeApiKey);

/**
 * Add customer to stripe
 *
 * @param {object} org Either vendor or dispensary obj
 * @param {object} user
 * @returns {StripeCustomer} customer
 */
const addStripeCustomer = async (org, user = null) => {
  try {
    const stripe = await stripePromise;
    const customer = await stripe.customers.create({
      address: {
        line1: org.streetAddress,
        line2: org.address2,
        city: org.city,
        state: org.state,
        postal_code: org.zipCode,
        country: org.country, // Should be ISO_3166-1 alpha-2 encoded
      },
      ...(user && { email: user.email.toLowerCase() }), // Exclude email if null
      name: org.name,
    });

    return customer;
  } catch (error) {
    logger.error("error adding customer in Stripe", error);
    throw error;
  }
};

/**
 * Create a Stripe checkout session
 *
 * @param {string} successUrl url to redirect after successful checkout
 * @param {string} cancelUrl url to redirect after un-successful checkout
 * @param {object} items list of items for checkout
 * @param {string} items.price stripe price_id from dashboard
 * @param {number} items.quantity
 * @param {string} customerId
 * @returns {Session object} Stripe session object
 */
const createCheckoutSession = async (
  successUrl,
  cancelUrl,
  items,
  customerId,
  mode = "subscription"
) => {
  try {
    return stripePromise.checkout.sessions.create({
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: items,
      customer: customerId,
      mode,
    });
  } catch (error) {
    logger.error(
      "Error creating checkout session in services/stripe.js ",
      error
    );
    return Promise.reject(error);
  }
};

module.exports = {
  addStripeCustomer,
  createCheckoutSession,
};
