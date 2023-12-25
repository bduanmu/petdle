import React, { useState } from "react";
import "./styles.css"
import logo from "./assets/Petdle_Logo.png"
import turtleSilhouette from "./assets/Turtle_silhouette.png"
import enterArrow from "./assets/Enter_Arrow.png"
import { pets, petNames } from "./pets.jsx";

const correctPetIndex = Math.floor(Math.random() * petNames.length)
console.log(petNames[correctPetIndex])

export default function App() {
  const [newGuess, setNewGuess] = useState('')
  const [guessedPets, setGuessedPets] = useState([])

  function handleGuess(e) {
    e.preventDefault()

    const petIndex = petNames.indexOf(newGuess)

    if (petNames.includes(newGuess) && !guessedPets.includes(petIndex)) {
      setGuessedPets(currentGuess => {
        return [...currentGuess, petIndex]
      })
      if (petIndex == correctPetIndex) {
        console.log("win")
      }

      setNewGuess("")
    }

    console.log(guessedPets)
  }

  return (
    <>
      <div className="background"></div>
      <div className="gameContainer">
        <img className="logo" src={logo} alt="Logo"/>
        <form className="guess" onSubmit={handleGuess}>
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
        <ul className="guessList">
          <li className="guessListObject" style={{marginBottom: 10}}>
            <div className="listLabel">
              <label>Pet</label>
            </div>
            <div className="listLabel">
              <label>Tier</label>
            </div>
            <div className="listLabel">
              <label>Pack</label>
            </div>
            <div className="listLabel">
              <label>Attack</label>
            </div>
            <div className="listLabel">
              <label>Health</label>
            </div>
            <div className="listLabel">
              <label>Ability</label>
            </div>
          </li>
          {guessedPets.map(petIndex => {
            return (
              <li key={petIndex} className="guessListObject">
                <div className="infoBox">
                  <div className="infoBoxOuter">
                    <div className="infoBoxInner" style={{fontSize: 20}}>
                      <label>{pets[petIndex].name}</label>
                    </div>
                  </div>
                </div>
                <div className="infoBox">
                  <div className="infoBoxOuter">
                    <div className="infoBoxInner" style={{fontSize: 40}}>
                      <label>{pets[petIndex].tier}</label>
                    </div>
                  </div>
                </div>
                <div className="infoBox">
                  <div className="infoBoxOuter">
                    <div className="infoBoxInner" style={{fontSize: 20}}>
                      <label>{pets[petIndex].pack.join(', ')}</label>
                    </div>
                  </div>
                </div>
                <div className="infoBox">
                  <div className="infoBoxOuter">
                    <div className="infoBoxInner" style={{fontSize: 40}}>
                      <label>{pets[petIndex].attack}</label>
                    </div>
                  </div>
                </div>
                <div className="infoBox">
                  <div className="infoBoxOuter">
                    <div className="infoBoxInner" style={{fontSize: 40}}>
                      <label>{pets[petIndex].health}</label>
                    </div>
                  </div>
                </div>
                <div className="infoBox">
                  <div className="infoBoxOuter">
                    <div className="infoBoxInner">
                      <label className="abilityLabel">{pets[petIndex].ability}</label>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}