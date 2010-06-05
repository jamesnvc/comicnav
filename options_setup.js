function options_init () {
  $('#add_comic_info').submit(function (event) {
    event.preventDefault();
    var uri = trimmed_uri($('#uri').val());
    var next_xpath = $('#next').val().replace(/"/g, '\\u0022');
    var prev_xpath =$('#prev').val().replace(/"/g, '\\u0022');
    var obj_str = "{\"next\": \"" + next_xpath + "\", \"prev\": \"" + prev_xpath + "\"}";
    localStorage.setItem(uri, obj_str);
    display_current_sites();
    }
  );
  display_current_sites();

  $("#uri").val("xkcd.com");
  $("#prev").val("//div[@class=\"menuCont\"]/ul/li/a[text()=\"< Prev\"]");
  $("#next").val("//div[@class=\"menuCont\"]/ul/li/a[text()=\"Next >\"]");
}
function display_current_sites () {
  var tbl = "";
  for (var elt in localStorage) {
    var str = "<tr><td>" + elt + "</td>";
    var sel;
    try {
      sel = $.parseJSON(localStorage.getItem(elt));
    } catch (e) {
      console.log("Failed to parse JSON!");
      console.log(e);
      return;
    }
    str += "<td>" + sel["prev"] + "</td><td>" + sel["next"] + "</td></tr>";
    tbl += str;
  }
  $('tbody#sites').html(tbl);
}

function trimmed_uri (uri) {
  return /^(http:\/\/)([^/]*)(\/.*$)/.exec(uri)[2];
}

$(document).ready(function () {
  options_init();
});
