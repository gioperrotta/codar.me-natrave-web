import { useEffect, useState } from "react";
import { useAsyncFn, useLocalStorage } from "react-use";
import { useParams } from 'react-router-dom'

import axios from "axios";
import { format, formatISO } from "date-fns";

import { Icon, Card, DateSelect } from "~/components";

export function Profile() {
  const params = useParams()
//  const [auth, setAuth] = useLocalStorage('auth', {})
  const [currentDate, setCurrentDate] = useState(formatISO(new Date(2022, 10, 20)))

  const [user, fetchHunches] = useAsyncFn(async () => {
    const res = await axios({
      method: 'get',
      baseURL: import.meta.env.VITE_API_URL,
      url: `/${params.username}`,
    })

    const hunches = res.data.hunches.reduce((acc, hunch) => {
      acc[hunch.gameId] = hunch
      return acc
    }, {})

    const name = res.data.name
   
    return {
      name,
      hunches
    }
  })

  const [games, fetchGames] = useAsyncFn(async (params) => {
    const res = await axios({
      method: 'get',
      baseURL: import.meta.env.VITE_API_URL,
      url: '/games',
      params
    })
    return res.data
  })

  const isLoading = games.loading || user.loading
  const hasError = games.error || user.error
  const isDone = !isLoading && !hasError

  useEffect(() => {
    fetchHunches()
  }, [])

  useEffect(() => {
    fetchGames({ gameTime: currentDate })
  }, [currentDate])

  return (
    <>
      <header className="bg-red-500 text-white ">
        <div className="container max-w-3xl p-4 flex justify-between">
          <img src="/imgs/logo-fundo-vermelho.svg" className="w-28 md:w-40 " />
        </div>
      </header>
      <main className="space-y-6">
        <section id="header" className=" bg-red-500 text-white">
          <div className="container max-w-3xl space-y-2  p-4 ">
            <a href="/dashboard">
              <Icon name="Back" className="w-10" />
            </a>
            <h3 className="text-2xl font-bold">{user.value?.name}</h3>
          </div>
        </section>

        <section id="content" className="container max-w-3xl p-4 space-y-4" >

          <h2 className="text-red-500 text-xl font-bold">Seus palpites</h2>

          <DateSelect currentDate={currentDate} setCurrentDate={setCurrentDate} />

          <div className="space-y-4">
            {isLoading && 'Carregando jogos...'}
            {hasError && 'Ops! Algo deu errado'}

            {isDone && games.value?.map(game => (
              <Card
                key={game.id}
                gameId={game.id}
                homeTeam={game.homeTeam}
                awayTeam={game.awayTeam}
                gameTime={format(new Date(game.gameTime), 'H:mm')}
                homeTeamScore={user.value?.hunches?.[game.id]?.homeTeamScore || ''}
                awayTeamScore={user.value?.hunches?.[game.id]?.awayTeamScore || ''}
                disabled={true}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}