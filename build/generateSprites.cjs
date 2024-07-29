const { generateSprite } = require('@unvt/sprite-one');
const fs = require('fs');

const avatars = [
  'adaptable-alien',
  'gary-bee',
  'reflective-rhinoceros',
  'ambitious-angel',
  'macho-manta-ray',
  'adventurous-astronaut',
  'rare-robot',
  'empathy-elephant',
  'arbitraging-admiral'
];

(async function () {
  for (let index = 0; index < avatars.length; index++) {

    const folderName = avatars[index];

    await generateSprite(`./build/sprites/${folderName}`, [`./build/sprites/${folderName}`]);

    const result = {
      breathBack: [],
      breathFront: [],
      clapping: [],
      draggedDown: [],
      draggedLeft: [],
      draggedRight: [],
      draggedUp: [],
      handsUp: [],
      hovering: [],
      jumping: [],
      swayBack: [],
      swayFront: [],
      turnAround: [],
      talk: [],
      blink: [],
      walkLeft: [],
      walkRight: [],
      walkUp: [],
      walkDown: [],
      boo: []
    };

    const json = require(`./sprites/${folderName}.json`);

    for (let i = 0; i < Object.keys(json).length; i++) {
      const key = Object.keys(json)[i];
      const [index, name] = transformKeyToAnimationName(key);
      result[name][index] = {
        index: index,
        offsetX: -(json[key].x),
        offsetY: -(json[key].y)
      };
    }

    // save result as json
    fs.writeFileSync(`./src/Avatars/Sprites/${folderName}.json`, JSON.stringify(result, null, 2));

    // copy sprite image to assets/sprites folder
    fs.copyFileSync(`./build/sprites/${folderName}.png`, `./public/sprites/${folderName}.png`);

  }
})();


