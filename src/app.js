import { string, setLocale } from 'yup';
import onChange from 'on-change';
import render from './view.js';

const validate = (url, urlList) => {
  const schema = string().trim().required().url().notOneOf(urlList);
  return schema.validate(url);
};

export default () => {
  const initialState = {
    inputValue: '',
    valid: true,
    process: {
      processState: 'filling',
      error: '',
    },
    content: {
      feeds: [],
    },
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('input[id="url-input"]'),
    button: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modal: {
      modalWindow: document.querySelector('.modal'),
      title: document.querySelector('.modal-title'),
      body: document.querySelector('.modal-body'),
      button: document.querySelector('.full-article'),
    },
  };

  const watchedState = onChange(initialState, render(elements, initialState));

  elements.form.addEventListener('input', (e) => {
    e.preventDefault();
    watchedState.process.processState = 'filling';
    watchedState.inputValue = e.target.value;
    console.log('filling');
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const urlList = watchedState.content.feeds.map(({ link }) => link);

    validate(watchedState.inputValue, urlList)
      .then(() => {
        watchedState.valid = true;
        watchedState.process.processState = 'sending';
        console.log('sending');
      })
      .then(() => {
        watchedState.content.feeds.push({ link: watchedState.inputValue });
        watchedState.process.processState = 'finished';
        console.log('finished');
      })
      .catch((error) => {
        watchedState.valid = false;
        watchedState.process.error = error.message ?? 'defaultError';
        watchedState.process.processState = 'error';
        console.log('error');
      });
  });
};
