function click_xpath(xpath_str) {
  var e = new XPathEvaluator();
  var r = e.evaluate(xpath_str,
    document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  r.singleNodeValue.click(); // Use '.click' instead?
}

function trimmed_uri (uri) {
  var copy = new String(uri);
  return copy.replace(/^http:\/\/[^/]*(\/.*$)/, "");
}

function get_xpath() {
  var uri_root = window.location.hostname;
  var res;
  chrome.extension.sendRequest({name: "getPageXPath", hostname: uri_root},
                               function(response) {
                                 console.log("Response:");
                                 console.log(response);
                                 res = response;
                               });
  console.log("Res:");
  console.log(res);
  return res;
}

function goto_prev() {
  var xpath = get_xpath()["prev"];
  click_xpath(xpath);
}

function goto_next() {
  var xpath = get_xpath()["next"];
  click_xpath(xpath);
}

function setup() {
  console.log("Checking for " + trimmed_uri(window.location.hostname));
  if (get_xpath() != undefined) {
    console.log("Adding keybindings for this site!");
    $('document').keyup(function (event) {
      console.log("Key pressed");
      if (event.keyCode == '39') {
        event.preventDefault();
        goto_next();
      } else if (event.keyCode == '37') {
        event.preventDefault();
        goto_prev();
      }
    });
  };
}

$(document).ready(setup);