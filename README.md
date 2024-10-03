# Spelling!

## Routes

#### Homepage

- `localhost:3000/`

  - root or Homepage
  - Welcome screen
  - Random funny quote
  - Accordion tiles for different sections, showing progress
    - Spelling
    - Maths
    - Sentences
    - Word Search

#### Profile

- `localhost:3000/profile/:userId`
  - Weekly progression
    - Circular completion graph
  - Monthly progression
  - Correct / incorrect questions
  - Inspiration quotes
  - Incentives

#### Spelling

- `localhost:3000/spelling`

  - Spelling words card
    - Random colours

- `localhost:3000/spelling/results`

  - Display user's spelling results
  - Percent of correct / incorrect attempts

  - Display cards that show the user's weekly progress so far

#### Maths

- `localhost:3000/maths`

  - Maths questions
    - 20 question
    - 6 questions displayed at a time
    - Random colours

- `localhost:3000/maths/results`

  - Display user's maths results
  - Percent of correct / incorrect attempts

#### Sentences

- `localhost:3000/sentences`

  - Using the weekly spelling words to create sentences
  - Sentences are ranked on creativity and complexity

- `localhost:3000/sentences/results`

  - Display user's sentences results

#### Word Search

- `localhost:3000/word-search`
  - Creates a word search out of this week's spelling words

#### Personal Blog

- `localhost:3000/personal-blog`
  - Allows the user to make a quick blog on today and how they are feeling

## FrontEnd UI Frameworks

- [Chakra UI](https://v2.chakra-ui.com/)
- [Material UI](https://mui.com/)
- [UI ShadCN](https://ui.shadcn.com/)

## Deployment & Security

- Netlify env variables: https://docs.netlify.com/environment-variables/overview/

## Useful Resources

## Context

- Weekly Word List

```js
{
  id: "001",
  date: "1727887154",
  type: "spelling",
  userid: "4b1fcc21-9598-49ac-a6ec-06ebfc08f7ad",
  words: {
  0, Adventure, "An exciting or unusual experience.",
  1, Absent, "Not present in a place or a situation.",
  2, Accident, "An unexpected and unintended event.",
  3, Acoustic, "Related to sound or the sense of hearing.",
  4, Address, "The details of the place where someone lives or works.",
  5, Alphabet, "A set of letters used in a language.",
  6, Amazing, "Causing great surprise or wonder.",
  7, Animal, "A living organism that feeds on organic matter.",
  8, Apartment, "A set of rooms forming a separate residence within a building.",
  9, Apparent, "Clearly visible or understood; obvious.",
  10, Apple, "A round fruit with red, green, or yellow skin.",
  },
  weeklycorrect: 5,
  weeklyincorrect: 6,
  weeklypercent: 0.454


}
```

- Spelling Results
  - Array of Objects

```js
{
  "id": "002",
  "date": "1727887154",
  "type": "spelling",
  "userId": "4b1fcc21-9598-49ac-a6ec-06ebfc08f7ad",
  "words": [
    {
      "word": "Adventure",
      "attemptedSpelling": "adventare",
      "isCorrect": false,
      "correctCount": 9,
      "incorrectCount": 3
    },
    {
      "word": "Absent",
      "attemptedSpelling": "adbsent",
      "isCorrect": false,
      "correctCount": 5,
      "incorrectCount": 4
    }
    // More words
  ],
  "summary": {
    "totalWords": 10,
    "correctWords": 5,
    "incorrectWords": 5,
    "accuracy": 0.50
  }
}
```
