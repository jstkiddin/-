import express from 'express'

export const create = async (req: express.Request, res: express.Response) => {
  console.log('here')
  try {
    const { email } = req.body
    return res.sendStatus(200).json(email).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
