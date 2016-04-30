import Rx from 'Rx';

const _input = $('.input');
const _results = $('.results');

const people = [
  {name: 'John', phone: '555-4321'},
  {name: 'Johanna', phone: '555-8765'},
  {name: 'Mario', phone: '555-1357'},
  {name: 'Luigi', phone: '555-8264'},
  {name: 'Zuirio', phone: '555-0091'}
];

const keyup$ = Rx.Observable.fromEvent(_input, 'keyup')
  .map(ev => ev.target.value)
  .debounce(500);

const people$ = Rx.Observable.of(people)
  .merge(keyup$)
  .scan((list, value) => people.filter(item => item.name.includes(value)));

people$.subscribe(data => {
  _results.empty();

  data.forEach(item => $(`<li>${item.name} - ${item.phone}</li>`).appendTo(_results))
}, error => {
  _results.empty();

  $(`<li>Error: ${error}</li>`).appendTo(_results);
});
