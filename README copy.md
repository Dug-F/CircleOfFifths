# 100DaysOfCode

##### Today's objective

- Start to introduce better data structures to support the 'logic' of the app
- Encode the notes of each scale and their interals and roles
- To allow correct resolution of enharmonic equivalents when a scale is shown
- And also to lay the foundation for correct building of context menus for each interval, e.g. whether to show a major, minor, dominant chord etc.
- Amend the current label2 to be the innerLabel, which will represent intervals
- Create an outerLabel, which will represent chords

```
Plan
// Start implemention of structure of objects with foreign keys to other objects
// Start with an object of major keys.  First level key is the note (e.g. C).  
// Each note object will contain an object containing:
//   an array of scale note names, keyed by wheel position
// Create an object of innerLabels.  
//   this will be keyed by scale type, e.g. major, minor
//   each entry will contain an object of label types, e.g. "long", "short"
//     each object will contain an array of the labels for that label type, e.g. Minor 3rd
// Create an object of chords
//   this will be keyed by scale type, e.g. major, minor
//   each entry will contain an object
//     each object will contain a key of chord type, e.g. triad, tetrad
//     each entry will contain an array of chord arrangements, keyed by wheel position
//       each chord arrangement will contain an array of the positions to be shown in that chord
```
