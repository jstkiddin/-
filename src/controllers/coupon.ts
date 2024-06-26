import express from 'express'

export const create = (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body
    return res.sendStatus(200).json(email).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
