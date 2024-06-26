import express from 'express'
import * as dotenv from 'dotenv'
import axios from 'axios'
import { generateRandomCode } from '../helpers'

dotenv.config()

const CONSUMER_KEY = process.env.CONSUMER_KEY
const CONSUMER_SECRET = process.env.CONSUMER_SECRET
const STORE_DOMAIN = process.env.STORE_DOMAIN
console.log(CONSUMER_KEY, CONSUMER_SECRET, STORE_DOMAIN)

export const create = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.sendStatus(400)
    }

    const data = {
      code: await generateRandomCode(8),
      discount_type: 'percent',
      amount: '15',
      individual_use: true,
      exclude_sale_items: true,
      date_expires: new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toISOString()
        .split('T')[0],
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
        return res.json({ code: data.code }).end()
      } else {
        return res.sendStatus(502)
      }
    } catch (error) {
      return res.sendStatus(502)
    }

    return res.json(email).status(200)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
