const { PDFNet } = require('@pdftron/pdfnet-node');
const { Files } = require('../../../files/index');
const { LicenseKey } = require('../../../../license-key');
const path = require('path');
const fs = require('fs');

const main = async () =>{
    const { PDFDoc, SDFDoc, HTML2PDF, ElementWriter, ElementBuilder, Font } = PDFNet;

    switch(process.platform){
        case "win32":
            await HTML2PDF.setModulePath(path.resolve(__dirname, "../../../modules/HTML2PDF/windows"));
            break;           
        case "darwin":
            await HTML2PDF.setModulePath(path.resolve(__dirname, "../../../modules/HTML2PDF/mac"));
            break;
        case "linux":
            await HTML2PDF.setModulePath(path.resolve(__dirname, "../../../modules/HTML2PDF/linux"));
            break;            
    }

    if(!(await HTML2PDF.isModuleAvailable())){
        console.log("HTML2PDF module not available");
        return;
    }

    // Create a new empty document
    const doc = await PDFDoc.create();

    // Create a HTML converter
    const converter = await PDFNet.HTML2PDF.create();

    // Load HTML from the specified file
    const body_html = fs.readFileSync(Files.HTML_TO_PDF.INPUT_PATH, 'utf8');
    const header_html = fs.readFileSync(path.resolve(__dirname, "./header.html"), 'utf8');
    const footer_html = fs.readFileSync(path.resolve(__dirname, "./footer.html"), 'utf8');

    // Set html content
    converter.insertFromHtmlString(body_html);
    converter.setHeader(header_html);
    converter.setFooter(footer_html);

    // Apply the conversion
    await converter.convert(doc);

    //Save
    await doc.save(Files.HTML_TO_PDF.OUTPUT_PATH, SDFDoc.SaveOptions.e_incremental)
}

PDFNet.runWithCleanup(main, LicenseKey)
    .catch((err) => console.log("Error:", err))
    .then(() => PDFNet.shutdown());