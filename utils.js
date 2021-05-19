export const getAnalysis = function (valence, energy) {
  if (valence < 0.28) {
    if (energy > 0.8) {
      return 'agressive'
    } else {
      return 'sad'
    }
  } else if (valence < 0.4) {
    if (energy > 0.7) {
      return 'happy'
    } else {
      return 'sad'
    }
  } else if (valence < 0.5) {
    if (energy >= 0.5) {
      return 'happy'
    } else {
      return 'sad'
    }
  } else if (valence < 0.65) {
    if (energy > 0.3) {
      return 'happy'
    } else {
      return 'sad'
    }
  } else if (energy > 0.4) {
    return 'happy'
  } else {
    return 'chill'
  }
}
