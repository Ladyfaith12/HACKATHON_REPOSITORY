require('dotenv').config();
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const execPromise = util.promisify(exec);

const ANTHROPIC_API_URL = process.env.ANTHROPIC_API_URL;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

/**
 * Analyzes performance test results using Claude AI and generates recommendations
 * @param {Object} testResults - The parsed JSON test results from Artillery
 * @returns {Promise<string>} - AI-generated analysis and recommendations
 */


async function analyzeTestResults(testResults) {
    try {
        // Prepare the prompt for Claude with complete test results
        const prompt = {
            messages: [{
                role: "user",
                content: `You are a performance testing expert. Analyze this Artillery.io performance test result and provide detailed recommendations for improvement using a clear, structured Markdown format.
                Focus on identifying performance bottlenecks, scalability issues, and potential optimizations.

                Here is the complete test result data:
                ${JSON.stringify(testResults, null, 2)}

                Please provide your analysis in the following Markdown format:

                # 📊 Performance Test Analysis Summary

                ## 🎯 Quick Overview
                - **Test Status**: [SUCCESS/PARTIAL SUCCESS/FAILED]
                - **Critical Issues**: [YES/NO] (If yes, list top 3)
                - **Overall Performance**: [GOOD/NEEDS IMPROVEMENT/POOR]

                ## 📈 Test Configuration Analysis
                ### Load Parameters
                - Test Duration: [duration]
                - Virtual Users: [number]
                - Scenarios: [list]

                ### Response Time Metrics
                | Metric | Value | Status |
                |--------|--------|--------|
                | Min Response Time | [value] ms | 🟢/🟡/🔴 |
                | Max Response Time | [value] ms | 🟢/🟡/🔴 |
                | Median Response Time | [value] ms | 🟢/🟡/🔴 |
                | 95th Percentile | [value] ms | 🟢/🟡/🔴 |

                ### Request Statistics
                - Total Requests: [number]
                - Success Rate: [percentage]%
                - Error Rate: [percentage]%
                - Throughput: [requests/second]

                ## 🚨 Performance Bottlenecks
                ### Critical Issues
                1. [Issue 1]
                   - Impact: [HIGH/MEDIUM/LOW]
                   - Description: [details]
                2. [Issue 2]
                   - Impact: [HIGH/MEDIUM/LOW]
                   - Description: [details]

                ### Error Analysis
                - [Error Type 1]: [count] occurrences
                  - Cause: [explanation]
                  - Solution: [recommendation]

                ## 💡 Recommendations
                ### Immediate Actions
                1. ⚡ [High Priority Action]
                   - Expected Impact: [description]
                   - Implementation: [steps]

                ### Long-term Improvements
                1. 📈 [Improvement 1]
                   - Benefits: [description]
                   - Implementation: [steps]

                ## 🔄 Next Steps
                1. [Next Step 1]
                   - Priority: [HIGH/MEDIUM/LOW]
                   - Timeline: [Immediate/This Week/This Month]
                2. [Next Step 2]
                   - Priority: [HIGH/MEDIUM/LOW]
                   - Timeline: [Immediate/This Week/This Month]

                ## 📝 Additional Notes
                - [Any other relevant observations]
                - [Potential risks or concerns]

                Please ensure all recommendations are specific, actionable, and prioritized based on their potential impact.`
            }],
            model: "claude-3-opus-20240229",
            max_tokens: 2000
        };

        // Call Claude AI API
        const response = await axios.post(ANTHROPIC_API_URL, prompt, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            }
        });

        return response.data.content[0].text;
    } catch (error) {
        console.error('Error analyzing test results:', error.message);
        throw error;
    }
}

/**
 * Runs an Artillery test using the specified YAML file and saves the output to a report.json file
 * @param {string} testFile - The name of the Artillery YAML test file
 * @returns {Promise<string>} - Path to the generated report file
 */
async function runArtilleryTest(testFile) {
    try {
        // Ensure the test file exists
        if (!fs.existsSync(testFile)) {
            throw new Error(`Test file ${testFile} not found`);
        }

        // Create reports directory if it doesn't exist
        const reportsDir = path.join(__dirname, 'reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir);
        }

        // Generate report file path
        const reportFile = path.join(reportsDir, 'report.json');
        
        // Run artillery test with JSON output
        const command = `artillery run --output ${reportFile} ${testFile}`;
        console.log(`Running artillery test: ${command}`);
        
        const { stdout, stderr } = await execPromise(command);
        
        if (stderr) {
            console.error('Artillery test stderr:', stderr);
        }
        
        console.log('Artillery test stdout:', stdout);
        console.log(`Test results saved to: ${reportFile}`);
        
        return reportFile;
    } catch (error) {
        console.error('Error running artillery test:', error.message);
        throw error;
    }
}

// Example usage
async function main() {
    try {
        // Get the test file from command line arguments
        const testFile = process.argv[2];
        
        if (!testFile) {
            console.error('Please provide a test file name.');
            console.log('Usage: node app.js <test-file>');
            console.log('Example: node app.js load.yml');
            process.exit(1);
        }

        const reportPath = await runArtilleryTest(testFile);
        console.log(`Test completed successfully! Report saved at: ${reportPath}`);
        
        // Read and parse the test results
        const reportContent = fs.readFileSync(reportPath, 'utf-8');
        const testResults = JSON.parse(reportContent);

        // Get AI analysis and recommendations
        console.log('\nGenerating AI analysis and recommendations...');
        const analysis = await analyzeTestResults(testResults);
        
        // Save the analysis to a file
        const analysisPath = path.join(__dirname, 'reports', 'analysis.md');
        fs.writeFileSync(analysisPath, analysis, 'utf-8');
        
        console.log('\nAI Analysis and Recommendations:');
        console.log(analysis);
        console.log(`\nDetailed analysis saved to: ${analysisPath}`);
    } catch (error) {
        console.error('Failed to run test:', error.message);
        process.exit(1);
    }
}

// Run the main function if this file is run directly (not imported as a module)
if (require.main === module) {
    main();
}
