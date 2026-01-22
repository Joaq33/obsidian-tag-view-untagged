# Tag View Tweaks

A powerful Obsidian plugin that enhances the Tags sidebar with an **Untagged Files** indicator and improved navigation features.

## Features

### 1. Untagged Files Indicator
Never lose track of your notes. This plugin adds a dedicated entry in the Tags pane for your untagged files. It supports multiple high-end display modes to suit your theme:

- **Gauge Notch (Search Style)**: A professional, native-looking status bar that blends perfectly with Obsidian's search input style. Perfect for minimalist and production-heavy workflows.
- **Inline Header**: Rearranges the Tag View header to include the untagged count as a subtle, integrated status badge.
- **Classic Pill**: A vibrant, rounded pill inspired by modern design systems.
- **Studio Token**: A sharp, technical badge style for high-density information.
- **Nav Button Badge**: Adds a notification-style badge directly to the tag view navigation buttons.
- **Standard List Item**: Integrates as a top-level item in the tag tree for a completely native feel. (Not fully working yet, it resets when some options are selected)

### 2. Custom Untagged Browser
Clicking any of the indicators opens a high-performance **Suggest Modal** that allows you to:
- Instantly view all notes without tags.
- Search through your untagged files.
- Open them with a single click.

### 3. Live Synchronization
The untagged count updates in real-time as you:
- Create or delete files.
- Add or remove tags from notes.
- Rename files.

## How to Install

### From Community Plugins (Coming Soon)
1. Open **Settings** -> **Community Plugins**.
2. Click **Browse** and search for "Tag View Tweaks".
3. Click **Install**, then **Enable**.

### Manual Installation
1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release.
2. Create a folder named `obsidian-tagview-untagged` in your vault's `.obsidian/plugins/` directory.
3. Move the downloaded files into that folder.
4. Reload Obsidian and enable the plugin.

## Settings
Go to the **Tag View Tweaks** settings tab to:
- Select your preferred **Design System Entry** (Display Mode).
- Customize the vertical rhythm and alignment of the indicator.

## License
MIT
