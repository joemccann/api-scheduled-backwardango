const { 'api-backwardango': backwardango } = require('api-backwardango')
const { 'api-bigquery': bigquery } = require('api-bigquery')
const debug = require('debug')('api:scheduled:backwardango')

function status (code) {
  this.statusCode = code
  return this
}

function send (obj) {
  const body = { ...this, ...obj }
  return body
}

const mockRes = {
  status,
  send
}

exports['api-scheduled-backwardango'] = async (_req, res) => {
  const {
    env: {
      DATASET: dataset = '',
      TABLE_NAME: tableName = ''
    }
  } = process

  const pairs = [
    { spot: '.BXBT', futures: 'XBTM19', exchange: 'Bitmex' },
    { spot: '.BXBT', futures: 'XBTU19', exchange: 'Bitmex' }
  ]

  const network = []
  const normalizedNet = []
  const normalizedDb = []

  let networkResults = null

  pairs.forEach(async pair => {
    const req = {
      body: pair
    }
    network.push(backwardango(req, mockRes))
  })

  try {
    networkResults = await Promise.all(network)
  } catch (err) {
    return res.status(404).send({ err: err.message || err })
  }

  networkResults.forEach((result, i) => {
    result = result.data
    normalizedNet.push({ ...result, ctime: Date.now() })
  })

  debug(normalizedNet)

  const req = {
    method: 'POST',
    body: {
      dataset,
      tableName,
      insert: true,
      rows: normalizedNet
    }
  }
  const { err } = await bigquery(req, mockRes)

  if (err) {
    return res.status(404).send({ err: err.message })
  }

  normalizedDb.push({ pairs, result: 'OK' })

  const data = {
    db: normalizedDb,
    network: normalizedNet
  }

  debug(data.db)
  debug(data.network)

  return res.status(200).send({ data })
}
