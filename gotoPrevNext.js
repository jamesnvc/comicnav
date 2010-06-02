var xpath_obj = { };
var recieved = false;

function clickXPath(xpath_str) {
  var e = new XPathEvaluator();
  var r = e.evaluate(xpath_str,document.documentElement, null, 
                     XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  window.location = r.singleNodeValue.href;
}

function getXPath() {
  var uri_root = window.location.hostname;
  chrome.extension.onRequest.addListener(
    function(request, sender, sendResp) {
      if (request.name == "gotPageXPath") {
        xpath_obj = request.xpath;
        recieved = true;
        sendResp({});
        maybeInstall();
      }
    });
  chrome.extension.sendRequest({name: "getPageXPath", hostname: uri_root},
                               function (response){ });
}

function gotoPrev() {
  var xpath = xpath_obj.prev;
  clickXPath(xpath);
}

function gotoNext() {
  var xpath = xpath_obj.next;
  clickXPath(xpath);
}

function maybeInstall () {
  if (xpath_obj != undefined &&
      xpath_obj.prev != undefined &&
      xpath_obj.next != undefined) {
    console.log("Adding keybindings for this site!");
    $(document).keyup(function (event) {
      if (event.keyCode == '39') { // Right arrow
        event.preventDefault();
        gotoNext();
      } else if (event.keyCode == '37') { // Left arrow
        event.preventDefault();
        gotoPrev();
      }
    });
    console.log("Installed keyup handler");
  };
}

function setup() {
  getXPath();
}

$(document).ready(setup);