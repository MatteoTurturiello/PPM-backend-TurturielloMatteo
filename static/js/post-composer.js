document.addEventListener('DOMContentLoaded', () => {
  const composer = document.querySelector('[data-post-composer]');
  if (!composer) {
    return;
  }

  const textarea = composer.querySelector('textarea');
  const buttons = composer.querySelectorAll('[data-emoji]');
  const fileInput = composer.querySelector('input[type="file"]');
  const fileLabel = composer.querySelector('[data-selected-file]');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!textarea) {
        return;
      }
      const emoji = button.getAttribute('data-emoji') || '';
      const start = textarea.selectionStart ?? textarea.value.length;
      const end = textarea.selectionEnd ?? textarea.value.length;
      textarea.value = `${textarea.value.slice(0, start)}${emoji}${textarea.value.slice(end)}`;
      textarea.focus();
      const caret = start + emoji.length;
      textarea.setSelectionRange(caret, caret);
    });
  });

  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      const [file] = fileInput.files || [];
      fileLabel.textContent = file ? `File selezionato: ${file.name}` : 'Nessun file selezionato.';
    });
  }
});
