# Metaphysical Studio (COMP-2003 Project, Group 1)

## Description
This project involves the design & development of a platform allowing users to interact with interesting characters, rendered as 3D avatars and powered via a context-aware LLM engine. This repository covers only the frontend of the system, not the development of the LLM engine itself.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [Tests](#tests)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Prerequisites
- Node.js (which includes npm): https://nodejs.org/en - please ensure you are on or above node version 18, required packages may not be stable on lower versions. 

## Installation
Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/lorcy-p/2003-project.git
cd 2003-project
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

## Usage
After starting the development server with `npm run dev`, you can access the application in your browser at the URL shown in your terminal (typically http://localhost:5173, given the use of Vite).

The application provides an interactive 3D environment where you can:
1. Select different character avatars to interact with
2. Engage in conversations with the AI-powered characters
3. Experience context-aware responses based on your interactions

## Features
- **3D Avatar Rendering**: Lifelike character models with responsive animations
- **LLM Integration**: Connection to advanced language models for natural conversations
- **Contextual Awareness**: Characters remember and reference previous interactions
- **Responsive Design**: Works across desktop and mobile devices

## API Reference
The frontend communicates with the LLM backend through a RESTful API. Key endpoints include:


## Contributing
Guidelines for contributing to your project.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Tests
Instructions on how to run tests.

```bash
npm test  # We have yet to implement a unit test script, npm test will not yet work 
```

## License
This project is licensed under the [LICENSE NAME] - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements
- MUI (Material UI) Component Library has been used extensivly throughout
- ThreeJS used for rendering
- GSAP used for seamless animations on homepages & menus

---

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
[![Build Status](https://travis-ci.org/username/project.svg?branch=master)](https://travis-ci.org/username/project)
[![Coverage Status](https://coveralls.io/repos/github/username/project/badge.svg?branch=master)](https://coveralls.io/github/username/project?branch=master)

## Project Status
The project is currently in **active development**
