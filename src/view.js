const handlerFinishWithError = (elements, error, i18nInstance) => {
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.add('text-danger');
  elements.feedback.textContent = i18nInstance.t(
    `errors.${error.replace(/ /g, '')}`
  );

  elements.input.classList.add('is-invalid');
};

const handlerSuccessFinish = (elements, i18nInstance) => {
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.add('text-success');
  elements.feedback.textContent = i18nInstance.t('sucсess');

  elements.input.classList.remove('is-invalid');
  elements.input.focus();
  elements.form.reset();
};

const handlerProcessState = (elements, state, value, i18nInstance) => {
  switch (value) {
    case 'filling':
      break;
    case 'finished':
      handlerSuccessFinish(elements, i18nInstance); // change name?
      break;
    case 'error': // можно ли это убрать и оставить только в главной функции?
      handlerFinishWithError(elements, state.process.error, i18nInstance);
      break;
    case 'sending':
      break;
    default:
      throw new Error(`Unknown process state: ${value}`);
  }
};

// нужен ли этот switch?

export default (elements, state, i18nInstance) => (path, value) => {
  switch (path) {
    case 'process.processState':
      handlerProcessState(elements, state, value, i18nInstance);
      break;

    default:
      break;
  } // нужна ли тут обработка error???
};
