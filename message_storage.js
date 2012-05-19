chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if(request.method == "get"){
    
    if(!localStorage.perf)
      sendResponse( { userData: null } );
    else
      sendResponse( { userData: JSON.parse(localStorage.perf) });
    
  } else if(request.method == "set"){
    if(request.userData)
      localStorage.perf = JSON.stringify(request.userData);
      
    sendResponse( {} );
  }
});
