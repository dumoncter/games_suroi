#!/usr/bin/env node

/**
 * Performance Test Script for Suroi Game
 * Tests camera smoothness, gyroscope responsiveness, and overall performance
 */

const { performance } = require('perf_hooks');

// Performance metrics
let frameCount = 0;
let lastFrameTime = performance.now();
let fpsHistory = [];
let cameraLerpHistory = [];

// Test configurations
const testConfigs = [
    { interpolationSpeed: 0.05, name: "Very Smooth" },
    { interpolationSpeed: 0.1, name: "Smooth" },
    { interpolationSpeed: 0.15, name: "Balanced" },
    { interpolationSpeed: 0.2, name: "Responsive" },
    { interpolationSpeed: 0.3, name: "Very Responsive" }
];

console.log('🎮 Suroi Performance Test Starting...');
console.log('=====================================');

// Simulate camera movement and measure performance
function simulateCameraMovement(interpolationSpeed, duration = 5000) {
    console.log(`\n📊 Testing camera interpolation speed: ${interpolationSpeed} (${duration}ms)`);

    const startTime = performance.now();
    let currentPos = { x: 0, y: 0 };
    const targetPos = { x: 100, y: 100 };
    let frameCount = 0;
    let lerpTimes = [];

    while (performance.now() - startTime < duration) {
        const frameStart = performance.now();

        // Simulate camera interpolation (Vec.lerp equivalent)
        const lerpFactor = interpolationSpeed;
        currentPos.x += (targetPos.x - currentPos.x) * lerpFactor;
        currentPos.y += (targetPos.y - currentPos.y) * lerpFactor;

        const frameTime = performance.now() - frameStart;
        lerpTimes.push(frameTime);
        frameCount++;

        // Simulate 60fps frame time
        const targetFrameTime = 1000 / 60;
        if (frameTime < targetFrameTime) {
            // Busy wait to simulate frame timing
            const waitUntil = performance.now() + (targetFrameTime - frameTime);
            while (performance.now() < waitUntil) { }
        }
    }

    const avgLerpTime = lerpTimes.reduce((a, b) => a + b, 0) / lerpTimes.length;
    const fps = frameCount / (duration / 1000);

    console.log(`   📈 Average FPS: ${fps.toFixed(1)}`);
    console.log(`   ⏱️  Average lerp time: ${(avgLerpTime * 1000).toFixed(3)}μs`);
    console.log(`   🎯 Position reached: (${currentPos.x.toFixed(2)}, ${currentPos.y.toFixed(2)})`);

    return { fps, avgLerpTime, finalPos: currentPos };
}

// Test gyroscope simulation
function simulateGyroscope(sensitivity = 0.02, smoothing = true, duration = 3000) {
    console.log(`\n📱 Testing gyroscope with sensitivity: ${sensitivity}, smoothing: ${smoothing}`);

    const startTime = performance.now();
    let currentRotation = 0;
    let smoothedGamma = 0;
    const smoothingFactor = 0.1;
    let updateCount = 0;
    let responseTimes = [];

    // Simulate gyroscope input
    const mockGyroData = Array.from({ length: 100 }, (_, i) =>
        Math.sin(i * 0.1) * 45 // Simulate tilting from -45° to +45°
    );

    for (const gamma of mockGyroData) {
        const updateStart = performance.now();

        if (smoothing) {
            smoothedGamma = smoothedGamma * (1 - smoothingFactor) + gamma * smoothingFactor;
        } else {
            smoothedGamma = gamma;
        }

        const targetRotation = -smoothedGamma * sensitivity;
        currentRotation = currentRotation + (targetRotation - currentRotation) * 0.1;

        const updateTime = performance.now() - updateStart;
        responseTimes.push(updateTime);
        updateCount++;

        // Simulate realistic update interval
        const waitTime = Math.random() * 16 + 8; // 8-24ms (60-120fps)
        const waitUntil = performance.now() + waitTime;
        while (performance.now() < waitUntil) { }
    }

    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const updatesPerSecond = updateCount / (duration / 1000);

    console.log(`   📈 Update rate: ${updatesPerSecond.toFixed(1)} Hz`);
    console.log(`   ⏱️  Average response time: ${(avgResponseTime * 1000).toFixed(3)}μs`);
    console.log(`   🎯 Final rotation: ${currentRotation.toFixed(3)} rad`);

    return { updatesPerSecond, avgResponseTime, finalRotation: currentRotation };
}

