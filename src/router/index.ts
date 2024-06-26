import express from 'express'
import coupon from './coupon'
const router = express.Router()

export default (): express.Router => {
  coupon(router)
  return router
}
