import { useReducer } from 'react';
import './style.css';
import DigitButtons from './DigitButtons';
import OperationButton from './OperationButton';

export const ACTION = {
  ADD_DIGIT: `add-digit`,
  CHOOSE_OPERATION: `choose-operation`,
  CLEAR: `clear`,
  DELETE_DIGIT: `delete-digit`,
  EVALUATE: `evaluate`
}

function reducer(state, {type, payload}){
  switch(type){
    case ACTION.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
            curOperand: payload.overwrite,
            overwrite: false
        }
      }
      if(payload.digit === "0" && state.curOperand === "0") {
        return state
      }
      if(payload.digit === "." && state.curOperand.includes(".")) {
        return state
      }


    return {
      ...state,
      curOperand: `${state.curOperand || ""}${payload.digit}`
    }
    case ACTION.CHOOSE_OPERATION:
      if(state.curOperand == null && state.preOperand == null){
        return state
      }

        if(state.curOperand == null){
          return{
            ...state,
          operation: payload.operation,
        }
      }



      if (state.preOperand == null){
        return{
          ...state,
          operation: payload.operation,
          preOperand: state.curOperand,
          curOperand: null
        }
      }

      return{
        ...state,
        preOperand: evaluate(state),
        operation: payload.operation,
        curOperand: null
      }

    case ACTION.CLEAR:
      return{};
    case ACTION.DELETE_DIGIT:
      if(state.overwrite) {
        return{
         ...state, 
          overwrite: false,
          curOperand: null
        }
      }
      if(state.curOperand == null) return state
      if(state.curOperand.length === 1) {
        return{
          ...state,
           curOperand: null
        }
      }

      return{
        ...state,
          curOperand: state.curOperand.slice(0, -1)
      }
    case ACTION.EVALUATE: 
      if(state.operation == null || state.curOperand == null || state.preOperand == null){
          return state
      }
      return{
        ...state,
          overwrite: true,
          preOperand: null,
          operation: null,
          curOperand: evaluate(state)
      }
  }
}

function evaluate({ curOperand, preOperand, operation}){
  const prev = parseFloat(preOperand)
  const current = parseFloat(curOperand)
  if (isNaN(prev) || isNaN(current)) return ""

  let computation = ""
  switch(operation){
    case "+":
      computation = prev + current;
      break
    case "-":
      computation= prev - current;
      break
    case "*":
      computation= prev * current;
      break
    case "/":
        computation= prev / current;
        break  
  }

  return computation.toString();
}

const INTEGER_FROMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits: 0
})
function formatOperand(operand){
  if(operand == null) return
  const [integer, decimal] = operand.split(".")
  if(decimal == null) return INTEGER_FROMATTER.format(integer)
  return `${INTEGER_FROMATTER.format(integer)}.${decimal}`
}


function App() {
  const [{  curOperand, preOperand, operation}, dispatch] = useReducer(
      reducer,
      {}
    );

  
  return (
    <>
      <div className="calculator-grid">
        <div className="output">
          <div className="previos-operand">{formatOperand(preOperand)} {operation}</div>
          <div className="currant-operand">{formatOperand(curOperand)}</div>
        </div>
        <button className="span-two" onClick={() => dispatch({type: ACTION.CLEAR})}>AC</button>
        <button onClick={() => dispatch({type: ACTION.DELETE_DIGIT})}>DEL</button>
        <OperationButton operation="/" dispatch={dispatch}/>
        <DigitButtons digit="1" dispatch={dispatch}/>
        <DigitButtons digit="2" dispatch={dispatch}/>
        <DigitButtons digit="3" dispatch={dispatch}/>
        <OperationButton operation="*" dispatch={dispatch}/>
        <DigitButtons digit="4" dispatch={dispatch}/>
        <DigitButtons digit="5" dispatch={dispatch}/>
        <DigitButtons digit="6" dispatch={dispatch}/>
        <OperationButton operation="+" dispatch={dispatch}/>
        <DigitButtons digit="7" dispatch={dispatch}/>
        <DigitButtons digit="8" dispatch={dispatch}/>
        <DigitButtons digit="9" dispatch={dispatch}/>
        <OperationButton operation="-" dispatch={dispatch}/>
        <DigitButtons digit="." dispatch={dispatch}/>
        <DigitButtons digit="0" dispatch={dispatch}/>
        <button className="span-two" onClick={() => dispatch({type: ACTION.EVALUATE})}>=</button>
      </div>
    </>
  )
}

export default App
