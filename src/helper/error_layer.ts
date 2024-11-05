import { register_predicate } from "generic-handler/Predicates";
import { is_layered_object } from "sando-layer/Basic/LayeredObject";
import { error_layer } from "sando-layer/Specified/ErrorLayer";

export const object_has_error = register_predicate("object_has_error",
    (a: any) => is_layered_object(a) && error_layer.has_value(a)
)