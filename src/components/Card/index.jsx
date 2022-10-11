import { useLocalStorage } from 'react-use'

import axios from 'axios'
import { useFormik } from 'formik'
import * as yup from 'yup'


const validationSchema = yup.object().shape({
  homeTeamScore: yup.string().required(),
  awayTeamScore: yup.string().required()
});

export const Card = ({disabled, gameId, homeTeam, awayTeam, gameTime, homeTeamScore, awayTeamScore }) => {
  const [auth] = useLocalStorage('auth')

  const formiK = useFormik({
    onSubmit: async (values) => {
      await axios({
        method: 'post',
        baseURL: import.meta.env.VITE_API_URL,
        url: '/hunches',
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
        data: {
          ...values,
          gameId
        }
      })
    },
    initialValues: {
      homeTeamScore,
      awayTeamScore
    },
    validationSchema
  })

  return (
    <div className="border border-gray-300 rounded-xl p-4 text-center space-y-4">
      <span className="text-sm md:text-base text-gray-700 font-bold">{gameTime}</span>

      <form className="flex items-center justify-center space-x-4">
        <span className="uppercase  text-gray-700 font-bold">{homeTeam}</span>
        <img src={`/imgs/flags/${homeTeam}.png`} alt="" />

        <input
          className="bg-red-300/[0.2] w-12 h-12 text-red-700 text-xl text-center"
          type="number"
          name="homeTeamScore"
          value={formiK.values.homeTeamScore}
          onChange={formiK.handleChange}
          onBlur={formiK.handleSubmit}
          disabled={disabled}
        />

        <span className="mx-4 text-red-500 font-bold">X</span>

        <input
          className="bg-red-300/[0.2] w-12 h-12 text-red-700 text-xl text-center"
          type="number"
          name="awayTeamScore"
          value={formiK.values.awayTeamScore}
          onChange={formiK.handleChange}
          onBlur={formiK.handleSubmit}
          disabled={disabled}
        />

        <img src={`/imgs/flags/${awayTeam}.png`} alt="" />
        <span className="uppercase  text-gray-700 font-bold">{awayTeam}</span>
      </form>
    </div>
  )
}