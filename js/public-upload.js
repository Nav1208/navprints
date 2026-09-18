(() => {
  const modal = UI.byId('nameModal');

  UI.byId('startUpload').addEventListener('click', () => {
    modal.classList.replace('hidden', 'flex');
    UI.byId('customerName').focus();
  });

  UI.byId('closeModal').addEventListener('click', () => {
    modal.classList.replace('flex', 'hidden');
  });

  UI.byId('nameForm').addEventListener('submit', async event => {
    event.preventDefault();
    const customerName = UI.byId('customerName').value.trim();
    modal.classList.replace('flex', 'hidden');

    try {
      await CloudinaryService.openWidget(customerName);
    } catch (error) {
      UI.toast(error.message, true);
    }
  });
})();
