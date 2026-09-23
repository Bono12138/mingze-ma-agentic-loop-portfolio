const promptText = document.getElementById('prompt-text')?.textContent?.trim() || '';
async function copyPrompt(button) {
  const original = button.innerHTML;
  try {
    await navigator.clipboard.writeText(promptText);
    button.textContent = '已复制';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('prompt-text'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    button.textContent = '已选中，请按 Ctrl+C 复制';
  }
  window.setTimeout(() => { button.innerHTML = original; }, 3500);
}
for (const id of ['copy-prompt-bottom']) {
  document.getElementById(id)?.addEventListener('click', event => copyPrompt(event.currentTarget));
}
