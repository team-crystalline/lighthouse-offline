const api = window.LighthouseAPI;

async function init() {
    const settings = await api.readSettings();
    var hasSettings = Object.keys(settings).length > 0;
    const navBar = document.querySelector('#top-bar');
    const dirBtn = document.createElement('button');
    dirBtn.id = 'directory';
    dirBtn.textContent = hasSettings ? 'Change Folder' : 'Choose Folder';
    navBar.append(dirBtn);
    await addEvents();

    //#region Page Events ----
    const systemsPage = document.getElementById('systems-page');
    const journalsPage = document.getElementById('journals-page');

    if (systemsPage){
        await api.readSystems();
    }

    if (journalsPage){
        await api.readJournals();
    }
    //#endregion ----
}

async function addEvents() {
    document.querySelector("#directory").addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        const { ok, dir } = await api.chooseDir();
        if (!ok) return;
    });
}

init();