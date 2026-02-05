
import http from 'http';

console.log("Testing endpoint: http://localhost:5001/api/contact");

const data = JSON.stringify({
    name: "Debug Script",
    email: "debug@test.com",
    message: "This is a direct server test"
});

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/contact',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Response Status: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });

    res.on('end', () => {
        console.log("\nResponse received.");
    });
});

req.on('error', (error) => {
    console.error("NETWORK ERROR:", error);
});

req.write(data);
req.end();
