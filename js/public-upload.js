(() => {
  const modal = UI.$('nameModal');
  UI.$('startUpload').addEventListener('click', () => modal.classList.replace('hidden', 'flex'));
  UI.$('closeModal').addEventListener('click', () => modal.classList.replace('flex', 'hidden'));
  UI.$('nameForm').addEventListener('submit', async event => { event.preventDefault(); const name = UI.$('customerName').value.trim(); modal.classList.replace('flex', 'hidden'); try { await CloudinaryService.upload(name); } catch (error) { UI.toast(error.message, true); } });
})();
