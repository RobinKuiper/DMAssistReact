export const pageLimits = [
  {
    text: '10',
    value: 10
  },
  {
    text: '25',
    value: 25
  },
  {
    text: '50',
    value: 50
  },
  {
    text: '100',
    value: 100
  },
  {
    text: '200',
    value: 200
  },
]

export const calculateMod = (score) => {
  var mod = Math.floor((score-10)/2);
  var formatted = (mod > 0) ? '+' + mod : mod
  return { mod, formatted }
}

export const toSeconds = (time) => {
  var format = time.slice(-1).toUpperCase()
  time = time.slice(0, -1)
  switch (format) {
    case 'D': return time * 86400
    case 'H': return time * 3600
    case 'M': return time * 60
    default: return time
  }
}

export const formatTime = (seconds) => {
  var sec_num = parseInt(seconds, 10)
  var days    = Math.floor(sec_num / 86400)
  var hours   = Math.floor((sec_num - (days * 86400)) / 3600)
  var minutes = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60)
  seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60)

  days = (days < 1) ? '' : days + 'D'
  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds
  return days + " " + hours + ":" + minutes + ":" + seconds
}

/* eslint-disable */
export const Slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
/* eslint-enable */

export const formatCR = (cr) => {
  return (cr === 0.125) ? '1/8' : (cr === 0.25) ? '1/4' : (cr === 0.5) ? '1/2' : cr
}

export const CRtoEXP = (cr) => {
  var crToExp = {
    0: 10,
    0.125: 25,
    0.25: 50,
    0.5: 100,
    1: 200,
    2: 450,
    3: 700,
    4: 1100,
    5: 1800,
    6: 2300,
    7: 2900,
    8: 3900,
    9: 5000,
    10: 5900,
    11: 7200,
    12: 8400,
    13: 10000,
    14: 11500,
    15: 13000,
    16: 15000,
    17: 18000,
    18: 20000,
    19: 22000,
    20: 25000,
    21: 33000,
    22: 41000,
    23: 50000,
    24: 62000,
    25: 75000,
    26: 90000,
    27: 105000,
    28: 120000,
    29: 135000,
    30: 155000
  }

  return crToExp[cr]
}

export const formatNumber = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')