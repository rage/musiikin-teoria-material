# How to create a new exercise kind

This document details how to create a new kind of exercise that displays notes and asks a question with multiple dropdowns.
The student has to complete *x* number of these questions to earn a point, the number is configurable later.

There is a different document about changes to the music utility functions

> Next sections go over the required code from a top down perspective to aid understanding.
When implementing a new exercise kind, you will need to perform the additions from bottom up.

### Steps

1. Create a new exercise kind
2. Add the kind to MusicExercise-partial

## MusicExercise-partial

Everything begins in [`MusicExercise`-partial](https://github.com/rage/musiikin-teoria-material/blob/master/src/partials/MusicExercise.js), 
that is responsible for turning `<music-exercise>`-tags inside .md files into the exercises.

The partial is given `type` String via props (Example `"scales"` or `"piano_chords_sound"`).

### Add to MusicExercise.js

- Add a new `if`-check for your exercise kind to `getExerciseKindByType` method
- (Optional) Add a listing for the type inside `createExerciseRenderingFunction` (display the options on page when incorrect `type` is given.)

```
...
} else if (type.includes("interval")) {
    return new Interval()
} ...
```

## Exercise kind (class that matches specification)

Exercise kind is a class that implements methods required by [`Exercise`](https://github.com/rage/musiikin-teoria-material/blob/master/src/components/music/Exercise.js)
and [`PianoExercise`](https://github.com/rage/musiikin-teoria-material/blob/master/src/components/music/PianoExercise.js)

Examples of implemented exercise kinds:
- [`Chord`](https://github.com/rage/musiikin-teoria-material/blob/master/src/components/music/Chord.js)
- [`Interval`](https://github.com/rage/musiikin-teoria-material/blob/master/src/components/music/Interval.js)
- [`Scale`](https://github.com/rage/musiikin-teoria-material/blob/master/src/components/music/Scale.js)

### Specification

#### `generateExerciseSet(howMany)`

**What:** Generates new exercise answers.

Parameter | Description
-- | --
`howMany` | Number of exercise answers to generate

Returns
```
{
    answerKeys: ["option1", "option2"],       // used to access items in other objects dynamically, eg answerOptions["root"]
    answerOptions: {                          // Contains one array for each answerKey
      option1: [{label: "Vastausvaihtoehto"}] // array of objects that have obj.label
      option2: [{label: "Vastausvaihtoehto"}] // array of objects that have obj.label
    },
    answerLabels: {                           // Label to display for each option when answer is not selected
      option1: "Kysytty asia",
      option2: "Toinen kysytty asia"
    },
    exercises: [{option1: 0, option2:0}]      // array of correct answers, lenght=howMany. Can contain extra information.
}
```

#### `shouldAddNote(note, notes)`

**What:** Check if piano should add a note (called after a piano key is pressed)

Parameter | Description
-- | --  
`note` | New note the user has entered `{midiNumber, pitch, notation}`
`notes` | Array of notes the user has entered `{midiNumber, pitch, notation}`

Returns a boolean

#### `getCorrectAnswerKeys(answer, correctAnswer)`

**What:** Check if an answer is correct

Parameter | Description
-- | --
`answer`| Object that contains indexes the user selected (eg `{option1: 0, option2: 1}`.   
`correctAnswer` | [generated answer](#generateexercisesethowmany)  

Returns Array of answerKeys that were correct (Example `["option1", "option2"])

#### `isPianoAnswerCorrect(pianoAnswerNotes, correctAnswer)`

**What:** Check if given piano answer is correct

Parameter | Description
-- | --
`pianoAnswerNotes`| Array of notes the user has entered `{midiNumber, pitch, notation}`
`correctAnswer` | [generated answer](#generateexercisesethowmany)  

Returns boolean (is it correct)

#### `readableAnswerString(answer)`

**What:** Turns an answer object into user readable string

Parameter | Description
-- | --
`answer` | Object that contains indexes the user selected (eg `{option1: 0, option2: 1}`. Also used for turning [generated answers](#generateexercisesethowmany) into readable strings

Returns String the user can read, displayed for piano and note exercises

#### `getInstructionString()`

**What:** Gives part of an instruction string for note exercises.

Returns a String

#### `makeAnswerPayload(answer, correctAnswer, correct)`

**What:** Turns given parameters into a single object that will be sent to backend inside `textData`

Parameter | Description
-- | --
`answer`| Object that contains indexes the user selected (eg `{option1: 0, option2: 1}`.   
`correctAnswer` | [generated answer](#generateexercisesethowmany)  
`correct` | boolean, was the answer correct 

Returns object with enough information for about answer and the correct answer

#### `makePianoAnswerPayload(answerNotes, correctAnswerPitches, correctAnswerString, correct)`

**What:** Turns given parameters into a single object that will be sent to backend inside `textData`

Parameter | Description
-- | --
`answerNotes`| Array of notes the user has entered `{midiNumber, pitch, notation}`
`correctAnswerNotes` | [generated answer](#generateexercisesethowmany) in format given by `getAnswerAsNotes`-method
`correctAnswerString` | [generated answer](#generateexercisesethowmany) as a String
`correct` | boolean, was the answer correct 

Returns object with enough information for about answer and the correct answer

#### `getNotationForMidi(correctAnswer)`

**What:** Turn a generated answer into abc notation to write on score

Parameter | Description
-- | --  
`correctAnswer` | [generated answer](#generateexercisesethowmany)  

Returns abc notation

#### `getNotesAsNotation(notes)`

**What:** Turns notes entered by user (`{midiNumber, pitch, notation}`) to abc notation

Parameter | Description
-- | --
`notes`| Array of notes the user has entered `{midiNumber, pitch, notation}`

Returns abc notation

#### `getPianoInstructions(correctAnswer)`

**What:** Instructions for piano exercise of this kind

Parameter | Description
-- | --  
`correctAnswer` | [generated answer](#generateexercisesethowmany)  

Returns String or JSX

#### `getEngraverParams()`

**What:** Get paramters for rendering music sheet for this exercise

Returns object with parameters found in [abcjs documentation](https://github.com/paulrosen/abcjs/blob/master/docs/api.md)

#### `getNoteLimits()`

**What:** Minimun and maximum for piano exercise entry

Returns `{min, max}`
