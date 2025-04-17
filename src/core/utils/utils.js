const getCookie = (name) => {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const dateFormat = (
  date,
  { format = 'date', locale = 'es-ES', separator = null, formatIsTemplate } = {}
) => {
  const formatKeys = {
    year: 'YYYY',
    month: 'MM',
    day: 'DD',
    hour: 'HH',
    minute: 'mm',
    second: 'ss'
  }

  const options = {
    date: { year: 'numeric', month: '2-digit', day: '2-digit' },
    'HH:mm': {
      hour: '2-digit',
      minute: '2-digit'
    },
    ddMMyyyy: { day: '2-digit', month: '2-digit', year: 'numeric' },
    'DD-MM-YYYY': {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    'YYYY-MM-DD HH:mm:ss': {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    },
    'DD/MM/YYYY HH:mm:ss': {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    },
    'DD/MM/YYYY': {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    'HH:mm:ss': {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    },
    ddMMM: {
      month: 'short',
      day: 'numeric'
    }
  }

  function formatt(item, data) {
    const f = new Intl.DateTimeFormat(locale, item)
    const formatValue = f.format(Date.parse(data))
    return formatValue.length === 1 ? `0${formatValue}` : formatValue
  }

  function getFormatDate(t, a, s) {
    const o = Object.entries(a).map(([key, value]) => ({ [key]: value }))
    return o.map((item) => formatt(item, t)).join(s)
  }

  function replaceFormate(date, format, formatValues) {
    let result = format.toLowerCase()
    const formatValuesKeys = Object.keys(formatValues) //.map(([key, value]) => ({ [key]: value }));
    formatValuesKeys.forEach((key) => {
      const formatedValue = formatt({ [key]: formatValues[key] }, date)
      const keyForReplace = formatKeys[key]?.toLowerCase()
      if (keyForReplace) {
        result = result.replace(keyForReplace, formatedValue)
      }
    })
    return result
  }

  if (!(date instanceof Date)) {
    if (!date) return
    date = new Date(date)
  }

  if (separator !== null) {
    return getFormatDate(date, options[format], separator)
  }
  if (formatIsTemplate) {
    return replaceFormate(date, format, options[format])
  }
  return new Intl.DateTimeFormat(locale, options[format]).format(Date.parse(date))
}

const makeid = (length = 7) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const base64EncodeUrl = (str) => {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '')
}

const saveAs = (data, name = 'file', type = 'text/csv') => {
  // Creating a Blob for having a csv file format
  // and passing the data with type
  const blob = new Blob([data], { type: type })

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob)

  // Creating an anchor(a) tag of HTML
  const a = document.createElement('a')

  // Passing the blob downloading url
  a.setAttribute('href', url)

  // Setting the anchor tag attribute for downloading
  // and passing the download file name
  a.setAttribute('download', name)

  // Performing a download with click
  a.click()
  setTimeout(() => {
    a.remove()
  })
}

const isEmpty = (obj) => {
  for (const key in obj) {
    return false
  }

  if (typeof obj === 'number') {
    return false
  }

  return true
}

const valueIsNotPrimitiveType = (value) => {
  return !['string', 'number'].includes(typeof value)
}

const copyToClipboard = (text) => {
  const textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  document.execCommand('copy')
  document.body.removeChild(textArea)
}

const cloneDeep = (json) => JSON.parse(JSON.stringify(json))

const isValidDate = (value) => {
  const dateWrapper = new Date(value)
  return !isNaN(dateWrapper.getDate())
}

function getUniqueColorByFirstLetter(name) {
  if (!name || !String(name)) return
  // get first alphabet in upper case
  const firstAlphabet = name.charAt(0).toLowerCase()

  // get the ASCII code of the character
  const asciiCode = firstAlphabet.charCodeAt(0)

  // number that contains 3 times ASCII value of character -- unique for every alphabet
  const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString()

  var num = Math.round(0xffffff * parseInt(colorNum))
  var r = (num >> 16) & 255
  var g = (num >> 8) & 255
  var b = num & 255

  return 'rgb(' + r + ', ' + g + ', ' + b + ', 0.3)'
}

const asyncSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const sortArrayObjects = ({ sortedBy, sortedDir }) => {
  const sortedTypes = { ASC: 'asc', DESC: 'desc' }
  return (a, b) => {
    let valA = a[sortedBy]
    let valB = b[sortedBy]
    if (isValidDate(a[sortedBy])) {
      valA = new Date(a[sortedBy])
      valB = new Date(b[sortedBy])
    }
    if (sortedDir !== sortedTypes.ASC) {
      return valA < valB ? -1 : 1
    }
    return valB > valA ? 1 : -1
  }
}

const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const asset = (path) => {
  const result = `${import.meta.env.BASE_URL}${path}`
  console.log('asset', result)

  return result
}

export {
  getCookie,
  dateFormat,
  makeid,
  base64EncodeUrl,
  saveAs,
  isEmpty,
  valueIsNotPrimitiveType,
  copyToClipboard,
  cloneDeep,
  isValidDate,
  getUniqueColorByFirstLetter,
  asyncSleep,
  sortArrayObjects,
  deepClone,
  asset
}
