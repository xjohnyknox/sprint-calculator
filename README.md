# Sprint Planning Calculator

A tool to calculate target points for agile sprints based on team composition, holidays, and PTO days.


## Features

- Calculate developer days by country (Colombia, Canada, US)
- Account for holidays and PTO days
- Calculate team capacity and target points for sprints
- Real-time calculations as values change
- Reset functionality to clear all fields

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/sprint-calculator.git
cd sprint-calculator
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm start
# or
yarn start
```

### Docker
To build and run the Docker image, follow these steps:

#### Build the Docker image

```bash
docker build -t sprint-calculator .
```

Run the Docker container

```bash
docker run -p 3000:3000 sprint-calculator
```
#### Using the docker image from dockerhub

```bash
docker pull xjohnyx/sprint-calculator:latest
docker run -p 3000:3000 xjohnyx/sprint-calculator:latest

```

### Usage

Open your browser and navigate to `http://localhost:3000`.

Enter the team composition, holidays, and PTO days.

View the calculated target points for the sprint.

### Contributing
Welcome contributions!

### Contact
For any questions or feedback, please reach out at [xjohnyx@icloud.com].
