// Key Listener
export class KeyListener {
  constructor() {
    this.keys = {};
  }

  down = (event) => {
    if (event.keyCode in this.keys) {
      event.preventDefault();
      // console.log('pressed', event.key, event.keyCode)
      this.keys[event.keyCode] = true;
    }
  }

  up = (event) => {
    if (event.keyCode in this.keys) {
      event.preventDefault();
      // console.log('unpressed', event.key, event.keyCode)
      this.keys[event.keyCode] = false;
    }
  }

  isPressed = (keyCode) => {
    return this.keys[keyCode] || false;
  }

  anyPressed = () => {
    return Object.values(this.keys).includes(true)
  }

  subscribe = (keys) => {
    window.addEventListener('keydown', this.down);
    window.addEventListener('keyup', this.up);

    keys.forEach((key) => {
      this.keys[key] = false;
    });
  }

  unsubscribe = () => {
    window.removeEventListener('keydown', this.down);
    window.removeEventListener('keyup', this.up);
    this.keys = {};
  }

}
