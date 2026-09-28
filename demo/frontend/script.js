const API = "http://localhost:8080/api";

/* =========================================================
   COMMON HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);


async function request(url, options = {}) {

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    const contentType =
        response.headers.get("content-type") || "";

    const data =
        contentType.includes("application/json")
            ? await response.json()
            : await response.text();

    if (!response.ok) {

        throw new Error(
            typeof data === "object"
                ? data.message || "Request failed"
                : data || "Request failed"
        );
    }

    return data;
}


function updateElement(id, value) {

    const element = $(id);

    if (element) {
        element.textContent = value;
    }
}


/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(message, type = "success") {

    let notification = $("notification");

    if (!notification) {

        notification = document.createElement("div");

        notification.id = "notification";

        document.body.appendChild(notification);
    }

    notification.className =
        `notification ${type}`;

    notification.textContent = message;

    requestAnimationFrame(() => {
        notification.classList.add("show");
    });

    setTimeout(() => {
        notification.classList.remove("show");
    }, 3500);
}


/* =========================================================
   CAMPS
========================================================= */

async function loadCamps() {

    try {

        const camps =
            await request(`${API}/camps`);

        displayCamps(camps);

        populateCampSelects(camps);

        return camps;

    } catch (error) {

        console.error(error);

        showNotification(
            "Unable to load relief camps.",
            "error"
        );

        return [];
    }
}


function displayCamps(camps) {

    const table = $("campTable");

    if (!table) return;


    if (!camps.length) {

        table.innerHTML = `
            <tr>
                <td colspan="5">

                    <div class="empty-state">

                        <span>▣</span>

                        <p>
                            No relief camps registered yet.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML = camps.map(camp => `

        <tr>

            <td>
                <strong>
                    ${camp.name}
                </strong>
            </td>

            <td>
                ${camp.location}
            </td>

            <td>
                ${camp.capacity} people
            </td>

            <td>

                <span class="badge badge-success">
                    Operational
                </span>

            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteCamp(${camp.id})"
                    type="button">
                    🗑 Delete
                </button>

            </td>

        </tr>

    `).join("");
}


/* =========================================================
   DELETE CAMP
========================================================= */

async function deleteCamp(campId) {

    if (!confirm("Are you sure you want to delete this camp?")) {
        return;
    }

    try {

        await request(`${API}/camps/${campId}`, {
            method: "DELETE"
        });

        showNotification(
            "Camp deleted successfully.",
            "success"
        );

        await loadCamps();

        await loadDashboard();

        await loadReports();

    } catch (error) {

        console.error(error);

        showNotification(
            error.message,
            "error"
        );
    }
}


/* =========================================================
   CAMP SELECT DROPDOWNS
========================================================= */

function populateCampSelects(camps) {

    const selectIds = [
        "supplyCamp",
        "familyCamp",
        "distributionCamp",
        "inventoryCamp",
        "familyViewCamp"
    ];


    selectIds.forEach(id => {

        const select = $(id);

        if (!select) return;


        select.innerHTML = `
            <option value="">
                Select relief camp
            </option>
        `;


        camps.forEach(camp => {

            const option =
                document.createElement("option");

            option.value = camp.id;

            option.textContent =
                `${camp.name} — ${camp.location}`;

            select.appendChild(option);

        });

    });
}


/* =========================================================
   REGISTER CAMP
========================================================= */

async function registerCamp(event) {

    event.preventDefault();


    const name =
        $("campName")?.value.trim();

    const location =
        $("campLocation")?.value.trim();

    const capacity =
        Number($("campCapacity")?.value);


    if (!name || !location || capacity <= 0) {

        showNotification(
            "Please enter valid camp details.",
            "error"
        );

        return;
    }


    try {

        await request(`${API}/camps`, {

            method: "POST",

            body: JSON.stringify({

                name,
                location,
                capacity

            })

        });


        event.target.reset();


        showNotification(
            "Relief camp registered successfully."
        );


        await loadCamps();

        await loadDashboard();


    } catch (error) {

        console.error(error);

        showNotification(
            error.message,
            "error"
        );
    }
}


/* =========================================================
   SUPPLIES
========================================================= */

async function addSupply(event) {

    event.preventDefault();


    const campId =
        $("supplyCamp")?.value;

    const type =
        $("supplyType")?.value;

    const quantity =
        Number($("supplyQuantity")?.value);


    if (!campId || !type || quantity <= 0) {

        showNotification(
            "Please enter valid supply details.",
            "error"
        );

        return;
    }


    try {

        await request(
            `${API}/camps/${campId}/supplies`,
            {

                method: "POST",

                body: JSON.stringify({

                    type,
                    quantity

                })

            }
        );


        event.target.reset();


        showNotification(
            "Incoming supply added successfully."
        );


        await loadInventoryPage(campId);

        await loadDashboard();


    } catch (error) {

        console.error(error);

        showNotification(
            error.message,
            "error"
        );
    }
}


/* =========================================================
   INVENTORY
========================================================= */

async function loadInventoryPage(campId) {

    if (!campId) return;


    const container = $("inventory");

    if (!container) return;


    try {

        const inventory =
            await request(
                `${API}/camps/${campId}/inventory`
            );


        if (!inventory.length) {

            container.innerHTML = `

                <div class="empty-state">

                    <span>◌</span>

                    <p>
                        No inventory has been recorded yet.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML =
            inventory.map(item => `

                <div class="inventory-item">

                    <div class="inventory-item-icon">
                        ${getSupplyIcon(item.type)}
                    </div>

                    <div class="inventory-item-info">

                        <strong>
                            ${formatSupplyType(item.type)}
                        </strong>

                        <span>
                            Current stock
                        </span>

                    </div>

                    <div class="inventory-quantity">

                        <strong>
                            ${item.quantity}
                        </strong>

                        <span>
                            units
                        </span>

                    </div>

                </div>

            `).join("");


    } catch (error) {

        console.error(error);

        container.innerHTML = `

            <div class="empty-state">

                <p>
                    Unable to load inventory.
                </p>

            </div>

        `;
    }
}


