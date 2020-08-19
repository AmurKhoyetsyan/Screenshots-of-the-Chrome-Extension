;(function(){
    let topTacke = document.querySelector("#topTacke");
    let partTacke = document.querySelector("#partTacke");

    topTacke.addEventListener('click', function(event){
        let params = {
            active: true,
            currentWindow: true
        };

        chrome.tabs.query(params, topCapture);

        function topCapture(tabs) {
            chrome.tabs.captureVisibleTab(null, {}, function(dataUri){

                let msg = {
                    data: dataUri,
                    type: 'top'
                };

                chrome.tabs.sendMessage(tabs[0].id, msg);
                window.close();
            });
        }
    });

    partTacke.addEventListener('click', function(event){
        let params = {
            active: true,
            currentWindow: true
        };

        chrome.tabs.query(params, topCapture);

        function topCapture(tabs) {
            chrome.tabs.captureVisibleTab(null, {}, function(dataUri){

                let msg = {
                    data: dataUri,
                    type: 'part'
                };

                chrome.tabs.sendMessage(tabs[0].id, msg);
                window.close();
            });
        }
    });
})();