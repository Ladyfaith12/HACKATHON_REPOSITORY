Prerequistes

Before running tests, make sure you have:
node --version  # Should output v18.x.x or higher
npm --version   # Should output 9.x.x or higher
git --version   # Should output 2.x.x or higher

### GET CLICK N' HACK ARTILLERY REPO ###

Step 1: Clone the Artillery Repository

git clone https://github.com/Ladyfaith12/HACKATHON_REPOSITORY.git
cd HACKATHON_REPOSITORY

Step 2: Install and run Artillery
We already have load.yml, stress.yml, and spike.yml configured.

Run any test with:

npx artillery run load.yml -o reports/load-report.json
npx artillery report --output reports/load-report.html reports/load-report.json

Open the HTML report:

macOS: open reports/load-report.html

Linux: xdg-open reports/load-report.html

Windows (PowerShell): start reports\load-report.html


###To create your own ####

1. Create a .yml file
2. Create a base test

Add the fllowing minimal config

config:
  target: "https://httpbin.org"  # Replace with your app's URL
  phases:
    - duration: 30  # Test duration in seconds
      arrivalRate: 10  # VUs arriving per second (ramp-up for stress)
  engines:
    http:
      # Optional: Add headers or other HTTP-specific config
      headers:
        User-Agent: "Artillery Stress Test"

scenarios:
  - name: "Stress Test: GET Requests"
    flow:
      - get:
          url: "/get"  # Endpoint to stress (e.g., your API route)

3. open your terminal and run:
mkdir -p reports
npx artillery run my-test.yml -o reports/my-test.json
npx artillery report --output reports/my-test.html reports/my-test.json


## Key Terms Explained ##

Target: The URL of the app you're testing (e.g., your API or website). Replace https://httpbin.org with your app's URL.

Virtual Users (VUs): Fake users Artillery creates to send requests. Think of them as simulated website visitors.

Arrival Rate: How many VUs start each second. arrivalRate: 10 means 10 new users per second, creating a heavy load for stress testing.

Duration: How long the test runs (30 seconds here).

Scenarios: Actions VUs perform (e.g., sending a GET request to /get).

Engines: The type of test (HTTP for web requests, WebSocket for real-time apps, etc.).

## Customization Tips

Increase arrivalRate (e.g., to 20) for more stress or lower it for lighter tests.

Change duration to test longer or shorter periods.

Add more actions in flow (e.g., POST requests) for complex tests. See the examples/ folder for ideas.