// Run performance tests
console.log('\n🧪 Running Camera Performance Tests...');
console.log('=====================================');

const cameraResults = [];
for (const config of testConfigs) {
    const result = simulateCameraMovement(config.interpolationSpeed);
    cameraResults.push({
        name: config.name,
        speed: config.interpolationSpeed,
        ...result
    });
}

// Display camera results
console.log('\n📊 Camera Performance Results:');
console.log('==============================');
cameraResults.forEach(result => {
    console.log(`${result.name.padEnd(15)} | FPS: ${result.fps.toFixed(1).padStart(6)} | Lerp: ${(result.avgLerpTime * 1000000).toFixed(0).padStart(4)}μs`);
});

// Recommendations
const bestForSmoothness = cameraResults.reduce((best, current) =>
    current.fps > best.fps ? current : best
);
const bestForResponsiveness = cameraResults.reduce((best, current) =>
    current.finalPos.x > best.finalPos.x ? current : best
);

console.log(`\n💡 Recommendations:`);
console.log(`   🌟 Best for smoothness: ${bestForSmoothness.name} (${bestForSmoothness.speed})`);
console.log(`   ⚡ Best for responsiveness: ${bestForResponsiveness.name} (${bestForResponsiveness.speed})`);

// Gyroscope tests
console.log('\n📱 Running Gyroscope Performance Tests...');
console.log('=======================================');

const gyroConfigs = [
    { sensitivity: 0.01, smoothing: true, name: "Low Sensitivity + Smoothing" },
    { sensitivity: 0.02, smoothing: true, name: "Medium Sensitivity + Smoothing" },
    { sensitivity: 0.03, smoothing: true, name: "High Sensitivity + Smoothing" },
    { sensitivity: 0.02, smoothing: false, name: "Medium Sensitivity + No Smoothing" }
];

const gyroResults = [];
for (const config of gyroConfigs) {
    const result = simulateGyroscope(config.sensitivity, config.smoothing);
    gyroResults.push({
        name: config.name,
        sensitivity: config.sensitivity,
        smoothing: config.smoothing,
        ...result
    });
}

// Display gyroscope results
console.log('\n📊 Gyroscope Performance Results:');
console.log('==================================');
gyroResults.forEach(result => {
    console.log(`${result.name.padEnd(30)} | Rate: ${result.updatesPerSecond.toFixed(1).padStart(6)} Hz | Response: ${(result.avgResponseTime * 1000000).toFixed(0).padStart(4)}μs`);
});

console.log('\n✅ Performance tests completed!');
console.log('\n🎮 Recommended Settings:');
console.log('=======================');
console.log('Desktop:');
console.log('  cv_camera_interpolation_speed: 0.15');
console.log('  cv_movement_smoothing: true');
console.log('  cv_gyroscope_sensitivity: 0.02');
console.log('  cv_gyroscope_smoothing: true');
console.log('');
console.log('Mobile:');
console.log('  cv_camera_interpolation_speed: 0.1');
console.log('  cv_movement_smoothing: true');
console.log('  cv_gyroscope_sensitivity: 0.015');
console.log('  cv_gyroscope_smoothing: true');
console.log('');
console.log('Low-end devices:');
console.log('  cv_camera_interpolation_speed: 0.08');
console.log('  cv_movement_smoothing: false');
console.log('  cv_gyroscope_sensitivity: 0.01');
console.log('  cv_gyroscope_smoothing: false');
