const test = require('tape')
const { 'api-scheduled-backwardango': job } = require('.')

//
// Create a mock request and response method
//

function status (code) {
  this.statusCode = code
  return this
}

function send (obj) {
  const body = { ...this, ...obj }
  return body
}

const res = {
  status,
  send
}

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('pass - run scheduled job', async t => {
  const { err, data, statusCode } = await job(null, res)
  t.ok(!err)
  t.ok(data)
  t.equals(statusCode, 200)
  t.end()
})
