import axios from "axios"
import { accessToken } from "./moocfi"

const BASE_URL = "https://quizzes.mooc.fi"
const COURSE_IDENTIFIER = "e3d417e5-baac-4bcd-b2ea-3c87739970cf"
const TIMEOUT = 10000

export async function fetchQuizzesProgress(exerciseName) {
  const res = await axios.get(
    `${BASE_URL}/api/v1/courses/${COURSE_IDENTIFIER}/users/current/progress`,
    {
      timeout: TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken()}`,
      },
    },
  )
  return res.data?.points_by_group
}

export async function postAnswerData(answerObject) {
  const res = await axios.post(
    `${BASE_URL}/api/v1/quizzes/answer`,
    answerObject,
    {
      timeout: TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken()}`,
      },
    },
  )
  return res.data
}

export async function getQuizData(quizId) {
  const res = await axios.get(`${BASE_URL}/api/v1/quizzes/${quizId}`, {
    timeout: TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken()}`,
    },
  })
  return res.data
}
