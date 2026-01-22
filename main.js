/*
THIS IS A GENERATED DEVELOPMENT FILE
*/
'use strict';

var obsidian = require('obsidian');

const DEFAULT_SETTINGS = {
    displayMode: 'gauge-notch'
};

class TagTweaksPlugin extends obsidian.Plugin {
    async onload() {
        await this.loadSettings();
        this.addSettingTab(new TagTweaksSettingTab(this.app, this));

        this.app.workspace.onLayoutReady(() => {
            this.patchTagView();
        });

        this.registerEvent(this.app.metadataCache.on('changed', () => this.refreshAllViews()));
        this.registerEvent(this.app.vault.on('delete', () => this.refreshAllViews()));
        this.registerEvent(this.app.vault.on('rename', () => this.refreshAllViews()));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.refreshAllViews();
    }

    refreshAllViews() {
        this.app.workspace.getLeavesOfType("tag").forEach(leaf => {
            if (leaf.view && typeof leaf.view.updateTags === 'function') leaf.view.updateTags();
        });
    }

    patchTagView() {
        const tagLeaf = this.app.workspace.getLeavesOfType("tag")[0];
        if (!tagLeaf) {
            setTimeout(() => this.patchTagView(), 1000);
            return;
        }

        const TagView = tagLeaf.view.constructor;
        const self = this;

        if (TagView.prototype.updateTags && !TagView.prototype.updateTags._isUntaggedPatched) {
            TagView.prototype._untaggedOriginal = TagView.prototype.updateTags;
        }

        TagView.prototype._untaggedPlugin = this;

        if (!TagView.prototype.updateTags || !TagView.prototype.updateTags._isUntaggedPatched) {
            const original = TagView.prototype._untaggedOriginal;

            const patchedUpdateTags = function () {
                const plugin = this._untaggedPlugin;
                if (original) original.apply(this, arguments);
                if (!plugin) return;

                try {
                    const allFiles = plugin.app.vault.getMarkdownFiles();
                    let count = 0;
                    for (const file of allFiles) {
                        const cache = plugin.app.metadataCache.getFileCache(file);
                        const tags = obsidian.getAllTags(cache);
                        if (!tags || tags.length === 0) count++;
                    }

                    const mode = plugin.settings.displayMode;
                    const rootChildren = this.tree.root.vChildren.children;

                    // Comprehensive Cleanup
                    if (this._untaggedElement) { this._untaggedElement.remove(); this._untaggedElement = null; }
                    if (this._inlineStatus) { this._inlineStatus.remove(); this._inlineStatus = null; }
                    if (this._untaggedNavBtn) { this._untaggedNavBtn.remove(); this._untaggedNavBtn = null; }

                    for (let i = rootChildren.length - 1; i >= 0; i--) {
                        if (rootChildren[i].tag === "__untagged__") {
                            if (mode !== 'tree-item' || count === 0) rootChildren.splice(i, 1);
                        }
                    }

                    if (count === 0) {
                        this.tree.infinityScroll.invalidateAll();
                        return;
                    }

                    const header = this.containerEl.querySelector(".nav-header");

                    // MODE: Inline Status
                    if (mode === 'inline-status') {
                        const titleEl = header?.querySelector(".nav-header-title") || header;
                        if (titleEl) {
                            this._inlineStatus = titleEl.createSpan("untagged-inline-status");
                            this._inlineStatus.setText(`${count} UNTAGGED`);
                            this._inlineStatus.onclick = (e) => { e.stopImmediatePropagation(); plugin.openUntaggedBrowser(); };
                        }
                    }
                    // MODE: Gauge Notch (Now "Dashboard Bar" Style)
                    else if (mode === 'gauge-notch') {
                        if (header) {
                            this._untaggedElement = document.createElement("div");
                            this._untaggedElement.className = "untagged-custom-container";
                            const bar = this._untaggedElement.createDiv("untagged-gauge-notch");

                            const iconWrap = bar.createDiv("untagged-search-icon");
                            obsidian.setIcon(iconWrap, "file-question");

                            bar.createDiv({ text: "Untagged notes", cls: "untagged-search-text" });
                            bar.createDiv({ text: count.toString(), cls: "untagged-search-count" });

                            bar.onclick = () => plugin.openUntaggedBrowser();
                            header.after(this._untaggedElement);
                        }
                    }
                    // MODE: Classic Pill & Studio Token
                    else if (mode === 'header-pill' || mode === 'studio-token') {
                        if (header) {
                            this._untaggedElement = document.createElement("div");
                            this._untaggedElement.className = "untagged-custom-container";
                            const pill = this._untaggedElement.createDiv(mode === 'header-pill' ? "untagged-header-pill" : "untagged-studio-token");
                            obsidian.setIcon(pill, "tag");
                            pill.createSpan({ text: count.toString() });
                            pill.onclick = () => plugin.openUntaggedBrowser();
                            header.prepend(this._untaggedElement);
                        }
                    }
                    // MODE: Nav Button
                    else if (mode === 'nav-button') {
                        const nav = this.containerEl.querySelector(".nav-buttons-container");
                        if (nav) {
                            this._untaggedNavBtn = nav.createDiv("clickable-icon nav-action-button untagged-btn");
                            obsidian.setIcon(this._untaggedNavBtn, "tag");
                            const badge = this._untaggedNavBtn.createSpan("untagged-count-badge");
                            badge.setText(count.toString());
                            this._untaggedNavBtn.onclick = (e) => { e.preventDefault(); plugin.openUntaggedBrowser(); };
                            const sBtn = nav.querySelector(".lucide-search")?.parentElement;
                            if (sBtn) nav.insertBefore(this._untaggedNavBtn, sBtn);
                        }
                    }
                    else if (mode === 'tree-item') {
                        let item = this.tagDoms['__untagged__'];
                        if (!item) {
                            const existing = Object.values(this.tagDoms);
                            if (existing.length > 0) {
                                const TagItem = existing[0].constructor;
                                item = new TagItem(this.tree, this);
                                item.tag = "__untagged__";
                                item.el.addClass("__untagged__");
                                item.tagTextEl.empty();
                                item.tagTextEl.createSpan({ text: "Untagged Files", cls: "tree-item-inner-text" });
                                item.onSelfClick = () => plugin.openUntaggedBrowser();
                                this.tagDoms['__untagged__'] = item;
                            }
                        }
                        if (item) {
                            item.tagCountEl.setText(count.toString());
                            if (!rootChildren.includes(item)) rootChildren.unshift(item);
                        }
                    }
                } catch (err) {
                    console.error("Untagged Update Error:", err);
                }
                this.tree.infinityScroll.invalidateAll();
            };

            patchedUpdateTags._isUntaggedPatched = true;
            TagView.prototype.updateTags = patchedUpdateTags;
        }

        this.refreshAllViews();
    }

