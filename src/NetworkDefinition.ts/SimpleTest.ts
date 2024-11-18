import { construct_cell, type Cell } from "ppropogator/Cell/Cell"

import { c_multiply, p_add, p_multiply } from "ppropogator/Propagator/BuiltInProps"
import { enum_num_set, tell } from "ppropogator/Helper/UI"
import { p_amb } from "ppropogator/Propagator/Search"
import { public_state_message, set_global_state } from "ppropogator/Shared/PublicState"
import { PublicStateCommand } from "ppropogator/Shared/PublicState"
import { merge_value_sets } from "ppropogator/DataTypes/ValueSet"

export function operation(){
    set_global_state(PublicStateCommand.SET_CELL_MERGE, merge_value_sets)   
    set_global_state(PublicStateCommand.CLEAN_UP)
   
    const possibilities = enum_num_set(10, 20)

    const x = construct_cell("x")
    const y = construct_cell("y")
    const z = construct_cell("z")

    p_amb(x, possibilities)
    p_amb(y, possibilities) 
    p_amb(z, possibilities) 
    
    const x2 = construct_cell("x2")
    const y2 = construct_cell("y2")
    const z2 = construct_cell("z2")

    p_multiply(x, x, x2)
    p_multiply(y, y, y2)
    p_multiply(z, z, z2) 
    
    p_add(x2, y2, z2) 

    
}

