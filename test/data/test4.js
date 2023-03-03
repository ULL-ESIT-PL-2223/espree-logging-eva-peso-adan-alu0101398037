function doSomething(confirmation) {
  if (confirmation === 'no') {
    throw new Error('Okay alright. Have a nice day.');
  }
}
doSomething('ok');