import Rx from 'Rx';

const _input = $('.input');
const _results = $('.results');
const _resultDescription = $('.result-description');

const keyup$ = Rx.Observable.fromEvent(_input, 'keyup')
  .map(ev => ev.target.value);

const debouncedKeyup$ = keyup$.debounce(500);
const distinct$ = debouncedKeyup$.distinctUntilChanged();

function searchWikipedia(term) {
  return $.ajax({
    url: 'http://en.wikipedia.org/w/api.php',
    dataType: 'jsonp',
    data: {
        action: 'opensearch',
        format: 'json',
        search: term
    }
  }).promise();
}

const suggestion$ = keyup$.flatMapLatest(searchWikipedia);

suggestion$.subscribe(data => {
  _results.empty();
  _resultDescription.empty();

  if(data[0] !== '') {
    let res = data[1];
    res.forEach(item => $(`<li class="list-item">${item}</li>`).appendTo(_results));

    $('<h2> Brief description </h2>').appendTo(_resultDescription);
    $(`<p>${data[2][0]}</p>`).appendTo(_resultDescription);
  }
}, error => {
  _results.empty();

  $(`<li>Error: ${error}</li>`).appendTo(_results);
});
