{
    const MESSAGES = {
        LOG_PREFIX: 'Track',
        CLOSING_MODAL: 'Closing modal',
        NO_CLOSE_BUTTON: 'No close button found',
        NO_PLAYLIST_BUTTON: 'No "Add to Playlist" button found',
        ADDING_TO_PLAYLIST: 'Adding to playlist',
        ALREADY_IN_PLAYLIST: 'Skipped - already in playlist',
        NO_ADD_TO_SET_BUTTON: 'No "Add to Set" button found',
        CLICKING_ADD_TO_SET: 'Clicking "Add to Set"',
        ADD_TO_CHECK: 'add to'
    };

    const DELAYS = {
        UI_UPDATE: 1_300,
        ADD_TO_PLAYLIST: 2_500,
        CLOSE_MODAL: 5_00,
        TRACK_STAGGER: 1_000
    };

    const SELECTORS = {
        MORE_BUTTON: '.sc-button-more',
        ADD_TO_SET: '.sc-button-addtoset',
        ADD_TO_PLAYLIST: '.addToPlaylistButton',
        CLOSE_MODAL: '.modal__closeButton'
    };

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function logAction(message, trackIndex) {
        console.log(`${MESSAGES.LOG_PREFIX} ${trackIndex + 1}: ${message}`);
    }

    function logWarning(message, trackIndex) {
        console.warn(`${MESSAGES.LOG_PREFIX} ${trackIndex + 1}: ${message}`);
    }

    async function closeModal(trackIndex) {
        await wait(DELAYS.CLOSE_MODAL);

        const closeButton = document.querySelector(SELECTORS.CLOSE_MODAL);
        if (!closeButton) {
            logWarning(MESSAGES.NO_CLOSE_BUTTON, trackIndex);
            return;
        }

        logAction(MESSAGES.CLOSING_MODAL, trackIndex);
        closeButton.click();
    }

    async function addToPlaylist(trackIndex) {
        await wait(DELAYS.ADD_TO_PLAYLIST);

        const playlistButton = document.querySelector(SELECTORS.ADD_TO_PLAYLIST);
        if (!playlistButton) {
            logWarning(MESSAGES.NO_PLAYLIST_BUTTON, trackIndex);
            return;
        }

        const isAddable = playlistButton.textContent.toLowerCase().includes(MESSAGES.ADD_TO_CHECK);
        if (!isAddable) {
            logAction(MESSAGES.ALREADY_IN_PLAYLIST, trackIndex);
            return;
        }

        logAction(MESSAGES.ADDING_TO_PLAYLIST, trackIndex);
        playlistButton.click();

        await closeModal(trackIndex);
    }

    async function openAddToSetMenu(trackIndex) {
        await wait(DELAYS.UI_UPDATE);

        const addButton = document.querySelector(SELECTORS.ADD_TO_SET);
        if (!addButton) {
            logWarning(MESSAGES.NO_ADD_TO_SET_BUTTON, trackIndex);
            return;
        }

        logAction(MESSAGES.CLICKING_ADD_TO_SET, trackIndex);
        addButton.click();

        await addToPlaylist(trackIndex);
    }

    async function processTrack(track, trackIndex) {
        track.click();
        await openAddToSetMenu(trackIndex);
    }

    function processAllTracks() {
        const allTracks = document.querySelectorAll(SELECTORS.MORE_BUTTON);

        allTracks.forEach((track, index) => {
            setTimeout(() => {
                processTrack(track, index);
            }, index * DELAYS.TRACK_STAGGER);
        });
    }

    processAllTracks();
}