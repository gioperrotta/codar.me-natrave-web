
import { addDays, format, formatISO, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale'

import { Icon } from '~/components/Icon'

export const DateSelect = ({currentDate, setCurrentDate}) => {
  const date = new Date(currentDate)

  const prevDay = () => {
    const newDate = subDays(date, 1)
    setCurrentDate(formatISO(newDate));
  }

  const nextDay = () => {
    const newDate = addDays(date, 1)
    setCurrentDate(formatISO(newDate));
  }

  return (
    <div className="flex items-center justify-center space-x-4 p-4">
      <Icon name="ArrowLeft" className="w-6 text-red-500" onClick={prevDay} />
      <span className="font-bold">{format(date,"d, 'de' MMMM", {locale: ptBR})}</span>
      <Icon name="ArrowRight" className="w-6 text-red-500" onClick={nextDay} />
    </div>
  )
}