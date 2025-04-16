const isThisRefsValid = (refs) => {
  let result = []
  for (const name of Object.keys(refs)) {
    const refElement = Array.isArray(refs[name]) ? refs[name].at(0) : refs[name]
    if (refElement?.rules?.length && refElement.errorHandler) {
      result.push(refElement.errorHandler())
    }
  }
  result = result.every((el) => !el)
  return result
}

const fieldErrorHandler = (rules, value) => {
  let hasError = false
  if (Array.isArray(rules) && rules.length) {
    let i = 0
    while (i < rules.length) {
      const result = rules[i](value)
      if (['string', 'object'].includes(typeof result)) {
        hasError = result
        break
      } else if (!hasError) {
        hasError = false
      }
      i++
    }
    return hasError
  } else {
    console.log('rules must be an array')
  }
}

const apiFieldsErrorHandler = ({ errors, refs }) => {
  if (errors.length && errors.some((el) => el.field)) {
    errors.forEach((error) => {
      if (error.field) {
        Object.keys(refs).forEach((refKey) => {
          if (
            refs[refKey].rules &&
            refs[refKey].errorHandler &&
            refKey === error.field // ref name and error.field name must match
          ) {
            refs[refKey].errorMsg = error.content
          }
        })
      }
    })
  }
}

// RULES RULES RULES RULES RULES
const required = (v, message) => {
  const checkValue = Array.isArray(v)
    ? v?.length
    : typeof v === 'object' && v !== null
    ? Object.keys(v)?.length
    : !!v
  return !!checkValue || message || 'validators.required'
}

const email = (v, message) =>
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
    v
  ) ||
  message ||
  'validators.email'

const phone = (v, message) => {
  const phone_number = v.replace(/\s+/g, '')
  if (phone_number.length >= 9 && phone_number.match(/^\+?[\d]{6,20}$/)) {
    return true
  } else {
    return message || 'validators.phone'
  }
}

const url = (v, message) =>
  /^((ftp|http|https):\/\/)(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/\w+(\.\w+)?)*\/?(\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/.test(
    v
  ) ||
  message ||
  'validators.url'

const minLength = (v, minLength, message) =>
  v.length >= minLength || message || { path: 'validators.minLength', args: { minLength } }

const min = (v, min, message) => v >= min || message || { path: 'fields_rules.min', args: { min } }

const max = (v, max, message) => v <= max || message || { path: 'fields_rules.max', args: { max } }

const mismatch = (value1, value2, fieldName, message) =>
  value1 === value2 || message || { path: 'validators.equalTo', args: { fieldName } }

const dateInRange = (minDate, maxDate, selectDate, messagefew, messageLot) => {
  return selectDate.valueOf() > maxDate.valueOf()
    ? messagefew || 'fields_rules.dateIsFew'
    : selectDate.valueOf() < minDate.valueOf()
    ? messageLot || 'fields_rules.dateIsLot'
    : ''
}

const containsNumber = (v, message) => /\d/.test(v) || message || 'validators.containsNumber'

const containsSymbol = (v, message) =>
  /[|\\/~^:,;?!&%$#@*+()]/.test(v) || message || 'validators.containsSymbol'

const containsUpperCase = (v, message) =>
  /(?=.*[A-Z])/.test(v) || message || 'validators.containsUpperCase'

const containsLowerCase = (v, message) =>
  /(?=.*[a-z])/.test(v) || message || 'validators.containsLowerCase'

const passwordsMatch = (v, password, message) =>
  v === password || message || { path: 'validators.passwordsMatch', args: { password } }

export {
  required,
  email,
  phone,
  url,
  min,
  max,
  minLength,
  mismatch,
  dateInRange,
  containsNumber,
  containsSymbol,
  containsUpperCase,
  containsLowerCase,
  passwordsMatch,
  isThisRefsValid,
  fieldErrorHandler,
  apiFieldsErrorHandler
}
