import express from 'express'
import { create } from '../controllers/coupon'

export default (router: express.Router) => {
  router.post('/generate', create)
}
