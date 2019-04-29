import axios from "axios"
import { accessToken } from "./moocfi"

const BASE_URL = "https://crowdsorcerer.testmycode.io"

export async function fetchCrowdsorcererProgress() {
  const res = await axios.get(
    `${BASE_URL}/api/v0/users/current/progress?course=musiikin-teoria&oauth_token=${accessToken()}`,
  )
  return res.data?.points_by_group
}
