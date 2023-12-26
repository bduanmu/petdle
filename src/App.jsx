import React, { useState } from "react";
import "./styles.css"
import logo from "./assets/Petdle_Logo.png"
import turtleSilhouette from "./assets/Turtle_silhouette.png"
import enterArrow from "./assets/Enter_Arrow.png"
import turtlePackIcon from "./assets/pack_icons/Turtle Pack_Icon.png"
import goldenPackIcon from "./assets/pack_icons/Golden Pack_Icon.png"
import puppyPackIcon from "./assets/pack_icons/Puppy Pack_Icon.png"
import starPackIcon from "./assets/pack_icons/Star Pack_Icon.png"
import weeklyPackIcon from "./assets/pack_icons/Weekly Pack_Icon.png"
import { pets, petImages, petNames } from "./pets.jsx";

const correctPetIndex = Math.floor(Math.random() * petNames.length)
const correctPet = pets[correctPetIndex]

const WRONG_COLOUR = ["#676767", "#414141"]
const CLOSE_COLOUR = ["#EDB82E", "#CB8F35"]
const CORRECT_COLOUR = ["#28C223", "#269624"]
const PACK_IMAGE_HEIGHT = [50, 35, 25, 21, 15]
const PACK_ICONS = {
  "Turtle Pack": turtlePackIcon, 
  "Golden Pack": goldenPackIcon, 
  "Puppy Pack": puppyPackIcon,
  "Star Pack": starPackIcon,
  "Weekly Pack": weeklyPackIcon
}

console.log(petNames[correctPetIndex])

export default function App() {
  const [newGuess, setNewGuess] = useState('')
  const [guessImage, setGuessImage] = useState(turtleSilhouette)
  const [guessedPets, setGuessedPets] = useState([])
  const [hints, setHints] = useState([])

  function handleGuess(e) {
    e.preventDefault()

    const petIndex = petNames.indexOf(newGuess.toLowerCase())

    if (petIndex != -1 && !guessedPets.includes(petIndex)) {
      setGuessedPets(currentGuess => {
        return [petIndex, ...currentGuess]
      })
      setGuessImage(turtleSilhouette)

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
          <div className="guessBox" style={{width: 545}}>
            <div className="inputBox">
              <div className="petImageBox">
                <img className="petImage" src={guessImage} alt="Turtle Silhouette" title="Turtle Silhouette"/>
              </div>
              <input 
                className="input"
                type="text"
                required
                value={newGuess}
                placeholder={"Enter a pet"}
                onChange={e => {
                  const input = e.target.value
                  setNewGuess(input)
                  if (petNames.includes(input.toLowerCase())) {
                    setGuessImage(petImages[petNames.indexOf(input.toLowerCase())])
                  } else {
                    setGuessImage(turtleSilhouette)
                  }
                }}
              />
            </div>
            <div style={{marginTop: 15}}>
              {pets.filter((_pet, index) => {
                const searchTerm = newGuess.toLowerCase();
                const petName = petNames[index];

                return petName.includes(searchTerm) && searchTerm && !petNames.includes(searchTerm)
              })
              .slice(0, 10)
              .map((pet, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setNewGuess(pet.name)
                      setGuessImage(petImages[petNames.indexOf(pet.name.toLowerCase())])
                    }}
                  >
                    {pet.name}
                  </div>
                )
              })}
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
          {hints.map((hint, index) => {
            return (
              <li key={index} className="guessListObject">
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
                            src={PACK_ICONS[pack]}
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