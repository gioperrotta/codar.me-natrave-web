import { useEffect, useState } from 'react';
import { useLocalStorage, useAsyncFn } from 'react-use'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { Icon, Card, DateSelect } from "~/components";
import { format, formatISO } from 'date-fns'

export function Dashboard() {
  const [auth, setAuth] = useLocalStorage('auth', {})
  const [currentDate, setCurrentDate] = useState(formatISO(new Date(2022, 10, 20)))
  const navigate = useNavigate()

  const [hunches, fetchHunches] = useAsyncFn(async () => {
    const res = await axios({
      method: 'get',
      baseURL: import.meta.env.VITE_API_URL,
      url: `/${auth.user.username}`,
    })

    const hunches = res.data.hunches.reduce((acc, hunch) => {
      acc[hunch.gameId] = hunch
      return acc
    }, {})

    return hunches
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

  const isLoading = games.loading || hunches.loading
  const hasError = games.error || hunches.error
  const isDone= !isLoading && !hasError

  const logout = () => {
    setAuth({})
    navigate('/login')
  }

  if (!auth?.user?.id) {
    return <Navigate to="/" replace={true} />
  }

  useEffect(() => {
    fetchGames({ gameTime: currentDate })
    fetchHunches()
  }, [currentDate])

  return (
    <>
      <header className="bg-red-500 text-white">
        <div className="container max-w-3xl flex justify-between p-4 " >
          <img src="/imgs/logo-fundo-vermelho.svg" className="w-28 md:w-40 " />
          <div className="flex items-center font-bold text-xl space-x-2">
            <a href={`/${auth?.user?.username}`}>
              <Icon name="Profile" className="w-10" />
            </a>
            <div onClick={logout} className="p-2 cursor-pointer" >
              Sair
            </div>
          </div>
        </div>
      </header>
      <main className="space-y-6">
        <section id="header" className=" bg-red-500 text-white">
          <div className="container max-w-3xl space-y-2  p-4 ">
            <span className="">{`Olá ${auth?.user?.name}`}</span>
            <h3 className="text-2xl font-bold">Qual é 0 seu palpite?</h3>
          </div>
        </section>

        <section id="content" className="container max-w-3xl p-4 space-y-4" >

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
                  homeTeamScore={hunches?.value?.[game.id]?.homeTeamScore || 0}
                  awayTeamScore={hunches?.value?.[game.id]?.awayTeamScore || 0}
                />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}