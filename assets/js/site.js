(() => {
    const slugify = (text) => text
        .toLocaleLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const publicationThemes = new Map();
    document.querySelectorAll('#publications [aria-labelledby="publications-by-theme"] dl h3').forEach((heading) => {
        heading.id = `publication-theme-${slugify(heading.textContent)}`;
        publicationThemes.set(heading.textContent.trim(), heading);
    });

    const replaceElement = (element, tagName) => {
        const replacement = document.createElement(tagName);
        replacement.className = element.className;
        while (element.firstChild) {
            replacement.appendChild(element.firstChild);
        }
        element.replaceWith(replacement);
        return replacement;
    };

    document.querySelectorAll("#applications span.card, #foundations span.card").forEach((card, index) => {
        const article = replaceElement(card, "article");
        const cardBody = article.querySelector(".card-body");
        const heading = cardBody && cardBody.querySelector("h3");
        const details = article.querySelector(".card-content");

        if (!cardBody || !heading || !details) {
            return;
        }

        const body = replaceElement(cardBody, "div");
        details.id = `topic-details-${index + 1}`;
        const panels = Array.from(details.querySelectorAll(".tab-content"));
        panels.forEach((panel, panelIndex) => {
            panel.id = `${details.id}-panel-${panelIndex + 1}`;
        });

        if (article.closest("#foundations")) {
            const tabs = Array.from(details.querySelectorAll(".tab-link"));
            const papersIndex = tabs.findIndex((tab) => tab.textContent.trim() === "Papers");
            const overviewPanel = panels[0];
            if (papersIndex >= 0 && panels[papersIndex]) {
                panels[papersIndex].remove();
            }
            details.querySelector(".tabs")?.remove();

            if (overviewPanel) {
                overviewPanel.removeAttribute("role");
                overviewPanel.removeAttribute("aria-labelledby");
            }

            const themeHeading = publicationThemes.get(heading.textContent.trim());
            if (!themeHeading) {
                console.error(`No publication theme found for Foundations topic: ${heading.textContent.trim()}`);
            } else if (overviewPanel) {
                const publicationsLink = document.createElement("a");
                publicationsLink.className = "topic-publications-link";
                publicationsLink.href = `#${themeHeading.id}`;
                publicationsLink.textContent = "View related publications";
                publicationsLink.addEventListener("click", () => {
                    document.querySelector("#publications-by-theme").click();
                });
                overviewPanel.append(document.createElement("br"), publicationsLink);
            }
        }

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "topic-toggle";
        toggle.textContent = "Explore topic";
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-controls", details.id);
        heading.insertAdjacentElement("afterend", toggle);

        toggle.addEventListener("click", () => {
            const expanded = article.classList.toggle("expanded");
            toggle.setAttribute("aria-expanded", String(expanded));
            toggle.textContent = expanded ? "Hide details" : "Explore topic";
        });

        const tabs = body.querySelector(".tabs");
        if (!tabs) {
            return;
        }

        tabs.setAttribute("role", "tablist");
        tabs.querySelectorAll(".tab-link").forEach((tab, tabIndex) => {
            const panel = details.querySelectorAll(".tab-content")[tabIndex];
            if (!panel) {
                return;
            }

            const tabId = `${details.id}-tab-${tabIndex + 1}`;
            const panelId = panel.id;
            tab.id = tabId;
            tab.setAttribute("role", "tab");
            tab.setAttribute("aria-controls", panelId);
            tab.setAttribute("aria-selected", String(tab.classList.contains("active")));
            tab.tabIndex = tab.classList.contains("active") ? 0 : -1;
            panel.id = panelId;
            panel.setAttribute("role", "tabpanel");
            panel.setAttribute("aria-labelledby", tabId);
            tab.setAttribute("onclick", `showTab(event, this, '${panelId}')`);
        });
    });

    const publications = document.querySelector("#publications");
    const searchInput = document.querySelector("#publication-search-input");
    const searchStatus = document.querySelector("#publication-search-status");

    if (publications && searchInput && searchStatus) {
        const publicationLists = publications.querySelectorAll(".tab-content ol");
        const allItems = Array.from(publicationLists).flatMap((list) => Array.from(list.querySelectorAll("li")));
        const uniqueYearItems = publications.querySelectorAll("#tab1 ol li").length;
        searchStatus.textContent = `Showing all ${uniqueYearItems} publications. Search titles, authors, or venues.`;

        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLocaleLowerCase();
            let visibleYearItems = 0;

            allItems.forEach((item) => {
                const matches = !query || item.textContent.toLocaleLowerCase().includes(query);
                item.hidden = !matches;
                if (matches && item.closest("#tab1")) {
                    visibleYearItems += 1;
                }
            });

            publications.querySelectorAll(".tab-content dl > dd").forEach((group) => {
                const visible = Array.from(group.querySelectorAll("ol li")).some((item) => !item.hidden);
                group.hidden = !visible;
                if (group.previousElementSibling && group.previousElementSibling.tagName === "DT") {
                    group.previousElementSibling.hidden = !visible;
                }
            });

            if (!query) {
                searchStatus.textContent = `Showing all ${uniqueYearItems} publications. Search titles, authors, or venues.`;
            } else if (visibleYearItems === 0) {
                searchStatus.textContent = "No publications found. Try another title, author, or venue.";
            } else {
                searchStatus.textContent = `${visibleYearItems} publication${visibleYearItems === 1 ? "" : "s"} match your search.`;
            }
        });
    }

    const newsList = document.querySelector("#news ul");
    if (newsList && newsList.children.length > 3) {
        const archive = document.createElement("details");
        archive.className = "news-archive";
        const summary = document.createElement("summary");
        summary.textContent = "Browse earlier news";
        const archivedItems = document.createElement("ul");
        const items = Array.from(newsList.children).slice(3);

        items.forEach((item) => archivedItems.appendChild(item));
        archive.append(summary, archivedItems);
        newsList.insertAdjacentElement("afterend", archive);
    }

    document.querySelectorAll("#navbarSupportedContent a[href^='#']").forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = document.getElementById(link.hash.slice(1));
            if (!target) {
                return;
            }

            event.preventDefault();
            if (window.innerWidth < 992 && window.jQuery) {
                window.jQuery("#navbarSupportedContent").collapse("hide");
            }

            window.history.pushState(null, "", link.hash);
            const navbarHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scail-navbar-height"));
            const scrollTop = Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - navbarHeight);
            window.jQuery("html, body").stop(true).animate({ scrollTop }, 500);
        });
    });
})();
