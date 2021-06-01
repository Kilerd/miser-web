import {Position, Toaster} from "@blueprintjs/core";


let GLOBAL_TOASTER = null

export const getToaster = () => {
  if (GLOBAL_TOASTER === null) {
    GLOBAL_TOASTER = Toaster.create({className: "recipe-toaster", position: Position.TOP});
  }
  return GLOBAL_TOASTER;
}
