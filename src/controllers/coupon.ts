import express from 'express'
import * as dotenv from 'dotenv'
import axios from 'axios'
import { generateRandomCode } from '../helpers'
import { send } from './mailer'

dotenv.config()

const CONSUMER_KEY = process.env.CONSUMER_KEY
const CONSUMER_SECRET = process.env.CONSUMER_SECRET
const STORE_DOMAIN = process.env.STORE_DOMAIN

export const create = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.sendStatus(400)
    }

    const dateExp = new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .split('T')[0]

    const data = {
      code: await generateRandomCode(8),
      discount_type: 'percent',
      amount: '15',
      individual_use: true,
      usage_limit: 1,
      exclude_sale_items: true,
      date_expires: dateExp,
    }

    try {
      const response = await axios.post(
        `${STORE_DOMAIN}/wp-json/wc/v3/coupons`,
        data,
        {
          auth: {
            username: CONSUMER_KEY,
            password: CONSUMER_SECRET,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (response.data.id) {
        const emailRes = await send(email, data.code, dateExp)

        if (emailRes === 'Email sent successfully') {
          return res.sendStatus(200)
        } else {
          return res.sendStatus(502)
        }
      } else {
        return res.sendStatus(502)
      }
    } catch (error) {
      return res.sendStatus(502)
    }
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
