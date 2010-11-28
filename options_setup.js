function editItem (item) {
  var row = item[0].parentNode.parentNode;
  var items = $('td', row);
  var prev_xpath = items[1].innerHTML;
  var next_xpath = items[2].innerHTML;

  var prev_in = document.createElement('input');
  prev_in.setAttribute('value', prev_xpath);
  prev_in.setAttribute('class', 'prev_xpath');
  var prev_td = document.createElement('td');
  prev_td.appendChild(prev_in);
  $(items[1]).replaceWith(prev_td);

  var next_in = document.createElement('input');
  next_in.setAttribute('value', next_xpath);
  next_in.setAttribute('class', 'next_xpath');
  var next_td = document.createElement('td');
  next_td.appendChild(next_in);
  $(items[2]).replaceWith(next_td);

  $('.editItem', row).removeClass('editItem').addClass('saveItem').text('Save');
}

function unescapeHTML(str) {
  return $('<p></p>').html(str).text();
}

function saveItem (item) {
  var row = item[0].parentNode.parentNode;
  var items = $('td', row);
  var hostname = items[0].innerHTML;
  var prev_xpath = $('input.prev_xpath', row).attr('value');
  var next_xpath = $('input.next_xpath', row).attr('value');
  var obj_str = "{\"next\": \"" + next_xpath.replace(/"/g, '\\u0022') +
    "\", \"prev\": \"" + prev_xpath.replace(/"/g, '\\u0022') + "\"}";
  localStorage.setItem(hostname, obj_str);

  var prev_td = document.createElement('td');
  prev_td.appendChild(document.createTextNode(unescapeHTML(prev_xpath)));
  $(items[1]).replaceWith(prev_td);

  var next_td = document.createElement('td');
  next_td.appendChild(document.createTextNode(unescapeHTML(next_xpath)));
  $(items[2]).replaceWith(next_td);

  $('.saveItem', row).removeClass('saveItem').addClass('editItem').text('Edit');
}

function delItem (item) {
  var row = item[0].parentNode.parentNode;
  // Hostname is the first entry in the row
  var hostname = $('td', row)[0].innerHTML;
  localStorage.removeItem(hostname);
  $(row).remove();
}

function options_init () {
  $('#add_comic_info').submit(function (event) {
    event.preventDefault();
    var uri = trimmed_uri($('#uri').val());
    var next_xpath = $('#next').val().replace(/"/g, '\\u0022');
    var prev_xpath =$('#prev').val().replace(/"/g, '\\u0022');
    var obj_str = '{"next": "' + next_xpath + '", "prev": "' + prev_xpath + '"}';
    localStorage.setItem(uri, obj_str);
    display_current_sites();
    });
  display_current_sites();

  $("#uri").val("http://xkcd.com/");
  $("#prev").val("//div[@class=\"menuCont\"]/ul/li/a[text()=\"< Prev\"]");
  $("#next").val("//div[@class=\"menuCont\"]/ul/li/a[text()=\"Next >\"]");
  $('.delItem').live('click', function(evt) {
    evt.preventDefault();
    var item = $(this);
    delItem(item);
  });
  $('.editItem').live('click', function(evt) {
    evt.preventDefault();
    var item = $(this);
    editItem(item);
  });
  $('.saveItem').live('click', function(evt) {
    evt.preventDefault();
    var item = $(this);
    saveItem(item);
  });
}

function display_current_sites () {
  var tbl = "";
  for (var elt in localStorage) {
    var str = "<tr><td>" + elt + "</td>";
    var sel;
    try {
      sel = $.parseJSON(localStorage.getItem(elt));
    } catch (e) {
      console.error("Failed to parse JSON!");
      console.error(e);
      return;
    }
    str += ('<td>' + sel['prev'] + '</td><td>' + sel['next'] + '</td><td>' +
        '<a href="#" class="delItem">Delete</a>&nbsp;<a href="#" class="editItem">' +
        'Edit</a></td></tr>');
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
