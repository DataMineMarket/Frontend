import { env } from "@/env.mjs"
import axios, { AxiosResponse } from "axios"

const REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL?.toString() ??
      "http://localhost:3000/dashboard/upload/google-fit"
    : "http://localhost:3000/dashboard/upload/google-fit"
// const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.toString() ?? ""
const CLIENT_ID = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.toString() ?? ""
const CLIENT_SECRET = env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET?.toString() ?? ""

console.log("Client ID: ", CLIENT_ID)
console.log("ENV: ", process.env)

type OAuthTokenResponse = {
  access_token: string
  scope: string
  token_type: string
  expires_in: number
  refresh_token?: string // Optional property
}

// Upload google fit to ipfs using chainlink functions
// TODO: Implement this

// Obtain google fit data using chainlink functions
// TODO: Implement this
export const getGoogleFitData = async (): Promise<void> => {}

// Exchange the authorization code for tokens
// TODO: This should be done on the server side
export const exchangeCodeForTokens = async (
  code: string
): Promise<AxiosResponse<OAuthTokenResponse>> => {
  const params = new URLSearchParams()
  params.append("code", code)
  params.append("client_id", CLIENT_ID)
  params.append("redirect_uri", REDIRECT_URI)
  params.append("grant_type", "authorization_code")
  params.append("client_secret", CLIENT_SECRET)

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }

  const response = await axios.post(
    "https://oauth2.googleapis.com/token",
    params,
    config
  )
  return response
}

// Send tokens to chainlink functions

// Define sign in with google
// TODO: Improve this to use google api
export const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=code&scope=${encodeURIComponent(
  "https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.activity.write https://www.googleapis.com/auth/fitness.blood_glucose.read https://www.googleapis.com/auth/fitness.blood_glucose.write https://www.googleapis.com/auth/fitness.blood_pressure.read https://www.googleapis.com/auth/fitness.blood_pressure.write https://www.googleapis.com/auth/fitness.body.read https://www.googleapis.com/auth/fitness.body.write https://www.googleapis.com/auth/fitness.body_temperature.read https://www.googleapis.com/auth/fitness.body_temperature.write https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.heart_rate.write https://www.googleapis.com/auth/fitness.location.read https://www.googleapis.com/auth/fitness.location.write https://www.googleapis.com/auth/fitness.nutrition.read https://www.googleapis.com/auth/fitness.nutrition.write https://www.googleapis.com/auth/fitness.oxygen_saturation.read https://www.googleapis.com/auth/fitness.oxygen_saturation.write https://www.googleapis.com/auth/fitness.reproductive_health.read https://www.googleapis.com/auth/fitness.reproductive_health.write https://www.googleapis.com/auth/fitness.sleep.read https://www.googleapis.com/auth/fitness.sleep.write"
)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
