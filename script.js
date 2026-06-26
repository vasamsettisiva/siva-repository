document.addEventListener("DOMContentLoaded", () => {
    // --- UI Tab Logic ---
    const tabGen = document.getElementById("tab-gen");
    const tabScan = document.getElementById("tab-scan");
    const genSection = document.getElementById("generator-section");
    const scanSection = document.getElementById("scanner-section");

    let html5QrcodeScanner = null;

    tabGen.addEventListener("click", () => {
        tabGen.classList.add("active");
        tabScan.classList.remove("active");
        genSection.classList.add("active");
        scanSection.classList.remove("active");
        
        // Stop camera if switching away from scanner
        if (html5QrcodeScanner) {
            html5QrcodeScanner.clear().catch(error => console.error("Failed to clear scanner:", error));
            html5QrcodeScanner = null;
        }
    });

    tabScan.addEventListener("click", () => {
        tabScan.classList.add("active");
        tabGen.classList.remove("active");
        scanSection.classList.add("active");
        genSection.classList.remove("active");
        
        // Initialize Scanner when tab opens
        initScanner();
    });

    // --- QR Code Generator Logic ---
    const qrText = document.getElementById("qr-text");
    const generateBtn = document.getElementById("generate-btn");
    const qrContainer = document.getElementById("qrcode");

    // Initialize the qrcode.js instance
    let qrCodeInstance = new QRCode(qrContainer, {
        text: "https://google.com",
        width: 180,
        height: 180,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    generateBtn.addEventListener("click", () => {
        const textValue = qrText.value.trim();
        if (textValue) {
            qrCodeInstance.clear(); // clear previous code
            qrCodeInstance.makeCode(textValue); // generate new code
        } else {
            alert("Please enter text or a URL first!");
        }
    });

    // --- QR Code Scanner Logic (Camera Access) ---
    const resultText = document.getElementById("result-text");

    function onScanSuccess(decodedText, decodedResult) {
        // Triggers when a QR code is successfully scanned
        resultText.textContent = decodedText;
        
        // Optional: play an alert audio or stop scanning
        // html5QrcodeScanner.clear(); 
    }

    function onScanFailure(error) {
        // Quietly logs failures (occurs constantly while searching for a QR code frame)
        // console.warn(`Code scan error = ${error}`);
    }

    function initScanner() {
        // Configuration options for the library scanner
        const config = { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true
        };

        // Creates instance. Argument 'reader' matches the HTML element ID container.
        // Second argument 'false' turns off the local file drop/upload feature (only uses camera)
        html5QrcodeScanner = new Html5QrcodeScanner("reader", config, /* verbose= */ false);
        
        // Render triggers camera permission prompt automatically upon click of library button
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }
});