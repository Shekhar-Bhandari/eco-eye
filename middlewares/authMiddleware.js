import JWT from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    // get token
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(400).send({
        success: false,
        message: "Please provide Auth token",
      });
    }

    const token = authHeader.split(" ")[1];
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Un-Authorized user",
        });
      } else {
        req.body.id = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Please provide Auth token",
      error,
    });
  }
};

export default authMiddleware;
