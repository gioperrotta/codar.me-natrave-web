import {ReactComponent as ArrowLeft} from './svgs/arrow-left.svg'
import {ReactComponent as ArrowRight} from './svgs/arrow-right.svg'
import {ReactComponent as Back} from './svgs/back.svg'
import {ReactComponent as  Profile} from './svgs/profile.svg'

const icons = {
  ArrowLeft,
  ArrowRight,
  Back,
  Profile
}

export function Icon({ name, ...props }) {
  const Element = icons[name]
  return <Element {...props}/>
}