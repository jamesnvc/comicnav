function add_shortcuts (hostname) {
  var next_xpath = $('#next').val().replace(/"/g, '\\u0022');
  var prev_xpath =$('#prev').val().replace(/"/g, '\\u0022');
  var obj_str = "{\"next\": \"" + next_xpath + "\", \"prev\": \"" + prev_xpath + "\"}";
  localStorage.setItem(hostname, obj_str);
  $('#debug').text(obj_str);
  getInfo();
  chrome.tabs.getSelected(null, function(tab) {
    var rqst = { 'from': "popup", 'wants': 'reload' };
    chrome.tabs.sendRequest(tab.id, rqst);
  });
}

function getInfo() {
  chrome.tabs.getSelected(null, function(tab) {
    var hostname = parseURL(tab.url).host;
    site_info = localStorage.getItem(hostname);
    if (site_info) { // Bindings exist for this site; show them
      xpath_obj = $.parseJSON(site_info);
      html_str  = "<strong>Previous</strong>: <code>" + xpath_obj.prev + "</code></br>";
      html_str += "<strong>Next</strong>: <code>" + xpath_obj.next + "</code>";
      $('#site_bindings').html(html_str);
    } else { // No bindings exist; set up form to add bindings
      $('#add_shortcut').submit(function (event) { 
        event.preventDefault();
        add_shortcuts(hostname);
      });
    }
  });
}

function parseURL(url) { 
  var loc      = { 'href' : url };
  var parts    = url.replace('//', '/').split('/');
  loc.protocol = parts[0];
  loc.host     = parts[1];
  parts[1]     = parts[1].split(':');
  loc.hostname = parts[1][0];
  return loc; 
}

$(document).ready(getInfo);
