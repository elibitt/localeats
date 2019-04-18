const bcrypt = require('bcrypt')

const hash = (password) => {
  const hashed = bcrypt.hashSync(password, 10)
  return hashed
}

const compare = (password, hashedPass) => {
  return bcrypt.compareSync(password, hashedPass)
}

module.exports = {
  hash,
  compare
}
