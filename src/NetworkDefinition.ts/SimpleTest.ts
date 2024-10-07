import { Cell } from "ppropogator/Cell/Cell"

import { c_multiply } from "ppropogator/BuiltInProps"
import { tell } from "ppropogator/ui"


export function operation(){
    const x = new Cell("x")
    const y = new Cell("y")
    const z = new Cell("z")

    c_multiply(x, y, z)

    
}

