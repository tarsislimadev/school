const { NotFoundError } = require('/escola/commons/errors')
const db = require('/escola/commons/db')
const loginIndex = db.in('logins')
const userIndex = db.in('users')

module.exports = ({ body: { email } }, res) => {
  const user = userIndex.find({ email })

  if (!user) {
    throw new NotFoundError('User not found.', { email })
  }

  const login = loginIndex.new()

  login.writeMany({
    user_id: user.getId(),
    created_at: Date.now().toString()
  })

  return res.json({ token: login.getId() })
}
