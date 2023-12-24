import "./styles.css"
import logo from "./assets/Petdle_Logo.png"
import turtleSilhouette from "./assets/Turtle_silhouette.png"
import enterArrow from "./assets/Enter_Arrow.png"

console.log(logo);

export default function App() {
  return (
    <div className="gameContainer">
      <img className="logo" src={logo} alt="Logo"/>
      <form className="guess">
        <div className="guessBox" style={{width: 345}}>
          <div className="inputBox" style={{width: 345}}>
            <img className="petImage" src={turtleSilhouette} alt="Turtle Silhouette"/>
            <input className="input"/>
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
    </div>
  )
}