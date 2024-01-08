import React, { useState, useRef } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';

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
const COLOUR_TO_EMOJI = {"#28C223": '🟩', "#EDB82E": '🟨', "#676767": '⬛'}
const PACK_IMAGE_HEIGHT = ['90%', '60%', '45%', '35%', '25%']
const HINT_FONT_SIZE = "min(5vw, 40px)"
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
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [clipboard, setClipboard] = useState('')
  const [darkenScreen, setDarkenScreen] = useState(false)
  const [disableInput, setDisableInput] = useState(false)
  const [showResultButton, setShowResultButton] = useState(false)
  const [endMessage, setEndMessage] = useState("You Won!")

  const inputRef = React.useRef(null)

  function handleGuess(e) {
    e.preventDefault()

    inputRef.current.focus();

    const petIndex = petNames.indexOf(newGuess.toLowerCase())

    if (petIndex != -1 && !guessedPets.includes(petIndex)) {
      setGuessedPets(currentGuess => {
        return [...currentGuess, petIndex]
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
        hint.pet_colour = CORRECT_COLOUR
        setDisableInput(true)
        inputRef.current.blur()
        setEndMessage("You Won!")
        setShowResultButton(true)
        setTimeout(() => {
          setDarkenScreen(true)
        }, 1000)
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
        return [...currentHints, hint]
      })
      setClipboard(
        clipboard + '\n' + 
        COLOUR_TO_EMOJI[hint.tier[0]] + 
        COLOUR_TO_EMOJI[hint.pack[0]] + 
        COLOUR_TO_EMOJI[hint.attack[0]] + 
        COLOUR_TO_EMOJI[hint.health[0]] + 
        COLOUR_TO_EMOJI[hint.ability[0]]
      )
      
      setNewGuess("")
    }
  }

  return (
    <>
      <div className="gameContainer" style={disableInput ? {pointerEvents: "none"} : {}}>
        <img className="logo" src={logo} alt="Logo"/>
        <form className="guess" onSubmit={handleGuess}>
          <div className="guessAndSuggestionsBox">
            <div className="guessBox">
              <div className="inputBox">
                <div className="petImageBox">
                  <img className="petImage" src={guessImage} alt="Turtle Silhouette" title="Turtle Silhouette"/>
                </div>
                <input 
                  className="input"
                  ref={inputRef}
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
                    if (!petNames.includes(input.toLowerCase()) && pets.some((_pet, index) => petNames[index].includes(input.toLowerCase()))) {
                      setShowSuggestions(true)
                    } else {
                      setShowSuggestions(false)
                    }
                  }}
                  onFocus={e => {
                    const input = e.target.value
                    if (!petNames.includes(input.toLowerCase()) && pets.some((_pet, index) => petNames[index].includes(input.toLowerCase()))) {
                      setShowSuggestions(true)
                    }
                  }}
                  onBlur={() => {
                    setShowSuggestions(false)
                  }}
                />
              </div>
            </div>
            {showSuggestions ? <div className="suggestions">
              {pets.filter((_pet, index) => {
                const searchTerm = newGuess.toLowerCase();
                const petName = petNames[index];

                return petName.includes(searchTerm)
              })
              .map((pet, index) => {
                return (
                  <div
                    className="suggestionBox"
                    key={index}
                    onMouseDown={() => {
                      setNewGuess(pet.name)
                      setGuessImage(petImages[petNames.indexOf(pet.name.toLowerCase())])
                      setTimeout(() => {
                        inputRef.current.focus();
                      }, 0)
                    }}
                  >
                    <div className="petImageBox" style={{width: 50, height: 45}}>
                      <img className="petImage" src={petImages[petNames.indexOf(pet.name.toLowerCase())]} style={{maxWidth: 40, maxHeight: 40}}/>
                    </div>
                    {pet.name}
                  </div>
                )
              })}
            </div> : null}
          </div>
          <div className="enterBox" style={{width: 72}}>
            <div className="inputBox">
              <button className="enterButton">
                <img className="enterArrow" src={enterArrow} alt="Enter Arrow"/>
              </button>
            </div>
          </div>
        </form>
      </div>
      {guessedPets.length != 0 ? <li className="listLabels">
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
      </li> : null}
      <ul className="guessList">
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
                  <div className="infoBoxInner" style={{fontSize: HINT_FONT_SIZE, backgroundColor: hint.tier[0]}}>
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
                          style={{
                            height: PACK_IMAGE_HEIGHT[hint.pet.pack.length - 1]
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="infoBox">
                <div className="infoBoxOuter" style={{backgroundColor: hint.attack[1]}}>
                  <div className="infoBoxInner" style={{fontSize: HINT_FONT_SIZE, backgroundColor: hint.attack[0]}}>
                    <label>{hint.pet.attack}</label>
                  </div>
                </div>
              </div>
              <div className="infoBox">
                <div className="infoBoxOuter" style={{backgroundColor: hint.health[1]}}>
                  <div className="infoBoxInner" style={{fontSize: HINT_FONT_SIZE, backgroundColor: hint.health[0]}}>
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
      {showResultButton ? <div style={{display: "flex", justifyContent: "center"}}>
        <div className="resultsButtonOuter">
          <div className="resultsButtonInner">
            <button 
              className="resultsButton"
              onClick={() => {
                setDarkenScreen(true)
              }}
            >Results</button>
          </div>
        </div>
      </div> : null}
      {darkenScreen ? <div className="endOverlay">
        <div className="endScreen">
          <div className="topRow">
            <div style={{
              width: "3vw",
              height: "3vw",
              maxWidth: "36px",
              maxHeight: "36px"
            }}/>
            <div className="messagePanel">
              {endMessage}
            </div>
            <button 
              className="closeEndScreenButton" 
              onClick={() => {
                setDarkenScreen(false)
              }}
            >x</button>
          </div>
          <div>
            <div className="guessDisplayLabel">Your guesses:</div>
            <div className="guessDisplay">
              {hints.map((hint, index) => {
                return (
                  <img
                    key={index}
                    className="guessDisplayPetImage" 
                    src={hint.pet_image} 
                    alt={hint.pet.name} 
                    title={hint.pet.name}
                  />
                )
              })}
            </div>
          </div>
          <div className="copyButtonOuter">
            <div className="copyButtonInner">
              <CopyToClipboard text={"I solved the Petdle in " + guessedPets.length + " tries.\n" + clipboard}>
                <button className="copyButton">Copy</button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      </div> : null}
    </>
  )
}