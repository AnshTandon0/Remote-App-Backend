const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

function runAdbCommand(command, callback) {
    exec(`adb ${command}`, (error, stdout, stderr) => {
        if (error) {
            callback({ success: false, error: stderr || error.message });
        } else {
            callback({ success: true, output: stdout.trim() || "Command executed successfully" });
        }
    });
}

// Connect to device
app.post("/connect", (req, res) => {
    const { ip, port = 5555 } = req.body;
    runAdbCommand(`connect ${ip}:${port}`, result => res.json(result));
});

// Run shell command
app.post("/shell", (req, res) => {
    const { ip, port = 5555, cmd } = req.body;
    runAdbCommand(`-s ${ip}:${port} shell ${cmd}`, result => res.json(result));
});

// Install APK
app.post("/install", (req, res) => {
    const { ip, port = 5555, apkPath } = req.body;
    runAdbCommand(`-s ${ip}:${port} install ${apkPath}`, result => res.json(result));
});

// List connected devices
app.get("/devices", (req, res) => {
    runAdbCommand("devices", result => res.json(result));
});

app.get("/test" , (req , res) => {
    return res.status(200).json({message: "API is working fine"})
})

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 ADB service running on port ${PORT}`));
