import Rx from 'Rx';

const _input = $('#input');
const _results = $('#results');

const keyup$ = Rx.Observable.fromEvent(_input, 'keyup')
  .map(ev => ev.target.value)
  .filter(text => text.length >= 3);

const debouncedKeyup$ = keyup$.debounce(500);
const distinct$ = debouncedKeyup$.distinctUntilChanged();

function searchWikipedia (term) {
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
    let res = data[1];
    _results.empty();
    res.forEach(item => $(`<li>${item}</li>`).appendTo(_results));

    $('<h2> Brief Description </h2>').appendTo(_results);
    $(`<p>${data[2][0]}</p>`).appendTo(_results);
  }, error => {
    /* handle any errors */
    _results.empty();

    $(`<li>Error: ${error}</li>`).appendTo(_results);
});