/* =========================================================
   FAMILY REGISTRATION
========================================================= */

async function registerFamily(event) {

    event.preventDefault();


    const campId =
        $("familyCamp")?.value;

    const familyName =
        $("familyName")?.value.trim();

    const headCount =
        Number($("headCount")?.value);


    if (
        !campId ||
        !familyName ||
        headCount <= 0
    ) {

        showNotification(
            "Please enter valid family details.",
            "error"
        );

        return;
    }


    try {

        await request(
            `${API}/camps/${campId}/families`,
            {

                method: "POST",

                body: JSON.stringify({

                    familyName,
                    headCount

                })

            }
        );


        event.target.reset();


        showNotification(
            "Family checked into the relief camp."
        );


        await loadFamiliesPage(campId);

        await loadDashboard();


    } catch (error) {

        console.error(error);

        showNotification(
            error.message,
            "error"
        );
    }
}


/* =========================================================
   LOAD FAMILIES
========================================================= */

async function loadFamiliesPage(campId) {

    if (!campId) return;


    try {

        const families =
            await request(
                `${API}/camps/${campId}/families`
            );


        const table =
            $("familyTable");


        if (table) {

            if (!families.length) {

                table.innerHTML = `

                    <tr>

                        <td colspan="3">

                            <div class="empty-state">

                                <span>♙</span>

                                <p>
                                    No families currently housed.
                                </p>

                            </div>

                        </td>

                    </tr>

                `;

            } else {

                table.innerHTML =
                    families.map(family => `

                        <tr>

                            <td>

                                <strong>
                                    ${family.familyName}
                                </strong>

                            </td>

                            <td>
                                ${family.headCount}
                            </td>

                            <td>
                                ${family.camp?.name || "—"}
                            </td>

                        </tr>

                    `).join("");

            }

        }


        populateFamilySelect(families);


    } catch (error) {

        console.error(error);

        showNotification(
            "Unable to load families.",
            "error"
        );
    }
}


function populateFamilySelect(families) {

    const select =
        $("distributionFamily");

    if (!select) return;


    select.innerHTML = `
        <option value="">
            Select family
        </option>
    `;


    families.forEach(family => {

        const option =
            document.createElement("option");

        option.value =
            family.id;

        option.textContent =
            `${family.familyName} (${family.headCount} people)`;

        select.appendChild(option);

    });
}


/* =========================================================
   DISTRIBUTION
========================================================= */

