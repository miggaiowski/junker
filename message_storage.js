chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getStatus"){
      var aux = JSON.parse(localStorage.perf);
      console.info(aux);
      sendResponse({status: aux});
    }
    else{
      sendResponse({}); // snub them.
    }
});
