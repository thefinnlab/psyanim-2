# Psyanim 2.0 - Introduction and Overview

Psyanim 2.0 is a tool for rapid design, prototyping and deployment of psychology research experiments involving 2D procedural animation.

For a quick intro to Psyanim 2.0, check out our [docs](https://thefinnlab.github.io/psyanim-docs)!

Psyanim 2.0 depends on [`psyanim-utils`](https://github.com/thefinnlab/psyanim-utils), which is a small collection of javascript APIs that can be used in *both* browsers and nodejs apps.

---

System and Software Requirements for <b>*deployment*</b>:

- Supported Platforms: Modern Windows PC, Mac or Android Device (built within last 4 years)

- Lastest version of Chrome Web Browser (https://www.google.com/chrome/)

---

System and Software requirements for <b>*development*</b>:

- Supported Platforms: Modern Windows PC or Mac (built within last 4 years)

- Visual Studio Code (https://code.visualstudio.com/)
- Lastest version of Chrome Web Browser (https://www.google.com/chrome/)
- NodeJS v18.20.5 or higher (https://nodejs.org/en/download/current)

---

To run the test suite:

- Run `npm i` from project root to install dependencies locally
- Start a watch service in a separate terminal with `npm run dev-watch`
- Start a local server to host the test suite with `npm run dev-serve`
- Navigate to `localhost:3000` in your web browser. Controls are at bottom of page.

Installing external software dependencies might take 5-15 minutes depending on user's level of comfort with software development.

Installation project dependencies (via `npm i`) should take less than a minute, on a modern desktop computer.

Running and observing each test should only take a few seconds to less than 1 minute.

---

To view the API docs from this repo:

- First build the docs with: `npm run docs-build`
- Then start a server to host the docs locally on port `5000` with: `npm run docs-serve`
- Then navigate to `localhost:5000` in your web browser

*NOTE: if you don't want to package source code with docs, simply delete the './file/' directory in the 'docs/' dir before deploying. Docs will work, but source links will simply give 404 error.*

---

License: MIT License

See LICENSE.txt for more info.