async function distributeSupply(event) {

    event.preventDefault();


    const campId =
        $("distributionCamp")?.value;

    const familyId =
        $("distributionFamily")?.value;

    const supplyType =
        $("distributionType")?.value;

    const quantity =
        Number($("distributionQuantity")?.value);


    if (
        !campId ||
        !familyId ||
        !supplyType ||
        quantity <= 0
    ) {

        showNotification(
            "Please complete all distribution details.",
            "error"
        );

        return;
    }


    try {

        const params =
            new URLSearchParams({

                campId,
                familyId,
                supplyType,
                quantity

            });


        await request(
            `${API}/distributions?${params}`,
            {
                method: "POST"
            }
        );


        event.target.reset();


        showNotification(
            "Supply distributed successfully."
        );


        await loadInventoryPage(campId);

        await loadDashboard();


    } catch (error) {

        console.error(error);

        showNotification(
            error.message,
            "error"
        );
    }
}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard() {

    const dashboard =
        $("campCount");

    if (!dashboard) return;


    try {

        const camps =
            await request(`${API}/camps`);


        updateElement(
            "campCount",
            camps.length
        );


        if (!camps.length) {

            updateElement(
                "familyCount",
                "0"
            );

            updateElement(
                "foodCount",
                "0"
            );

            updateElement(
                "waterCount",
                "0"
            );

            return;
        }


        let totalPeople = 0;
        let totalFood = 0;
        let totalWater = 0;


        for (const camp of camps) {

            try {

                const families =
                    await request(
                        `${API}/camps/${camp.id}/families`
                    );


                totalPeople +=
                    families.reduce(
                        (sum, family) =>
                            sum +
                            Number(
                                family.headCount || 0
                            ),
                        0
                    );

            } catch (error) {

                console.warn(
                    "Could not load families",
                    error
                );
            }


            try {

                const inventory =
                    await request(
                        `${API}/camps/${camp.id}/inventory`
                    );


                inventory.forEach(item => {

                    if (item.type === "FOOD") {

                        totalFood +=
                            Number(
                                item.quantity || 0
                            );
                    }


                    if (item.type === "WATER") {

                        totalWater +=
                            Number(
                                item.quantity || 0
                            );
                    }

                });

            } catch (error) {

                console.warn(
                    "Could not load inventory",
                    error
                );
            }

        }


        updateElement(
            "familyCount",
            totalPeople
        );

        updateElement(
            "foodCount",
            totalFood
        );

        updateElement(
            "waterCount",
            totalWater
        );


        const inventoryCamp =
            $("inventoryCamp");


        if (
            inventoryCamp &&
            !inventoryCamp.value &&
            camps.length
        ) {

            inventoryCamp.value =
                camps[0].id;

            await loadInventoryPage(
                camps[0].id
            );
        }


    } catch (error) {

        console.error(error);

        showNotification(
            "Unable to connect to the Relief Camp server.",
            "error"
        );
    }
}


/* =========================================================
   REPORTS
========================================================= */

async function loadReports() {

    if (!$("reportCampCount")) return;


    try {

        const camps =
            await request(`${API}/camps`);


        updateElement(
            "reportCampCount",
            camps.length
        );


        let totalFamilies = 0;
        let totalPeople = 0;
        let totalFood = 0;
        let totalWater = 0;
        let totalBlankets = 0;


        for (const camp of camps) {

            try {

                const families =
                    await request(
                        `${API}/camps/${camp.id}/families`
                    );


                totalFamilies +=
                    families.length;


                totalPeople +=
                    families.reduce(
                        (sum, family) =>
                            sum +
                            Number(
                                family.headCount || 0
                            ),
                        0
                    );

            } catch (error) {

                console.warn(
                    "Could not load report families",
                    error
                );
            }


            try {

                const inventory =
                    await request(
                        `${API}/camps/${camp.id}/inventory`
                    );


                inventory.forEach(item => {

                    const quantity =
                        Number(
                            item.quantity || 0
                        );


                    if (item.type === "FOOD") {
                        totalFood += quantity;
                    }

                    if (item.type === "WATER") {
                        totalWater += quantity;
                    }

                    if (item.type === "BLANKETS") {
                        totalBlankets += quantity;
                    }

                });

            } catch (error) {

                console.warn(
                    "Could not load report inventory",
                    error
                );
            }

        }


        updateElement(
            "reportFamilyCount",
            totalFamilies
        );

        updateElement(
            "reportPeopleCount",
            totalPeople
        );

        updateElement(
            "reportFood",
            `${totalFood} units`
        );

        updateElement(
            "reportWater",
            `${totalWater} units`
        );

        updateElement(
            "reportBlankets",
            `${totalBlankets} units`
        );


        const max =
            Math.max(
                totalFood,
                totalWater,
                totalBlankets,
                1
            );


        const foodProgress =
            $("foodProgress");

        const waterProgress =
            $("waterProgress");

        const blanketProgress =
            $("blanketProgress");


        if (foodProgress) {

            foodProgress.style.width =
                `${(totalFood / max) * 100}%`;
        }


        if (waterProgress) {

            waterProgress.style.width =
                `${(totalWater / max) * 100}%`;
        }


        if (blanketProgress) {

            blanketProgress.style.width =
                `${(totalBlankets / max) * 100}%`;
        }


    } catch (error) {

        console.error(error);

        showNotification(
            "Unable to load reports.",
            "error"
        );
    }
}


