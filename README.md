# js13k 2024: Triskaidekaphobia

![Screenshot from the game.](thumb_400x250.png?raw=true)

Entry for the [js13k competition of 2024](https://2024.js13kgames.com/).  
Theme: **Triskaidekaphobia** *(fear of the number 13)*


## Description

...


## Controls

* `[W][A][S][D]` / Arrow keys to look around
* `[R]` to reset the camera
* `[E][Enter]` / Mouse click to interact
* `[Escape]` to pause/unpause


## Why aren't you using the PointerLock API?

When the pointer is locked, the normal mouse event attributes like `clientX` or `screenY` etc. stop working. Instead `movementX` and `movementY` have to be used. But I found those to not be precise enough. Small mouse movements still fired the event, but both values were 0. This resulted in a juddery camera on slow movements and made being precise very hard. With Firefox it was worse than with Chromium.


## Resources

* [ptex – Mini randomized pixel-art textures](https://xem.github.io/pxtex/)
* [W – A micro WebGL2 framework](https://xem.github.io/W/)
* [ZzFX – Zuper Zmall Zound Zynth](https://github.com/KilledByAPixel/ZzFX)
