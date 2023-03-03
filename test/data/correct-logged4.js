function doSomething(confirmation) {
    console.log(`Entering doSomething(${ confirmation }) at line 1`);
    if (confirmation === 'no') {
        throw new Error('Okay alright. Have a nice day.');
    }
}
doSomething('ok');