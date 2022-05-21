// Container for all the helpers
var helpers = {}

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = (extraConfuscation, strLength) => {
  strLength = typeof strLength == 'number' && strLength > 0 ? strLength : false
  if (strLength) {
    // Define all the possible characters that could go into a string !@#$%^&*()=+
    let possibleCharacters =
      'abcdefghijklmnopqrstuvwxyz0123456789' +
      (extraConfuscation ? '!@#$%^&*()=+' : '') +
      'abcdefghijklmnopqrstuvwxyz'.toUpperCase()

    // Start the final string
    let str = ''
    for (let i = 1; i <= strLength; i++) {
      // Get a random character from the possibleCharacters string
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      )
      // Append this character to the string
      str += randomCharacter
    }
    // Return the final string
    return str
  } else {
    return false
  }
}

// Use method createRandomString to form complex string based on segment lengths
helpers.createComplexString = (segments) => {
  // Returns multipart hyphenated random string
  return String(
    segments.map((segment) => helpers.createRandomString(false, segment))
  ).replaceAll(',', '-')
}

helpers.waitFor = (conditionFunction) => {
  const poll = (resolve) => {
    if (conditionFunction()) resolve()
    else setTimeout((_) => poll(resolve), 100)
  }

  return new Promise(poll)
}

helpers.asyncWait = async (wait) =>
  new Promise((resolve) => setTimeout(resolve, wait))

helpers.genericTypes = {
  string: '',
  number: 0,
  double: 0.0,
  boolean: false,
  array: [],
  object: {},
}

// Export the module
export default helpers
