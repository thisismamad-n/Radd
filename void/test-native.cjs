// Test native module loading
try {
    const nodePty = require('node-pty');
    console.log('node-pty loaded:', Object.keys(nodePty));
} catch (e) {
    console.error('node-pty error:', e.message);
}

try {
    const spdlog = require('@vscode/spdlog');
    console.log('spdlog loaded:', Object.keys(spdlog));
} catch (e) {
    console.error('spdlog error:', e.message);
}

try {
    const registry = require('@vscode/windows-registry');
    console.log('windows-registry loaded:', Object.keys(registry));
} catch (e) {
    console.error('windows-registry error:', e.message);
}

try {
    const deviceid = require('@vscode/deviceid');
    console.log('deviceid loaded:', Object.keys(deviceid));
} catch (e) {
    console.error('deviceid error:', e.message);
}

console.log('All tests complete');
