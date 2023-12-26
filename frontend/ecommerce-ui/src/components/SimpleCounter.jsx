import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "../redux/counter";

export default function SimpleCounter() {
  const { value } = useSelector((state) => state.counter);
  console.log(value, " is the current count");
  const dispatch = useDispatch();
  return (
    <div className="counter">
      <h1>The count is : {value}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}
