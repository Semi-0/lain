
import { match } from "pmatcher/MatchBuilder"

export function make_matcher(expr: any[]){
    return (input: any) => {
      return match(input, expr)
    }
  }