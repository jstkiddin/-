import * as dotenv from 'dotenv'
import sgMail from '@sendgrid/mail'
import * as fs from 'fs'
import { promisify } from 'util'

dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
const readFileAsync = promisify(fs.readFile)

export const send = async (email: string, code: string, date: string) => {
  const htmlTemplate = await readFileAsync(
    '../popups-server/src/assets/index.html',
    'utf-8'
  )

  const msg = {
    to: email,
    from: 'info@starkmedicalsupplies.com',
    subject: 'Get your 15% discount for StarkMed products!',
    html: htmlTemplate
      .replace('[code]', code)
      .replace(
        '[date]',
        `${date.split('-')[1]}-${date.split('-')[2]}-${date.split('-')[0]}`
      ),
  }
  try {
    console.log(date)

    await sgMail.send(msg)
    console.log('Email sent successfully')
    return 'Email sent successfully'
  } catch (error) {
    console.error('Error sending email:', error)
    if (error.response) {
      console.error(error.response.body)
    }
    return 'There is an error'
  }
}
