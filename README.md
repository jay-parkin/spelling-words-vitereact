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
    - Blog

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

#### Hangman

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

```js
// User.json
{
  "userId": "4b1fcc21-9598-49ac-a6ec-06ebfc08f7ad",
  "name": "Jason",
  "lastActiveDate": "2024-10-06T07:07:43.871Z",
  "educationProgress": {
    "spelling": {
      "currentWeek": 40,
      "currentDay": 1
    },
    "maths": {
      "currentWeek": 40,
      "currentDay": 1
    }
  }
}
```

```js
// Spelling.json
{
  "userId": "4b1fcc21-9598-49ac-a6ec-06ebfc08f7ad",
  "lastUpdated": "2024-10-06T07:07:43.871Z",
  "subject": "spelling",
  "week": {
    "40": [
      {
        "day": 0,
        "dayName": "Sunday",
        "currentWordIndex": 10,
        "words": [
          {
            "word": "Adventure",
            "definition": "An exciting or unusual experience.",
            "userInput": "adventare",
            "isCorrect": false
          }
          // More words
        ],
        "dailySummary": {
          "totalWords": 10,
          "correctWords": 5,
          "incorrectWords": 5,
          "accuracy": 0.50,
        }
      },
      {
        "day": 1,
        "dayName": "Monday",
        "currentWordIndex": 9
        "words": [ // Words that were attampted daily
          {
            "word": "Adventure",
            "definition": "An exciting or unusual experience.",
            "userInput": "adventure",
            "isCorrect": true,
          }
          // More words
        ],
        "dailySummary": {
          "totalWords": 10,
          "correctWords": 9,
          "incorrectWords": 1,
          "accuracy": 0.90,
        }
      }
    ],
      "wordList": [ // Word list for the week
        {
          "word": "Adventure",
          "definition": "An exciting or unusual experience.",
          "correctAttempt": 1,
          "incorrectAttempt": 1,
        }
      ],
      "weeklySummary": {
      "mostCommonlyMisspelt": "Adventure",
      "totalWords": 50,
      "correctWords": 38,
      "incorrectWords": 12,
      "accuracy": 0.76,
    }
  }
}
```
