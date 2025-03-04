import React, { useState, useRef, useEffect } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Confetti from "react-confetti";
import Countdown from "react-countdown"

import "./styles.css"

import logo from "./assets/Petdle_Logo.png"
import turtleSilhouette from "./assets/Turtle_silhouette.png"
import enterArrow from "./assets/Enter_Arrow.png"
import sapWinEmoji from "./assets/sap_win_emoji.png"
import turtlePackIcon from "./assets/pack_icons/Turtle Pack_Icon.png"
import goldenPackIcon from "./assets/pack_icons/Golden Pack_Icon.png"
import puppyPackIcon from "./assets/pack_icons/Puppy Pack_Icon.png"
import starPackIcon from "./assets/pack_icons/Star Pack_Icon.png"
import weeklyPackIcon from "./assets/pack_icons/Weekly Pack_Icon.png"
import unicornPackIcon from "./assets/pack_icons/Unicorn Pack_Icon.png"

import { pets, petImages, petNames, answers } from "./pets.jsx";

const date = new Date();
const now = Math.floor(Number(Date.now()) / (1000 * 60 * 60 * 24)) - 20119 // 20119 is Jan. 30th 2025
// console.log(Math.floor(Number(Date.now()) / (1000 * 60 * 60 * 24)))
// console.log(answers[now])
if (JSON.parse(localStorage.getItem("day")) !== now) {
  localStorage.setItem("day", JSON.stringify(now))
  localStorage.setItem("hints", JSON.stringify([]))
  localStorage.setItem("guessedPets", JSON.stringify([]))
  localStorage.setItem("clipboard", JSON.stringify(''))
  localStorage.setItem("darkenScreen", JSON.stringify(false))
  localStorage.setItem("disableInput", JSON.stringify(false))
  localStorage.setItem("showResultButton", JSON.stringify(false))
}
const tomorrow = new Date()
tomorrow.setTime((now + 1 + 20119) * (1000 * 60 * 60 * 24))
// console.log(Number(tomorrow))

const correctPetIndex = answers[now]
const correctPet = pets[correctPetIndex]

const EXAMPLE_PET_INDEX = petNames.indexOf("turtle")
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
  "Weekly Pack": weeklyPackIcon,
  "Unicorn Pack": unicornPackIcon
}

// console.log(petNames.indexOf("sloth"))

