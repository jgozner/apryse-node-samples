const File = class {
    constructor(inputPath, outputPath){
        this.INPUT_PATH = inputPath;
        this.OUTPUT_PATH = outputPath;
    }

}
const Files = {
    DIGITAL_SIGNATURE: new File(`${__dirname}/input/digital-signature.pdf`, `${__dirname}/output/digital-signature.pdf`),
    E_SIGNATURE: new File(`${__dirname}/input/e-signature.pdf`, `${__dirname}/output/e-signature.pdf`),
    HTML_TO_PDF: new File(`${__dirname}/input/html-to-pdf.html`, `${__dirname}/output/html-to-pdf.pdf`),
    PDF_TO_HTML: new File(`${__dirname}/input/pdf-to-html.pdf`, `${__dirname}/output/pdf-to-htmlaz.html`)
}

module.exports = { Files, File }