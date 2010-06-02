function getInfo() {
  var site_info = localStorage.getItem(window.location.hostname);
  if (site_info) {
    xpath_obj = $.parseJSON(site_info);
    html_str  = "<strong>Previous</strong>: " + xpath_obj.prev + "</br>";
    html_str += "<strong>Next</strong>: " + xpath_obj.next + "</br>";
    $('#site_bindings').html(html_str);
  }
}

$(document).ready(getInfo);