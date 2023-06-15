import { string, setLocale } from 'yup';
import onChange from 'on-change';
import render from './view.js';
import i18next from 'i18next';
import resources from './locales/index.js';

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

const validate = (url, urlList) => {
  const schema = string().trim().required().url().notOneOf(urlList);
  return schema.validate(url);
};

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance
    .init({
      lng: 'ru',
      debug: true,
      resources,
    })
    .then(() => {
      const watchedState = onChange(
        initialState,
        render(elements, initialState, i18nInstance)
      );

      setLocale({
        mixed: {
          notOneOf: 'doubleRss',
          required: 'emptyField', // надо ли?
        },
        string: {
          url: 'invalidUrl',
        },
      });

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
    });
};
