const jwt = require("jsonwebtoken")

const authMiddlewares = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Not authorized" })
  }

  try {
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    

    req.user = {
      id: decoded.id,
      role: decoded.role,
      branchId: decoded.branchId 
    }
  
    

    next()
  } catch (error) {
    return res.status(401).send({ message: "Token invalid" })
  }
}

module.exports = authMiddlewares
