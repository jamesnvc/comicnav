function getInfo() {
  chrome.tabs.getSelected(null, function(tab) {
    var hostname = parseURL(tab.url).host;
    site_info = localStorage.getItem(hostname);
    if (site_info) {
      xpath_obj = $.parseJSON(site_info);
      html_str  = "<strong>Previous</strong>: <code>" + xpath_obj.prev + "</code></br>";
      html_str += "<strong>Next</strong>: <code>" + xpath_obj.next + "</code>";
      $('#site_bindings').html(html_str);
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
