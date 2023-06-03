const handlerFinishWithError = (elements) => {
  elements.input.classList.add('is-invalid');
};

const handlerSuccessFinish = (elements) => {
  elements.input.classList.remove('is-invalid');
  elements.input.focus();
  elements.form.reset();
};

const handlerProcessState = (elements, state, value) => {
  switch (value) {
    case 'filling':
      break;
    case 'finished':
      handlerSuccessFinish(elements);
      break;
    case 'error':
      handlerFinishWithError(elements, state.process.error);
      break;
    case 'sending':
      break;
    default:
      throw new Error(`Unknown process state: ${value}`);
  }
};

export default (elements, state) => (path, value) => {
  switch (path) {
    case 'process.processState':
      handlerProcessState(elements, state, value);
      break;

    default:
      break;
  }
};
