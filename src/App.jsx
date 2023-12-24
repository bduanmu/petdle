import "./styles.css"
import logo from "./assets/Petdle_Logo.png"
import turtleSilhouette from "./assets/Turtle_silhouette.png"
import enterArrow from "./assets/Enter_Arrow.png"
import { useState } from "react";
import { pets } from "./pets.js";

console.log(logo);

export default function App() {
  const [newGuess, setNewGuess] = useState()

  return (
    <>
      <div className="background"></div>
      <div className="gameContainer">
        <img className="logo" src={logo} alt="Logo"/>
        <form className="guess">
          <div className="guessBox" style={{width: 345}}>
            <div className="inputBox">
              <img className="petImage" src={turtleSilhouette} alt="Turtle Silhouette"/>
              <input 
                className="input"
                type="text"
                required
                value={newGuess}
                placeholder={"Enter a pet"}
                onChange={e => setNewGuess(e.target.value)}
                onInvalid={e => e.target.setCustomValidity("Please enter a pet.")} 
              />
            </div>
          </div>
          <div className="guessBox" style={{width: 72}}>
            <div className="inputBox">
              <button className="enterButton">
                <img className="enterArrow" src={enterArrow} alt="Enter Arrow"/>
              </button>
            </div>
          </div>
        </form>
        <div >

        </div>
      </div>
    </>
  )
}