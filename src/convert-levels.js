const fs = require('fs')
const getLevel = require('../old/src/static/js/levels')

console.log(getLevel(1))
const types = {
  BRICK: 0,
  BLOCK: 1,
  CLOSED_DIAMOND: 2,
  OPEN_DIAMOND: 3,
  CIRCLE: 4,
  SPIRAL: 5,
  PLUS: 6,
  SQUARE: 7
}

function processLevel (data) {
  if (!data || !data.length) return
  const tileSize = 32
  const bricks = [].concat(
    data[4].map(p => p.concat(types.BRICK)),
    data[5].map(p => p.concat(types.BLOCK)),
    data[7].map(p => p.concat(types.CLOSED_DIAMOND)),
    data[8].map(p => p.concat(types.OPEN_DIAMOND)),
    data[9].map(p => p.concat(types.CIRCLE)),
    data[10].map(p => p.concat(types.SPIRAL)),
    data[11].map(p => p.concat(types.PLUS)),
    data[12].map(p => p.concat(types.SQUARE))
  ).map(p => {
    p[0] = Math.floor(p[0] / tileSize)
    p[1] = Math.floor(p[1] / tileSize)
    return p
  })

   return {
     boulders: data[2].map((x, i) => [
       Math.floor(x / tileSize),
       Math.floor(data[3][i] / tileSize)
     ]),
     dozer: [
       Math.floor(data[0] / tileSize),
       Math.floor(data[1] / tileSize)
     ],
     targets: data[6].map(p => [
       Math.floor(p[0] / tileSize),
       Math.floor(p[1] / tileSize)
     ]),
     bricks: bricks
   }
}

for (let i = 1; i < 65; i++) {
  const formatted = processLevel(getLevel(i))
  if (formatted) {
    fs.writeFileSync(`static/levels/level-${i}.json`, JSON.stringify(formatted))
  }
}