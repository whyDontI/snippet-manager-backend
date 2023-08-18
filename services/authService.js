const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prisma.js");

/**
 * Generates the JWT
 *
 * @param payload {Object} - Payload to be added in the JWT
 * @return {String} - Generated JWT
 */
const generateAuthToken = (payload) => {
  return jwt.sign(payload, config.get("userAccessToken.privateKey"), {
    algorithm: "RS256",
    expiresIn: config.get("userAccessToken.ttl"),
  });
};

/**
 * Verifies if the JWT is valid. Throws error in case of signature error or expiry
 *
 * @param token {String} - JWT to be verified
 * @return {Object} - Decode value of JWT
 */
const verifyAuthToken = (token) => {
  return jwt.verify(token, config.get("userAccessToken.publicKey"), {
    algorithms: ["RS256"],
  });
};

/**
 * Decodes the JWT. This is irrespective of the signature error or expiry
 *
 * @param token {String} - JWT to be decoded
 * @return {Object} - Decode value of JWT
 */
const decodeAuthToken = (token) => {
  return jwt.decode(token);
};

/**
 * Login or signUp with Google
 * @param googleProfile{Object} : Google profile response from Google OAuth2.0
 */
const loginOrSignupWithGoogle = async (googleProfile) => {
  try {
    const user = await prisma.investors.findUnique({
      where: {
        email: googleProfile?.email,
      },
    });

    if (user) {
      return user;
    } else {
      logger.info(
        `User with email ${googleProfile?.email} does not exist. Creating new account.`
      );
      const createdUser = await prisma.investors.create({
        data: {
          email: googleProfile?.email,
          firstname: googleProfile?.given_name,
          lastname: googleProfile?.family_name,
          emailVerified: true,
          googleProfileId: googleProfile?.sub,
        },
      });

      return createdUser;
    }
  } catch (err) {
    logger.error("loginOrSignupWithGoogle:: Error in authenticating user", {
      err,
    });

    throw new Error("");
  }
};

module.exports = {
  generateAuthToken,
  verifyAuthToken,
  decodeAuthToken,
  loginOrSignupWithGoogle,
};
