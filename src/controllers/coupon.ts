import express from 'express'

export const create = (req: express.Request, res: express.Response) => {
  try {
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
