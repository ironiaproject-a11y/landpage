console.log('Starting check...');
try {
    const next = require('next');
    console.log('Next imported successfully');
    console.log('Next version:', next.default?.version || 'unknown');
} catch (e) {
    console.error('Failed to import next:', e);
}
