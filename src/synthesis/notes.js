const baseNotes = [
  ["C", 32.703195662574829 / 2],
  ["C#", 34.647828872109012 / 2],
  ["D", 36.708095989675945 / 2],
  ["D#", 38.890872965260113 / 2],
  ["E", 41.203444614108741 / 2],
  ["F", 43.653528929125485 / 2],
  ["F#", 46.249302838954299 / 2],
  ["G", 48.999429497718661 / 2],
  ["G#", 51.913087197493142 / 2],
  ["A", 55.0 / 2],
  ["A#", 58.270470189761239 / 2],
  ["B", 61.735412657015513 / 2]
];

const allNotesByOctave = [0, 1, 2, 3, 4, 5, 6].map((octave) =>
  baseNotes.map(([note, freq]) => [note, freq * Math.pow(2, octave)])
);

const allNotesMap = allNotesByOctave.reduce((acc, octave, index) => {
  return octave.reduce(
    (acc2, [note, freq]) => ({
      ...acc2,
      [`${note}-${index}`]: freq
    }),
    acc
  );
}, {});

const keyNoteLookup = {
  65: "C3",
  87: "C_3",
  83: "D3",
  69: "D_3",
  68: "E3",
  70: "F3",
  84: "F_3",
  71: "G3",
  89: "G_3",
  72: "A3",
  85: "A_3",
  74: "B3",
  75: "C4",
  79: "C_4",
  76: "D4",
  80: "D_4",
  59: "E4"
};

export { keyNoteLookup, allNotesMap, allNotesByOctave };
