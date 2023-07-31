
export const keyboard = {};

export function setupKeyboard() {
  window.addEventListener('keydown', (e) => {
    keyboard[e.key] = true;
  });

  window.addEventListener('keyup', (e) => {
    keyboard[e.key] = false;
    lastNumberPressed = -1;
  });
}

export function isDown(key1, key2) {
  if (key2) {
    return keyboard[key1] && keyboard[key2];
  } else {
    return keyboard[key1];
  }
}

let lastNumberPressed = -1;
export function isDownNumber() {
  for (const key in keyboard) {
    if (keyboard[key] && !isNaN(parseInt(key)) && (key !== lastNumberPressed)) {
      lastNumberPressed = key;
      return parseInt(key);
    }
  }
  return null;
}