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
    const homePage = document.getElementById('home-page');

    if (systemsPage) {
        const systems = await api.readSystems();
        
        let systemDivArr=[];
        systems.forEach((sys)=> {
            console.log(sys);
            const systemDiv = document.createElement('div');
            const systemName = document.createElement('h3');
            const systemID = document.createElement('p');
            const systemDesc = document.createElement('p');
            const systemTags = document.createElement('p');
            systemTags.classList.add("smallerfont");
            systemName.textContent = sys.name;
            systemID.innerHTML = `<small>${sys.id}</small>`;
            systemDesc.textContent = sys.description;
            const tagArr = sys.tags.split(",").map(t => "#" + t.trim());
            systemTags.textContent = tagArr.join("; ");

            systemDiv.append(systemName, systemID, systemDesc, systemTags);
            systemDiv.className = "system-div";
            systemDivArr.push(systemDiv);
        });
        systemDivArr.forEach((div)=> {
            document.querySelector("#system-list").append(div);
        })

        document.querySelector("#system-create").addEventListener("click", () => {
            document.querySelector("#system-modal").showModal()
        });
        document.querySelector("#close-create").addEventListener("click", () => {
            document.querySelector("#system-modal").close()
        });
        document.querySelector("#create-system").addEventListener("click", async () => {
            // const newSystem = new System({name: document.querySelector("#sys-name-input").value});
            // newSystem.commit();
            await api.createSystem({
                    name: document.querySelector('#sys-name-input').value, 
                    description: document.querySelector('#sys-desc-input').value, 
                    tags: document.querySelector('#sys-tags-input').value
                });
        });
    }

    if (journalsPage) {
        await api.readJournals();
    }

    if (homePage) {
        const alters = await api.readAlts();
        const splash = document.createElement('p');
        if (alters.length < 1) {
            splash.textContent = 'No alters have been recorded yet.';
        } else {
            splash.textContent = alters;
        }
        document.querySelector('#alters-article').append(splash);
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