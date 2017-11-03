import Dice from './Dice'

export const Generator = (challenge_ratings, percentage) => {
    if(!challenge_ratings) return;

  var ratings = Array.isArray(challenge_ratings) ? challenge_ratings : [challenge_ratings]
  console.log(ratings)
  let treasure = {
    cp: 0,
    sp: 0,
    ep: 0,
    gp: 0,
    pp: 0,
    gem: [],
    art: []
  }

  for (var i = 0; i < ratings.length; i++) {
    var cr = ratings[i]
    var d100 = Dice.roll(1, 100)

    switch (cr) {
      case 0: case 0.125: case 0.25: case 0.5: case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10:
        if(0 <= d100 <= 30){ //Dice.roll(1, 100)
          switch (cr) {
            case 0: case 1: case 2: case 3: case 4:
              treasure.cp += Dice.roll(5, 6);
              break;
            default:
              treasure.cp += Dice.roll(4, 6) * 100;
              treasure.ep += Dice.roll(1, 6) * 10;
          }
        }else if(30 <= d100 <= 60){
          switch (cr) {
            case 0: case 1: case 2: case 3: case 4:
              treasure.sp += Dice.roll(4, 6);
              break;
            default:
              treasure.sp += Dice.roll(6, 6) * 10;
              treasure.gp += Dice.roll(2, 6) * 10;
          }
        }else if(60 <= d100 <= 70){
          switch (cr) {
            case 0: case 1: case 2: case 3: case 4:
              treasure.ep += Dice.roll(3, 6);
              break;
            default:
              treasure.ep += Dice.roll(3, 6) * 10;
              treasure.gp += Dice.roll(2, 6) * 10;
          }
        }else if(70 <= d100 <= 95){
          switch (cr) {
            case 0: case 1: case 2: case 3: case 4:
              treasure.gp += Dice.roll(3, 6);
              break;
            default:
              treasure.gp += Dice.roll(4, 6) * 10;
          }
        }else if(95 <= d100 <= 100){
          switch (cr) {
            case 0: case 1: case 2: case 3: case 4:
              treasure.pp += Dice.roll(1, 6);
              break;
            default:
              treasure.gp += Dice.roll(2, 6) * 10;
              treasure.pp += Dice.roll(3, 6);
          }
        }
        break;
      case 11: case 12: case 13: case 14: case 15: case 16:
        if(0 <= d100 <= 20){
          treasure.sp += Dice.roll(4, 6) * 100;
          treasure.gp += Dice.roll(1, 6) * 100;
        } else if(20 <= d100 <= 35){
          treasure.ep += Dice.roll(1, 6) * 100;
          treasure.gp += Dice.roll(1, 6) * 100;
        } else if(35 <= d100 <= 75){
          treasure.gp += Dice.roll(2, 6) * 100;
          treasure.pp += Dice.roll(1, 6) * 100;
        } else if(75 <= d100 <= 100){
          treasure.gp += Dice.roll(2, 6) * 100;
          treasure.pp += Dice.roll(2, 6) * 100;
        }
        break;
      default:
        if(0 <= d100 <= 15){
          treasure.ep += Dice.roll(2, 6) * 1000;
          treasure.gp += Dice.roll(8, 6) * 100;
        } else if(15 <= d100 <= 55){
          treasure.gp += Dice.roll(1, 6) * 1000;
          treasure.pp += Dice.roll(1, 6) * 100;
        } else if(55 <= d100 <= 100){
          treasure.gp += Dice.roll(1, 6) * 100;
          treasure.pp += Dice.roll(2, 6) * 100;
        }
    }
  }

  let total = (treasure.cp/100) + (treasure.sp/10) + (treasure.ep/2) + treasure.gp + (treasure.pp*10)
  let goldToTrade = ((percentage*1)/100)*total

  if(percentage > 0 && goldToTrade >= 10){
    let remaining = goldToTrade
    if(treasure.pp * 10 >= remaining){
      treasure.pp -= remaining / 10
      remaining = 0
    }else{
      remaining -= treasure.pp * 10
      treasure.pp = 0
    }

    if(treasure.gp >= remaining){
      treasure.gp -= remaining
      remaining = 0
    }else{
      remaining -= treasure.gp
      treasure.gp = 0
    }

    if(treasure.ep / 2 >= remaining){
      treasure.ep -= remaining * 2
      remaining = 0
    }else{
      remaining -= treasure.ep / 2
      treasure.ep = 0
    }

    if(treasure.sp / 10 >= remaining){
      treasure.sp -= remaining * 10
      remaining = 0
    }else{
      remaining -= treasure.sp / 10
      treasure.sp = 0
    }

    if(treasure.cp / 100 >= remaining){
      treasure.cp -= remaining * 100
      remaining = 0
    }else{
      remaining -= treasure.cp / 100
      treasure.cp = 0
    }

    let items = Object.keys(treasureItems).reverse().map(key => treasureItems[key])

    while(goldToTrade >= 10){
      for(var key = 0; key < items.length; key++){
        if(goldToTrade >= items[key].gold){
          goldToTrade -= items[key].gold

          const randomNumber = Math.floor(Math.random() * items[key].items.length)
          const randomItem = items[key].items[randomNumber]

          treasure[items[key].type].push(randomItem + ' (' + items[key].gold + 'GP)')
          break;
        }
      }
    }
    treasure.gp += goldToTrade+remaining
  }

  for(key in treasure){
    if(key !== 'gem' && key !== 'art') treasure[key] = Math.floor(treasure[key])
  }

  return treasure
}

