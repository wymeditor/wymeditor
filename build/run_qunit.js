/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx Callback that evaluates to a boolean,
 * @param onReady Callback to execute on succesful completion
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = testFx();
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("# 'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    // console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 100ms
}


if (phantom.args.length === 0 || phantom.args.length > 2) {
    console.log('Usage: run-qunit.js URL');
    phantom.exit(1);
}

var page = new WebPage();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

// Open the URL of the first argument, wait for the results to finish and then output a summary.
// Exists with 0 on success, 1 with failures, 2 with a phantomjs error
page.open(phantom.args[0], function(status){
    if (status !== "success") {
        console.log("Unable to access network");
        phantom.exit(2);
    } else {
        waitFor(
            function(){
                return page.evaluate(function(){
                    var el = document.getElementById('qunit-testresult');
                    if (el && el.innerText.match('completed')) {
                        return true;
                    }
                    return false;
                });
            },
            function(){
                // Output the summary and return 1 if it was an all-pass
                var returnCode = page.evaluate(function() {
                    var failString = '';
                    var results = document.getElementById('qunit-testresult');
                    console.log(results.innerText);
                    try {
                        failString = el.getElementsByClassName('failed')[0].innerHTML;
                    } catch (e) { }
                    if (parseInt(failString, 10) > 0) {
                        return 1; // Failures
                    }
                    return 0; // All pass
                });
                phantom.exit(returnCode);
            },
            15000 // 15 seconds timeout
       );
    }
});
