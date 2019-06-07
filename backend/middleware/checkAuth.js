const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Выделяет информацию пользователя, которая хранится в токене
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token);

    // Then we need to modify the an incoming request by adding an object to the property
    req.userData = {email: decodeToken.email, userId: decodeToken.userId};
    next();
  } catch (e) {
    res.status(401).json({e});
  }
};
