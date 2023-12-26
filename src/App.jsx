import React, { useState } from "react";
import "./styles.css"
import logo from "./assets/Petdle_Logo.png"
import turtleSilhouette from "./assets/Turtle_silhouette.png"
import enterArrow from "./assets/Enter_Arrow.png"
import { pets, petImages, petNames } from "./pets.jsx";

const correctPetIndex = Math.floor(Math.random() * petNames.length)
const correctPet = pets[correctPetIndex]

const WRONG_COLOUR = ["#676767", "#414141"]
const CLOSE_COLOUR = ["#EDB82E", "#CB8F35"]
const CORRECT_COLOUR = ["#32ED2E", "#2CA02A"]
const PACK_IMAGE_HEIGHT = [50, 35, 25, 21, 15]

console.log(petNames[correctPetIndex])

export default function App() {
  const [newGuess, setNewGuess] = useState('')
  const [guessedPets, setGuessedPets] = useState([])
  const [hints, setHints] = useState([])

  function handleGuess(e) {
    e.preventDefault()

    const petIndex = petNames.indexOf(newGuess.toLowerCase())

    if (petIndex != -1 && !guessedPets.includes(petIndex)) {
      setGuessedPets(currentGuess => {
        return [petIndex, ...currentGuess]
      })

      const hint = {
        "pet": pets[petIndex], 
        "pet_image": petImages[petIndex],
        "pet_colour": WRONG_COLOUR, 
        "tier": WRONG_COLOUR, 
        "pack": WRONG_COLOUR,
        "attack": WRONG_COLOUR, 
        "health": WRONG_COLOUR, 
        "ability": WRONG_COLOUR
      }
      
      if (petIndex == correctPetIndex) {
        console.log("win")
        hint.pet_colour = CORRECT_COLOUR
      }
      if (hint.pet.tier == correctPet.tier) {
        hint.tier = CORRECT_COLOUR
      } else if (Math.abs(hint.pet.tier - correctPet.tier) == 1) {
        hint.tier = CLOSE_COLOUR
      }
      if (JSON.stringify(hint.pet.pack.toSorted()) == JSON.stringify(correctPet.pack.toSorted())) {
        hint.pack = CORRECT_COLOUR
      } else if (hint.pet.pack.some(r => correctPet.pack.includes(r))) {
        hint.pack = CLOSE_COLOUR
      }
      if (hint.pet.attack == correctPet.attack) {
        hint.attack = CORRECT_COLOUR
      } else if (Math.abs(hint.pet.attack - correctPet.attack) == 1) {
        hint.attack = CLOSE_COLOUR
      }
      if (hint.pet.health == correctPet.health) {
        hint.health = CORRECT_COLOUR
      } else if (Math.abs(hint.pet.health - correctPet.health) == 1) {
        hint.health = CLOSE_COLOUR
      }
      if (hint.pet.ability == correctPet.ability) {
        hint.ability = CORRECT_COLOUR
      }

      setHints(currentHints => {
        return [hint, ...currentHints]
      })

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
          {hints.map(hint => {
            return (
              <li key={hint.pet.name} className="guessListObject">
                <div className="infoBox">
                  <div className="infoBoxOuter" style={{backgroundColor: hint.pet_colour[1]}}>
                    <div className="infoBoxInner" style={{fontSize: 20, backgroundColor: hint.pet_colour[0]}}>
                      <img
                        className="hintPetImage" 
                        src={hint.pet_image} 
                        alt={hint.pet.name} 
                        title={hint.pet.name}
                      />
                    </div>
                  </div>
                </div>
                <div className="infoBox">
                  <div className="infoBoxOuter" style={{backgroundColor: hint.tier[1]}}>
                    <div className="infoBoxInner" style={{fontSize: 40, backgroundColor: hint.tier[0]}}>
                      <label>{hint.pet.tier}</label>
                    </div>
                  </div>
                </div>
                <div className="infoBox">
                  <div className="infoBoxOuter" style={{backgroundColor: hint.pack[1]}}>
                      <div 
                        className="infoBoxInner" 
                        style={{
                          fontSize: 20, 
                          backgroundColor: hint.pack[0],
                        }}
                      >
                      {hint.pet.pack.map(pack => {
                        return (
                          <img
                            key={pack}
                            className="packImage" 
                            src={"src/assets/pack_icons/" + pack + "_Icon.png"} 
                            alt={pack} 
                            title={pack}
                            style={{height: PACK_IMAGE_HEIGHT[hint.pet.pack.length - 1]}}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="infoBox">
                  <div className="infoBoxOuter" style={{backgroundColor: hint.attack[1]}}>
                    <div className="infoBoxInner" style={{fontSize: 40, backgroundColor: hint.attack[0]}}>
                      <label>{hint.pet.attack}</label>
                    </div>
                  </div>
                </div>
                <div className="infoBox">
                  <div className="infoBoxOuter" style={{backgroundColor: hint.health[1]}}>
                    <div className="infoBoxInner" style={{fontSize: 40, backgroundColor: hint.health[0]}}>
                      <label>{hint.pet.health}</label>
                    </div>
                  </div>
                </div>
                <div className="infoBox">
                  <div className="infoBoxOuter" style={{backgroundColor: hint.ability[1]}}>
                    <div className="infoBoxInner" style={{backgroundColor: hint.ability[0]}}>
                      <label className="abilityLabel">{hint.pet.ability}</label>
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