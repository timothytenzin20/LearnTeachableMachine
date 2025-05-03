const URL = "./my_model/"; // Folder with model.json and metadata.json
let model, webcam, maxPredictions;

async function init() {
    console.log('button pressed');
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        webcam = new tmImage.Webcam(300, 300, true); // width, height, flip
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);

        document.getElementById("webcam-container").appendChild(webcam.canvas);
    } catch (error) {
        console.error("Initialization failed:", error);
        alert("Failed to initialize the model or webcam. Please check the console for details.");
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    const sorted = prediction.sort((a, b) => b.probability - a.probability);
    const top = sorted[0];
    const confidence = (top.probability * 100).toFixed(1);

    document.getElementById("result").innerText = `${top.className} 🍎 (${confidence}%)`;
}
