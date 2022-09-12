import Add from "./add";
import Mutiply from "./mutiply";
import {once} from "lodash";
const onceAdd = once(Add);
const AddResult = onceAdd(1,2);
const MutiplyResult = Mutiply(3,4);
console.log(AddResult);
console.log(MutiplyResult);