const treasureItems = {
  7500: {
    gold: 7500,
    type: 'art',
    items: [
        'Jeweled gold crown',
        'Jeweled platinum ring',
        'Small gold statuette set with rubies',
        'Gold cup set with emeralds',
        'Gold jewerly box with platinum filigree',
        'Painted gold child\'s sarcophagus',
        'Jade game board with solid gold playing pieces',
        'Bejeweled ivory drinking horn with gold filigree',
    ]
  },
  5000: {
    gold: 5000,
    type: 'gem',
    items: [
        'Black Sapphire',
        'Diamond',
        'Jacinth',
        'Ruby',
    ]
  },
  2500: {
    gold: 2500,
    type: 'art',
    items: [
        'Fine gold chain set with fire opal',
        'Old masterpiece painting',
        'Embroidered silk and velvet mantle set with numerous moonstones',
        'Platinum bracelet set with a sapphire',
        'Embroidered glove set with jewel chips',
        'Jeweled anklet',
        'Gold music box',
        'Gold circlet set with four aquamarines',
        'Eye patch with a mock eye set in blue sapphire and moonstone',
        'A necklace string of small pink pearls',
    ]
  },
  1000: {
    gold: 1000,
    type: 'gem',
    items: [
        'Black Opal',
        'Blue Sapphire',
        'Emerald',
        'Fire Opal',
        'Opal',
        'Star Ruby',
        'Star Sapphire',
        'Yellow Sapphire',
    ]
  },
  750: {
    gold: 750,
    type: 'art',
    items: [
        'Silver chalice with moonstones',
        'Silver-plated steel longsword with jet set in hilt',
        'Carved harp of exotic wood with ivory inlay and zircon gems',
        'Small gold idol',
        'Gold dragon comb set with red garnets as eyes',
        'Bottle stopper cork embossed with gold leaf and set with amethysts',
        'Ceremonial electrum dagger with black peral in the pommel',
        'Silver and gold brooch',
        'Obsidian statuette with gold fittings and inlay',
        'Painted gold war mask',
    ]
  },
  500: {
    gold: 500,
    type: 'gem',
    items: [
      'Alexandrite',
      'Aquamarine',
      'Black Pearl',
      'Blue Spinel',
      'Peridot',
      'Topaz',
    ]
  },
  250: {
    gold: 250,
    type: 'art',
    items: [
      'Gold ring set with bloodstones',
      'Carved ivory statuette',
      'Large gold bracelet',
      'Silver necklace with a gemstone pendant',
      'Bronze crown',
      'Silk robe with gold embroidery',
      'Large well-made tapestry',
      'Brass mug with jade inlay',
      'Box of turquoise animal figurines',
      'Gold bird cage with electrum filigree',
    ]
  },
  100: {
    gold: 100,
    type: 'gem',
    items: [
      'Amber',
      'Amethyst',
      'Chrysoberyl',
      'Coral',
      'Garnet',
      'Jade',
      'Jet',
      'Pearl',
      'Spinel',
      'Tourmaline',
    ]
  },
  50: {
    gold: 50,
    type: 'gem',
    items: [
       'Bloodstone',
       'Carnelian',
       'Chalcedony',
       'Chrysoprase',
       'Citrine',
       'Jasper',
       'Moonstone',
       'Onyx',
       'Quartz',
       'Sardonyx',
       'Star Rose Quartz',
       'Zircon', 
    ]
  },
  25: {
    gold: 25,
    type: 'art',
    items: [
      'Silver Ewer',
      'Carved Bone Statuette',
      'Small Gold Bracelet',
      'Cloth-of-gold Vestments',
      'Black Velvet Mask (Stitched with silver thread)',
      'Copper chalice with silver filigree',
      'Pair of engraved bone dice',
      'Small mirror set in a painted wooden frame',
      'Embroidered sild handkerchief',
      'Gold locket with a painted portrait inside',
    ]
  },
  10: {
    gold: 10,
    type: 'gem',
    items: [
      'Azurite',
      'Banded Agate',
      'Blue Quartz',
      'Eye Agate',
      'Hematite',
      'Lapis Lazuli',
      'Malachite',
      'Moss Agate',
      'Obsidian',
      'Rhodochrosite',
      'Tiger Eye',
      'Turquoise',
    ]
  }
}