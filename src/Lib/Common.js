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

export const Slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

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
    4: '1.100',
    5: '1.800',
    6: '2.300',
    7: '2.900',
    8: '3.900',
    9: '5.000',
    10: '5.900',
    11: '7.200',
    12: '8.400',
    13: '1.0000',
    14: '11.500',
    15: '13.000',
    16: '15.000',
    17: '18.000',
    18: '20.000',
    19: '22.000',
    20: '25.000',
    21: '33.000',
    22: '41.000',
    23: '50.000',
    24: '62.000',
    25: '75.000',
    26: '90.000',
    27: '105.000',
    28: '120.000',
    29: '135.000',
    30: '155.000'
  }

  return crToExp[cr]
}