/* =========================================================
   FORMATTERS
========================================================= */

function formatSupplyType(type) {

    const names = {

        FOOD: "Food",

        WATER: "Water",

        BLANKETS: "Blankets"

    };

    return names[type] || type;
}


function getSupplyIcon(type) {

    const icons = {

        FOOD: "◈",

        WATER: "◉",

        BLANKETS: "▦"

    };

    return icons[type] || "•";
}


/* =========================================================
   FORM EVENTS
========================================================= */

function initializeForms() {

    const campForm =
        $("campForm");

    if (campForm) {

        campForm.addEventListener(
            "submit",
            registerCamp
        );
    }


    const supplyForm =
        $("supplyForm");

    if (supplyForm) {

        supplyForm.addEventListener(
            "submit",
            addSupply
        );
    }


    const familyForm =
        $("familyForm");

    if (familyForm) {

        familyForm.addEventListener(
            "submit",
            registerFamily
        );
    }


    const distributionForm =
        $("distributionForm");

    if (distributionForm) {

        distributionForm.addEventListener(
            "submit",
            distributeSupply
        );
    }
}


/* =========================================================
   SELECT EVENTS
========================================================= */

function initializeSelectors() {

    const inventoryCamp =
        $("inventoryCamp");


    if (inventoryCamp) {

        inventoryCamp.addEventListener(
            "change",
            event => {

                loadInventoryPage(
                    event.target.value
                );

            }
        );
    }


    const familyViewCamp =
        $("familyViewCamp");


    if (familyViewCamp) {

        familyViewCamp.addEventListener(
            "change",
            event => {

                loadFamiliesPage(
                    event.target.value
                );

            }
        );
    }


    const distributionCamp =
        $("distributionCamp");


    if (distributionCamp) {

        distributionCamp.addEventListener(
            "change",
            async event => {

                const campId =
                    event.target.value;

                const familySelect =
                    $("distributionFamily");


                if (familySelect) {

                    familySelect.innerHTML = `
                        <option value="">
                            Loading families...
                        </option>
                    `;
                }


                if (campId) {

                    await loadFamiliesPage(
                        campId
                    );

                } else if (familySelect) {

                    familySelect.innerHTML = `
                        <option value="">
                            Select family
                        </option>
                    `;
                }

            }
        );
    }
}


/* =========================================================
   APPLICATION START
========================================================= */

async function initializeApplication() {

    initializeForms();

    initializeSelectors();


    const camps =
        await loadCamps();


    if (camps.length) {

        const firstCamp =
            camps[0].id;


        const inventoryCamp =
            $("inventoryCamp");


        if (
            inventoryCamp &&
            !inventoryCamp.value
        ) {

            inventoryCamp.value =
                firstCamp;
        }


        const familyViewCamp =
            $("familyViewCamp");


        if (
            familyViewCamp &&
            !familyViewCamp.value
        ) {

            familyViewCamp.value =
                firstCamp;
        }


        if ($("inventory")) {

            await loadInventoryPage(
                firstCamp
            );
        }


        if ($("familyTable")) {

            await loadFamiliesPage(
                firstCamp
            );
        }

    }


    await loadDashboard();

    await loadReports();
}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
);