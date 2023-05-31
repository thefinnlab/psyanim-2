# Psyanim 2.0 - Introduction and Overview

Psyanim 2.0 is a tool for rapid design, prototyping and deployment of psychology research experiments involving 2D procedural animation.

See instructions below for building & running Psyanim 2.0.

# Getting started (for researchers designing experiments):

**1. Install Node.js with npm: `https://nodejs.org/en/download`**

**2. Install dependencies with: `npm i`**

**3. To run editor server locally: `npm run editor` and then navigate to 'localhost:3000' in your Chrome browser**

**4. To watch for code changes while dev server is running, in a separate terminal run: `npm run watch`**

**5. (Optional) Install recommended VS Code Extensions [Link](./docs/helpful_vscode_extensions.md)**

- With the recommended markdown extensions installed, you can right-click on any documentation file ending in '.md' and click 'Open Preview' to view in VS Code

**6. Check out the example scenes under './src/test/scenes/\*' and './experiments/\*'**

# Getting started (for core development):

**1. To run local dev server: `npm run deveditor` and then navigate to 'localhost:3000' in your Chrome browser**

**2. To watch for code changes while dev server is running, in a separate terminal run: `npm run devwatch`**

## Test Scene Keyboard Controls:

**Use keys 'j' and 'k' to change scenes.**

**For scenes with a player controller, use WASD for movement.**

**Some scenes have a mouse follow target, so moving mouse will affect agents.**

**Press 't' key to toggle physics time scale (can slow down / speed up simulation for debugging).**