function transformKeyToAnimationName(key) {

  const indexMatch = key.match(/\d+$/);
  const indexInKey = indexMatch ? parseInt(indexMatch[0], 10) : null;

  if (indexInKey == null) {
    throw new Error(`Index not found in key: ${key}`);
  }

  if (key.startsWith('blink-')) {
    return [indexInKey, 'blink'];
  }

  if (key.startsWith('breath-back-')) {
    return [indexInKey, 'breathBack'];
  }

  if (key.startsWith('breath-front-')) {
    return [indexInKey, 'breathFront'];
  }

  if (key.startsWith('clapping-')) {
    return [indexInKey, 'clapping'];
  }

  if (key.startsWith('drag-down-')) {
    return [indexInKey, 'draggedDown'];
  }

  if (key.startsWith('drag-left-')) {
    return [indexInKey, 'draggedLeft'];
  }

  if (key.startsWith('drag-right-')) {
    return [indexInKey, 'draggedRight'];
  }

  if (key.startsWith('drag-up-')) {
    return [indexInKey, 'draggedUp'];
  }

  if (key.startsWith('hands-in-the-air-')) {
    return [indexInKey, 'handsUp'];
  }

  if (key.startsWith('hover-')) {
    return [indexInKey, 'hovering'];
  }

  if (key.startsWith('jump-')) {
    return [indexInKey, 'jumping'];
  }

  if (key.startsWith('sway-back-')) {
    return [indexInKey, 'swayBack'];
  }

  if (key.startsWith('sway-front-')) {
    return [indexInKey, 'swayFront'];
  }

  if (key.startsWith('talk-')) {
    return [indexInKey, 'talk'];
  }

  if (key.startsWith('turn-around-')) {
    return [indexInKey, 'turnAround'];
  }

  if (key.startsWith('boo-')) {
    return [indexInKey, 'boo'];
  }

  if (key.startsWith('walk-down-')) {
    return [indexInKey, 'walkDown'];
  }

  if (key.startsWith('walk-up-')) {
    return [indexInKey, 'walkUp'];
  }

  if (key.startsWith('walk-left-')) {
    return [indexInKey, 'walkLeft'];
  }

  if (key.startsWith('walk-right-')) {
    return [indexInKey, 'walkRight'];
  }

  throw new Error(`Unknown key: ${key}`);

}
//   "breathBack": [
//     {
//       "index": 0,
//       "offsetX": 0,
//       "offsetY": 576
//     },
//     {
//       "index": 1,
//       "offsetX": 192,
//       "offsetY": 576
//     },
//     {
//       "index": 2,
//       "offsetX": 384,
//       "offsetY": 576
//     },
//     {
//       "index": 3,
//       "offsetX": 576,
//       "offsetY": 576
//     },
//     {
//       "index": 4,
//       "offsetX": 768,
//       "offsetY": 0
//     },
//     {
//       "index": 5,
//       "offsetX": 768,
//       "offsetY": 192
//     },
//     {
//       "index": 6,
//       "offsetX": 768,
//       "offsetY": 384
//     },
//     {
//       "index": 7,
//       "offsetX": 768,
//       "offsetY": 576
//     },
//     {
//       "index": 8,
//       "offsetX": 0,
//       "offsetY": 768
//     },
//     {
//       "index": 9,
//       "offsetX": 192,
//       "offsetY": 768
//     },
//     {
//       "index": 10,
//       "offsetX": 384,
//       "offsetY": 768
//     },
//     {
//       "index": 11,
//       "offsetX": 576,
//       "offsetY": 768
//     }
//   ],
//   "breathFront": [
//     {
//       "index": 0,
//       "offsetX": 768,
//       "offsetY": 768
//     },
//     {
//       "index": 1,
//       "offsetX": 960,
//       "offsetY": 0
//     },
//     {
//       "index": 2,
//       "offsetX": 960,
//       "offsetY": 192
//     },
//     {
//       "index": 3,
//       "offsetX": 960,
//       "offsetY": 384
//     },
//     {
//       "index": 4,
//       "offsetX": 960,
//       "offsetY": 576
//     },
//     {
//       "index": 5,
//       "offsetX": 960,
//       "offsetY": 768
//     },
//     {
//       "index": 6,
//       "offsetX": 0,
//       "offsetY": 960
//     },
//     {
//       "index": 7,
//       "offsetX": 192,
//       "offsetY": 960
//     },
//     {
//       "index": 8,
//       "offsetX": 384,
//       "offsetY": 960
//     },
//     {
//       "index": 9,
//       "offsetX": 576,
//       "offsetY": 960
//     },
//     {
//       "index": 10,
//       "offsetX": 768,
//       "offsetY": 960
//     },
//     {
//       "index": 11,
//       "offsetX": 960,
//       "offsetY": 960
//     }
//   ],
//   "clapping": [
//     {
//       "index": 0,
//       "offsetX": 1152,
//       "offsetY": 0
//     },
//     {
//       "index": 1,
//       "offsetX": 1152,
//       "offsetY": 192
//     },
//     {
//       "index": 2,
//       "offsetX": 1152,
//       "offsetY": 384
//     },
//     {
//       "index": 3,
//       "offsetX": 1152,
//       "offsetY": 576
//     },
//     {
//       "index": 4,
//       "offsetX": 1152,
//       "offsetY": 768
//     },
//     {
//       "index": 5,
//       "offsetX": 1152,
//       "offsetY": 960
//     },
//     {
//       "index": 6,
//       "offsetX": 0,
//       "offsetY": 1152
//     },
//     {
//       "index": 7,
//       "offsetX": 192,
//       "offsetY": 1152
//     },
//     {
//       "index": 8,
//       "offsetX": 384,
//       "offsetY": 1152
//     },
//     {
//       "index": 9,
//       "offsetX": 576,
//       "offsetY": 1152
//     },
//     {
//       "index": 10,
//       "offsetX": 768,
//       "offsetY": 1152
//     },
//     {
//       "index": 11,
//       "offsetX": 960,
//       "offsetY": 1152
//     }
//   ],
//   "draggedDown": [
//     {
//       "index": 0,
//       "offsetX": 1152,
//       "offsetY": 1152
//     },
//     {
//       "index": 1,
//       "offsetX": 1344,
//       "offsetY": 0
//     },
//     {
//       "index": 2,
//       "offsetX": 1344,
//       "offsetY": 192
//     }
//   ],
//   "draggedLeft": [
//     {
//       "index": 0,
//       "offsetX": 1344,
//       "offsetY": 384
//     },
//     {
//       "index": 1,
//       "offsetX": 1344,
//       "offsetY": 576
//     }
//   ],
//   "draggedRight": [
//     {
//       "index": 0,
//       "offsetX": 1344,
//       "offsetY": 768
//     },
//     {
//       "index": 1,
//       "offsetX": 1344,
//       "offsetY": 960
//     }
//   ],
//   "draggedUp": [
//     {
//       "index": 0,
//       "offsetX": 1344,
//       "offsetY": 1152
//     },
//     {
//       "index": 1,
//       "offsetX": 0,
//       "offsetY": 1344
//     }
//   ],
//   "handsUp": [
//     {
//       "index": 0,
//       "offsetX": 192,
//       "offsetY": 1344
//     },
//     {
//       "index": 1,
//       "offsetX": 384,
//       "offsetY": 1344
//     },
//     {
//       "index": 2,
//       "offsetX": 576,
//       "offsetY": 1344
//     },
//     {
//       "index": 3,
//       "offsetX": 768,
//       "offsetY": 1344
//     },
//     {
//       "index": 4,
//       "offsetX": 960,
//       "offsetY": 1344
//     },
//     {
//       "index": 5,
//       "offsetX": 1152,
//       "offsetY": 1344
//     },
//     {
//       "index": 6,
//       "offsetX": 1344,
//       "offsetY": 1344
//     },
//     {
//       "index": 7,
//       "offsetX": 1536,
//       "offsetY": 0
//     },
//     {
//       "index": 8,
//       "offsetX": 1536,
//       "offsetY": 192
//     },
//     {
//       "index": 9,
//       "offsetX": 1536,
//       "offsetY": 384
//     },
//     {
//       "index": 10,
//       "offsetX": 1536,
//       "offsetY": 576
//     },
//     {
//       "index": 11,
//       "offsetX": 1536,
//       "offsetY": 768
//     }
//   ],
//   "hovering": [
//     {
//       "index": 0,
//       "offsetX": 1536,
//       "offsetY": 960
//     },
//     {
//       "index": 1,
//       "offsetX": 1536,
//       "offsetY": 1152
//     },
//     {
//       "index": 2,
//       "offsetX": 1536,
//       "offsetY": 1344
//     },
//     {
//       "index": 3,
//       "offsetX": 0,
//       "offsetY": 1536
//     },
//     {
//       "index": 4,
//       "offsetX": 192,
//       "offsetY": 1536
//     },
//     {
//       "index": 5,
//       "offsetX": 384,
//       "offsetY": 1536
//     },
//     {
//       "index": 6,
//       "offsetX": 576,
//       "offsetY": 1536
//     },
//     {
//       "index": 7,
//       "offsetX": 768,
//       "offsetY": 1536
//     },
//     {
//       "index": 8,
//       "offsetX": 960,
//       "offsetY": 1536
//     },
//     {
//       "index": 9,
//       "offsetX": 1152,
//       "offsetY": 1536
//     },
//     {
//       "index": 10,
//       "offsetX": 1344,
//       "offsetY": 1536
//     },
//     {
//       "index": 11,
//       "offsetX": 1536,
//       "offsetY": 1536
//     },
//     {
//       "index": 12,
//       "offsetX": 1728,
//       "offsetY": 0
//     }
//   ],
//   "jumping": [
//     {
//       "index": 0,
//       "offsetX": 1728,
//       "offsetY": 192
//     },
//     {
//       "index": 1,
//       "offsetX": 1728,
//       "offsetY": 384
//     },
//     {
//       "index": 2,
//       "offsetX": 1728,
//       "offsetY": 576
//     },
//     {
//       "index": 3,
//       "offsetX": 1728,
//       "offsetY": 768
//     },
//     {
//       "index": 4,
//       "offsetX": 1728,
//       "offsetY": 960
//     },
//     {
//       "index": 5,
//       "offsetX": 1728,
//       "offsetY": 1152
//     },
//     {
//       "index": 6,
//       "offsetX": 1728,
//       "offsetY": 1344
//     },
//     {
//       "index": 7,
//       "offsetX": 1728,
//       "offsetY": 1536
//     },
//     {
//       "index": 8,
//       "offsetX": 0,
//       "offsetY": 1728
//     },
//     {
//       "index": 9,
//       "offsetX": 192,
//       "offsetY": 1728
//     },
//     {
//       "index": 10,
//       "offsetX": 384,
//       "offsetY": 1728
//     },
//     {
//       "index": 11,
//       "offsetX": 576,
//       "offsetY": 1728
//     },
//     {
//       "index": 12,
//       "offsetX": 768,
//       "offsetY": 1728
//     }
//   ],
//   "swayBack": [
//     {
//       "index": 0,
//       "offsetX": 960,
//       "offsetY": 1728
//     },
//     {
//       "index": 1,
//       "offsetX": 1152,
//       "offsetY": 1728
//     },
//     {
//       "index": 2,
//       "offsetX": 1344,
//       "offsetY": 1728
//     },
//     {
//       "index": 3,
//       "offsetX": 1536,
//       "offsetY": 1728
//     },
//     {
//       "index": 4,
//       "offsetX": 1728,
//       "offsetY": 1728
//     },
//     {
//       "index": 5,
//       "offsetX": 1920,
//       "offsetY": 0
//     },
//     {
//       "index": 6,
//       "offsetX": 1920,
//       "offsetY": 192
//     },
//     {
//       "index": 7,
//       "offsetX": 1920,
//       "offsetY": 384
//     },
//     {
//       "index": 8,
//       "offsetX": 1920,
//       "offsetY": 576
//     },
//     {
//       "index": 9,
//       "offsetX": 1920,
//       "offsetY": 768
//     },
//     {
//       "index": 10,
//       "offsetX": 1920,
//       "offsetY": 960
//     },
//     {
//       "index": 11,
//       "offsetX": 1920,
//       "offsetY": 1152
//     },
//     {
//       "index": 12,
//       "offsetX": 1920,
//       "offsetY": 1344
//     }
//   ],
//   "swayFront": [
//     {
//       "index": 0,
//       "offsetX": 1920,
//       "offsetY": 1536
//     },
//     {
//       "index": 1,
//       "offsetX": 1920,
//       "offsetY": 1728
//     },
//     {
//       "index": 2,
//       "offsetX": 0,
//       "offsetY": 1920
//     },
//     {
//       "index": 3,
//       "offsetX": 192,
//       "offsetY": 1920
//     },
//     {
//       "index": 4,
//       "offsetX": 384,
//       "offsetY": 1920
//     },
//     {
//       "index": 5,
//       "offsetX": 576,
//       "offsetY": 1920
//     },
//     {
//       "index": 6,
//       "offsetX": 768,
//       "offsetY": 1920
//     },
//     {
//       "index": 7,
//       "offsetX": 960,
//       "offsetY": 1920
//     },
//     {
//       "index": 8,
//       "offsetX": 1152,
//       "offsetY": 1920
//     },
//     {
//       "index": 9,
//       "offsetX": 1344,
//       "offsetY": 1920
//     },
//     {
//       "index": 10,
//       "offsetX": 1536,
//       "offsetY": 1920
//     },
//     {
//       "index": 11,
//       "offsetX": 1728,
//       "offsetY": 1920
//     },
//     {
//       "index": 12,
//       "offsetX": 1920,
//       "offsetY": 1920
//     }
//   ],
//   "turnAround": [
//     {
//       "index": 0,
//       "offsetX": 192,
//       "offsetY": 2112
//     },
//     {
//       "index": 1,
//       "offsetX": 384,
//       "offsetY": 2112
//     },
//     {
//       "index": 2,
//       "offsetX": 576,
//       "offsetY": 2112
//     },
//     {
//       "index": 3,
//       "offsetX": 768,
//       "offsetY": 2112
//     },
//     {
//       "index": 4,
//       "offsetX": 960,
//       "offsetY": 2112
//     },
//     {
//       "index": 5,
//       "offsetX": 1152,
//       "offsetY": 2112
//     },
//     {
//       "index": 6,
//       "offsetX": 1344,
//       "offsetY": 2112
//     },
//     {
//       "index": 7,
//       "offsetX": 1536,
//       "offsetY": 2112
//     },
//     {
//       "index": 8,
//       "offsetX": 1728,
//       "offsetY": 2112
//     },
//     {
//       "index": 9,
//       "offsetX": 1920,
//       "offsetY": 2112
//     },
//     {
//       "index": 10,
//       "offsetX": 2112,
//       "offsetY": 2112
//     },
//     {
//       "index": 11,
//       "offsetX": 2304,
//       "offsetY": 0
//     },
//     {
//       "index": 12,
//       "offsetX": 2304,
//       "offsetY": 192
//     },
//     {
//       "index": 13,
//       "offsetX": 2304,
//       "offsetY": 384
//     }
//   ],
//   "talk": [
//     {
//       "index": 0,
//       "offsetX": 2112,
//       "offsetY": 0
//     },
//     {
//       "index": 1,
//       "offsetX": 2112,
//       "offsetY": 192
//     },
//     {
//       "index": 2,
//       "offsetX": 2112,
//       "offsetY": 384
//     },
//     {
//       "index": 3,
//       "offsetX": 2112,
//       "offsetY": 576
//     },
//     {
//       "index": 4,
//       "offsetX": 2112,
//       "offsetY": 768
//     },
//     {
//       "index": 5,
//       "offsetX": 2112,
//       "offsetY": 960
//     },
//     {
//       "index": 6,
//       "offsetX": 2112,
//       "offsetY": 1152
//     },
//     {
//       "index": 7,
//       "offsetX": 2112,
//       "offsetY": 1344
//     },
//     {
//       "index": 8,
//       "offsetX": 2112,
//       "offsetY": 1536
//     },
//     {
//       "index": 9,
//       "offsetX": 2112,
//       "offsetY": 1728
//     },
//     {
//       "index": 10,
//       "offsetX": 2112,
//       "offsetY": 1920
//     },
//     {
//       "index": 11,
//       "offsetX": 0,
//       "offsetY": 2112
//     }
//   ],
//   "blink": [
//     {
//       "index": 0,
//       "offsetX": 0,
//       "offsetY": 0
//     },
//     {
//       "index": 1,
//       "offsetX": 192,
//       "offsetY": 0
//     },
//     {
//       "index": 2,
//       "offsetX": 0,
//       "offsetY": 192
//     },
//     {
//       "index": 3,
//       "offsetX": 192,
//       "offsetY": 192
//     },
//     {
//       "index": 4,
//       "offsetX": 384,
//       "offsetY": 0
//     },
//     {
//       "index": 5,
//       "offsetX": 384,
//       "offsetY": 192
//     },
//     {
//       "index": 6,
//       "offsetX": 0,
//       "offsetY": 384
//     },
//     {
//       "index": 7,
//       "offsetX": 192,
//       "offsetY": 384
//     },
//     {
//       "index": 8,
//       "offsetX": 384,
//       "offsetY": 384
//     },
//     {
//       "index": 9,
//       "offsetX": 576,
//       "offsetY": 0
//     },
//     {
//       "index": 10,
//       "offsetX": 576,
//       "offsetY": 192
//     },
//     {
//       "index": 11,
//       "offsetX": 576,
//       "offsetY": 384
//     }
//   ],
//   "walkLeft": [],
//   "walkRight": [],
//   "walkUp": [],
//   "walkDown": [],
//   "boo": []
// };