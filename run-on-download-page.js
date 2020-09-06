(() => {
	download();

	function download (element = document.querySelector('.mp3down')) {
		element.click();
		element.remove();
		setTimeout(download, 1000);
	}
})();
