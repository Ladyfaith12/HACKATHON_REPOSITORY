# Performance Testing Framework with AI Analysis

This repository contains a performance testing framework that combines Artillery for load testing with AI-powered analysis to provide intelligent insights about your application's performance.

## Prerequisites

Before running tests, make sure you have:
- Node.js v18.x.x or higher (`node --version`)
- npm 9.x.x or higher (`npm --version`)
- Git 2.x.x or higher (`git --version`)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Ladyfaith12/HACKATHON_REPOSITORY.git
cd HACKATHON_REPOSITORY
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Claude AI API key
```

4. Run a test with AI analysis:
```bash
node app.js load  # For load testing
node app.js stress  # For stress testing
node app.js spike  # For spike testing
```

## Features

- **Automated Performance Testing**: Three pre-configured test scenarios:
  - `load.yml`: Standard load testing
  - `stress.yml`: Stress testing for system limits
  - `spike.yml`: Spike testing for sudden traffic increases

- **AI-Powered Analysis**: Automatic analysis of test results using Claude AI to provide:
  - Performance bottleneck identification
  - Optimization recommendations
  - System behavior insights
  - Capacity planning suggestions

- **Comprehensive Reporting**:
  - JSON reports in `reports/` directory
  - HTML visualization of test results
  - AI analysis in markdown format

## Test Configurations

### Load Testing (load.yml)
Standard load test to measure system performance under expected conditions.

### Stress Testing (stress.yml)
Gradually increasing load to find system breaking points.

### Spike Testing (spike.yml)
Sudden traffic spikes to test system recovery.

## Creating Custom Tests

1. Create a new .yml file with your test configuration:

```yaml
config:
  target: "https://your-api.com"
  phases:
    - duration: 30
      arrivalRate: 10
  engines:
    http:
      headers:
        User-Agent: "Artillery Test"

scenarios:
  - name: "Custom Test"
    flow:
      - get:
          url: "/your-endpoint"
```

2. Run your custom test:
```bash
node app.js your-test-file
```

## Key Concepts

- **Target**: Your application's URL
- **Virtual Users (VUs)**: Simulated users making requests
- **Arrival Rate**: New VUs per second
- **Duration**: Test length in seconds
- **Scenarios**: User behavior patterns
- **Phases**: Different load patterns during the test

## Customization Tips

- Adjust `arrivalRate` to change load intensity
- Modify `duration` for different test lengths
- Add complex scenarios with multiple requests
- Customize headers and request parameters

## Report Analysis

Test reports are generated in three formats:
1. JSON (`reports/test-report.json`)
2. HTML (`reports/test-report.html`)
3. AI Analysis (`reports/analysis.md`)

View HTML reports using:
- macOS: `open reports/test-report.html`
- Linux: `xdg-open reports/test-report.html`
- Windows: `start reports\test-report.html`

## Contributing

Feel free to submit issues and enhancement requests!