    openUntaggedBrowser() {
        new UntaggedFilesModal(this.app).open();
    }
}

class UntaggedFilesModal extends obsidian.SuggestModal {
    constructor(app) {
        super(app);
        this.setPlaceholder("Search untagged files...");
    }

    getSuggestions(query) {
        const allFiles = this.app.vault.getMarkdownFiles();
        const untagged = allFiles.filter(file => {
            const cache = this.app.metadataCache.getFileCache(file);
            const tags = obsidian.getAllTags(cache);
            return !tags || tags.length === 0;
        });

        const q = query.toLowerCase();
        return untagged.filter(file =>
            file.basename.toLowerCase().includes(q) ||
            file.path.toLowerCase().includes(q)
        );
    }

    renderSuggestion(file, el) {
        el.createEl("div", { text: file.basename, style: "font-weight: 600;" });
        el.createEl("small", { text: file.path, style: "opacity: 0.5; font-size: 0.8em;" });
    }

    onChooseSuggestion(file, evt) {
        const leaf = this.app.workspace.getLeaf(evt.ctrlKey || evt.metaKey ? 'tab' : false);
        leaf.openFile(file);
    }
}

class TagTweaksSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Untagged Browser' });

        new obsidian.Setting(containerEl)
            .setName('Design System Entry')
            .setDesc('Select the interface style that best integrates with your workflow.')
            .addDropdown(dropdown => dropdown
                .addOption('gauge-notch', 'Gauge Notch (Search Style)')
                .addOption('inline-status', 'Inline Header (Rearranged)')
                .addOption('header-pill', 'Classic Pill')
                .addOption('studio-token', 'Studio Token')
                .addOption('tree-item', 'Standard List Item')
                .addOption('nav-button', 'Nav Button Badge')
                .setValue(this.plugin.settings.displayMode)
                .onChange(async (val) => {
                    this.plugin.settings.displayMode = val;
                    await this.plugin.saveSettings();
                }));
    }
}

module.exports = TagTweaksPlugin;
