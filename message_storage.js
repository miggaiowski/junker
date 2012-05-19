chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getStatus")
      sendResponse({status: localStorage['perf']});
    else
      sendResponse({}); // snub them.
});
