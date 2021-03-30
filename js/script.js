const btnContainer = document.querySelector(".btn-container"),
  btns = document.querySelectorAll(".btn"),
  piano = document.querySelector(".piano"),
  pianoKeys = document.querySelectorAll(".piano-key"),
  fullscreenBtn = document.querySelector(".fullscreen"),
  active = ["piano-key-active", "piano-key-active-pseudo"];

// useful functions
function removeClass(selector, anyClass) {
  if (selector.classList.contains(anyClass)) {
    selector.classList.remove(anyClass);
  }
}

function addClass(selector, anyClass) {
  if (!selector.classList.contains(anyClass)) {
    selector.classList.add(anyClass);
  }
}

function removeAllClasses(arr, anyClass) {
  arr.forEach((elem) => {
    addOrRemoveAnyClasses(removeClass, elem, anyClass);
  });
}

function addOrRemoveAnyClasses(func, elem, anyClass) {
  for (let i = 0; i < anyClass.length; i++) {
    func(elem, anyClass[i]);
  }
}

function playAudio(src) {
  const audio = new Audio();
  audio.src = src;
  audio.currentTime = 0;
  audio.play();
}

function addSrcForAudio(target) {
  addOrRemoveAnyClasses(removeClass, target, active);
  addOrRemoveAnyClasses(addClass, target, active);
  const note = target.dataset.note;
  const src = `assets/audio/${note}.mp3`;
  playAudio(src);
}

// toggle notes and letters buttons
btnContainer.addEventListener("click", (e) => {
  const notes = "notes",
    letters = "letters",
    target = e.target;
  btns.forEach((btn) => {
    removeClass(btn, "btn-active");
  });
  addClass(target, "btn-active");
  if (target.classList.contains(`btn-${notes}`)) {
    removeClass(piano, letters);
    addClass(piano, notes);
  } else {
    removeClass(piano, notes);
    addClass(piano, letters);
  }
});

// key events
const map = {}; // object for remember which button was pressed.

onkeydown = onkeyup = (e) => {
  if (e.repeat) {
    // stop repeated by holding the keyboard btn
    return;
  }
  const value = e.code.substr(3);
  pianoKeys.forEach((elem) => {
    const letter = elem.dataset.letter;
    if (value === letter) {
      if ((map[e.code] = e.type == "keydown")) {
        addSrcForAudio(elem);
      } else {
        addOrRemoveAnyClasses(removeClass, elem, active);
      }
    }
  });
};

// mouseEvents
let isDown = false; // check click on the piano

piano.onmousedown = piano.onmouseup = (e) => {
  const target = e.target;
  if (target.classList.contains("piano-key")) {
    if (e.type == "mousedown") {
      isDown = true;
      addSrcForAudio(target);
    } else {
      isDown = false;
      addOrRemoveAnyClasses(removeClass, target, active);
    }
    document.body.onmouseup = () => {
      isDown = false;
      removeAllClasses(pianoKeys, active);
    };
  }
};

piano.onmouseover = piano.onmouseout = (e) => {
  if (isDown) {
    let target = e.target;
    if (target.classList.contains("piano-key")) {
      if (e.type == "mouseover") {
        addSrcForAudio(target);
      } else {
        addOrRemoveAnyClasses(removeClass, target, active);
      }
    }
  }
};

// fullScreen
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
});