export default function App() {
  const [newGuess, setNewGuess] = useState('')
  const [guessImage, setGuessImage] = useState(turtleSilhouette)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [disableInfoButton, setDisableInfoButton] = useState(false)

  const [showInfo, setShowInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("visited")) === null ? true : false
  })
  const [guessedPets, setGuessedPets] = useState(() => {
    return JSON.parse(localStorage.getItem("guessedPets")) || []
  })
  const [hints, setHints] = useState(() => {
    return JSON.parse(localStorage.getItem("hints")) || []
  })
  const [clipboard, setClipboard] = useState(() => {
    return JSON.parse(localStorage.getItem("clipboard")) || ''
  })
  const [darkenScreen, setDarkenScreen] = useState(() => {
    return JSON.parse(localStorage.getItem("darkenScreen")) || false
  })
  const [disableInput, setDisableInput] = useState(() => {
    return JSON.parse(localStorage.getItem("disableInput")) || false
  })
  const [showResultButton, setShowResultButton] = useState(() => {
    return JSON.parse(localStorage.getItem("showResultButton")) || false
  })

  const [endMessage, setEndMessage] = useState("You Won!")

  const inputRef = React.useRef(null)

  useEffect(() => {
    localStorage.setItem("hints", JSON.stringify(hints))
    localStorage.setItem("guessedPets", JSON.stringify(guessedPets))
    localStorage.setItem("clipboard", JSON.stringify(clipboard))
    localStorage.setItem("darkenScreen", JSON.stringify(darkenScreen))
    localStorage.setItem("disableInput", JSON.stringify(disableInput))
    localStorage.setItem("showResultButton", JSON.stringify(showResultButton))
  })

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
        setDisableInfoButton(true)
        inputRef.current.blur()
        setEndMessage("You Won!")
        setShowResultButton(true)
        
        const numGuessesAll = JSON.parse(localStorage.getItem("numGuessesAll")) || []
        const newNumGuessesAll = [...numGuessesAll, (guessedPets.length + 1)]
        localStorage.setItem("numGuessesAll", JSON.stringify(newNumGuessesAll))
        localStorage.setItem("avgGuesses", JSON.stringify(newNumGuessesAll.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0,
        ) / Math.max(newNumGuessesAll.length, 1)));

        const streak = JSON.parse(localStorage.getItem("streak")) || []
        const newStreak = streak != [] && streak[streak.length - 1] + 1 == now ? [...streak, (now)] : [now]
        localStorage.setItem("streak", JSON.stringify(newStreak))

        setTimeout(() => {
          setDarkenScreen(true)
          setDisableInfoButton(false)
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
      if (hint.pet.ability.toLowerCase() == correctPet.ability.toLowerCase()) {
        hint.ability = CORRECT_COLOUR
      }

      setHints(currentHints => {
        return [...currentHints, hint]
      })
      setClipboard(
        clipboard + '\n' + 
        COLOUR_TO_EMOJI[hint.pet_colour[0]] + 
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
      <div style={{width: 40, height: 40, marginLeft: "auto"}}>
        <button
        className="infoButton"
        style={disableInfoButton ? {pointerEvents: "none"} : {}}
        onClick={() => {
          setShowInfo(true)
        }}
        >
          ?
        </button>
      </div>
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
      {/* <Timer/> */}
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
          <img className="endScreenEmoji" src={sapWinEmoji} alt="Win Emoji" title="Win Emoji"/>
          <div>
            <div className="guessDisplayLabel">Your Guesses:</div>
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
          <div style={{display: "flex", justifyContent: "center", marginTop: "22px"}}>
            <h1 className="statDisplay">Average:</h1>
            <h1 className="statDisplay">Wins:</h1>
            <h1 className="statDisplay">Streak:</h1>
          </div>
          <div style={{display: "flex", justifyContent: "center", marginBottom: "22px"}}>
            <h1 className="statDisplay">{Math.round(localStorage.getItem("avgGuesses") * 10) / 10}</h1>
            <h1 className="statDisplay">{JSON.parse(localStorage.getItem("numGuessesAll")).length}</h1>
            <h1 className="statDisplay">{JSON.parse(localStorage.getItem("streak")).length}</h1>
          </div>
          <div style={{display: "flex", justifyContent: "center"}}>
            <h1 className="statDisplay">New puzzle in:</h1>
          </div>
          <div style={{display: "flex", justifyContent: "center", marginBottom: "22px"}}>
            <Countdown 
              className="countdownTimer"
              daysInHours={true}
              date={tomorrow}
            />
          </div>
          <div className="copyButtonOuter">
            <div className="copyButtonInner">
              <CopyToClipboard text={"I solved the Petdle #" + now + " in " + guessedPets.length + " tries.\n" + clipboard}>
                <button className="copyButton">Copy</button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
        <Confetti width={7500} height={window.innerHeight} style={{position: "fixed"}}/>
      </div> : null}
      {showInfo ? <div className="endOverlay">
        <div className="endScreen">
          <div className="topRow">
            <div style={{
              width: "3vw",
              height: "3vw",
              maxWidth: "36px",
              maxHeight: "36px"
            }}/>
            <div className="messagePanel">
              How to Play
            </div>
            <button 
              className="closeEndScreenButton" 
              onClick={() => {
                localStorage.setItem("visited", JSON.stringify(true))
                setShowInfo(false)
              }}
            >x</button>
          </div>
          <p className="instructions">
            The goal of this game is to find the hidden pet. To do this, you guess other pets which 
            will reveal information about the hidden pet. Use those clues to figure out the pet of the day!
          </p>
          <p className="instructions">
            🟩: The clue is correct. 
          </p>
          <p className="instructions">
            🟨: The clue is close. For numerical clues, this means the clue is 1 off. For non-numerical
            clues, this means for that property there is some overlap between the two pets.
          </p>
          <p className="instructions">
            ⬛: The clue is wrong. Either the number is too far off or there is zero overlap. 
          </p>
          <p className="instructions">
            Example:  
          </p>
          <li key={0} className="guessListObject" style={{scale: "70%", rotate: "180deg", marginTop: 0}}>
            <div className="infoBox">
              <div className="infoBoxOuter" style={{backgroundColor: WRONG_COLOUR[1]}}>
                <div className="infoBoxInner" style={{fontSize: 20, backgroundColor: WRONG_COLOUR[0]}}>
                  <img
                    className="hintPetImage" 
                    src={petImages[EXAMPLE_PET_INDEX]}
                    alt={pets[EXAMPLE_PET_INDEX].name}
                    title={pets[EXAMPLE_PET_INDEX].name}
                  />
                </div>
              </div>
            </div>
            <div className="infoBox">
              <div className="infoBoxOuter" style={{backgroundColor: CORRECT_COLOUR[1]}}>
                <div className="infoBoxInner" style={{fontSize: HINT_FONT_SIZE, backgroundColor: CORRECT_COLOUR[0]}}>
                  <label>{pets[EXAMPLE_PET_INDEX].tier}</label>
                </div>
              </div>
            </div>
            <div className="infoBox">
              <div className="infoBoxOuter" style={{backgroundColor: CLOSE_COLOUR[1]}}>
                <div 
                  className="infoBoxInner" 
                  style={{
                    fontSize: 20, 
                    backgroundColor: CLOSE_COLOUR[0],
                  }}
                >
                  {pets[EXAMPLE_PET_INDEX].pack.map(pack => {
                    return (
                      <img
                        key={pack}
                        className="packImage" 
                        src={PACK_ICONS[pack]}
                        alt={pack} 
                        title={pack}
                        style={{
                          height: PACK_IMAGE_HEIGHT[pets[EXAMPLE_PET_INDEX].pack.length - 1]
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="infoBox">
              <div className="infoBoxOuter" style={{backgroundColor: WRONG_COLOUR[1]}}>
                <div className="infoBoxInner" style={{fontSize: HINT_FONT_SIZE, backgroundColor: WRONG_COLOUR[0]}}>
                  <label>{pets[EXAMPLE_PET_INDEX].attack}</label>
                </div>
              </div>
            </div>
            <div className="infoBox">
              <div className="infoBoxOuter" style={{backgroundColor: CLOSE_COLOUR[1]}}>
                <div className="infoBoxInner" style={{fontSize: HINT_FONT_SIZE, backgroundColor: CLOSE_COLOUR[0]}}>
                  <label>{pets[EXAMPLE_PET_INDEX].health}</label>
                </div>
              </div>
            </div>
            <div className="infoBox">
              <div className="infoBoxOuter" style={{backgroundColor: CORRECT_COLOUR[1]}}>
                <div className="infoBoxInner" style={{backgroundColor: CORRECT_COLOUR[0]}}>
                  <label className="abilityLabel">{pets[EXAMPLE_PET_INDEX].ability}</label>
                </div>
              </div>
            </div>  
          </li>
          <p className="instructions" style={{marginTop: 5, marginBottom: 20}}>
            The properties are, from left to right, pet, tier, pack, attack, health, ability. 
            By guessing Turtle, we know the hidden pet is tier 4, in Turtle and other packs, it's attack is either less 
            than 1 or more than 3, the health is either 4 or 6, and it has a Faint ability. 
          </p>
        </div>
      </div>: null}
    </>
  )
}