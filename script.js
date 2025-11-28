const previewCanvas = document.getElementById('preview')
const resultCanvas = document.getElementById('result')
const previewCtx = previewCanvas.getContext('2d')
const resultCtx = resultCanvas.getContext("2d")
const dpr = window.devicePixelRatio || 1;

previewCanvas.width = previewCanvas.clientWidth*dpr;
previewCanvas.height = previewCanvas.clientHeight*dpr;
previewCtx.scale(dpr, dpr);

resultCanvas.width = resultCanvas.clientWidth*dpr;
resultCanvas.height = resultCanvas.clientHeight*dpr;
resultCtx.scale(dpr, dpr);

const SCALE = 10
resultCtx.font = `bold ${SCALE*1.3}px monospace`
const colorMap = [
  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
  ["!", "'", "-", "'", ";", ",", ".", ";", ",", "."]
]

const fileInput = document.getElementById("fileInput")
const fileOutput = document.getElementById("fileOutput")

const uploadBtn = document.getElementById("upload-img")
const downloadBtn = document.getElementById("download-img")

const convertBtn = document.getElementById("convert")

let selectedImage = new Image()
selectedImage.src = "assets/images/image.png"

uploadBtn.addEventListener("click", (event) => {
    fileInput.click()
})

function refresh(){
    //previewCtx.fillStyle = "black"
    //previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height)
    previewCtx.imageSmoothingEnabled = false;
    previewCtx.drawImage(selectedImage, 0, 0, previewCanvas.width, previewCanvas.height)
}
refresh()
fileInput.addEventListener("change", (event) => {
    let file = fileInput.files[0]
    let url = URL.createObjectURL(file);
    selectedImage.src = url
    selectedImage.set
    previewCanvas.onload = ()=>{
        URL.revokeObjectURL(file)
    }
    refresh()
})

convertBtn.addEventListener("click", (event) => {
    refresh()
    const width = selectedImage.naturalWidth
    const height = selectedImage.naturalHeight
    console.log(width, height)
    data = []
    for (let y = 0; y < height; y+=SCALE){
        for (let x = 0; x < width; x+=SCALE){
            const [r, g, b] = previewCtx.getImageData(x, y, x+1, y+1).data
            let pixel = {
                "x": x,
                "y": y,
                "r": r,
                "g": g,
                "b": b
            }
            data.push(pixel)
        }
    }
    resultCtx.fillStyle = "black"
    resultCtx.fillRect(0, 0, resultCanvas.width, resultCanvas.height)
    for(px of data){
        resultCtx.fillStyle = "rgb("+px.r+", "+px.g+", "+px.b+")"
        let char = "?"
        if (px.r > px.b && px.r > px.g){
            let n = Math.floor(px.r/255*9)
            char = colorMap[0][n]
        }
        if (px.g > px.b && px.g > px.r){
            let n = Math.floor(px.g/255*9)
            char = colorMap[1][n]
        }
        if (px.b > px.r && px.b > px.g){
            let n = Math.floor(px.b/255*9)
            char = colorMap[2][n]
        }
        resultCtx.imageSmoothingEnabled = false
        resultCtx.fillText(char, px.x, px.y)
    }
    fileOutput.download = "image.png"
    fileOutput.href = resultCanvas.toDataURL("image/png")
})

fileOutput.addEventListener("click", (event)=>{
    console.log("click")
})