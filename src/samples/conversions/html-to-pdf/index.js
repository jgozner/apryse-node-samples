const { PDFNet } = require('@pdftron/pdfnet-node');
const { Files } = require('../../../files/index');
const { license_key} = require('../../../../license-key.json');
const HTMLParser = require('node-html-parser');
const path = require('path');
const fs = require('fs');

const { PDFDoc, SDFDoc, HTML2PDF, ContentReplacer, TextSearch, Rect} = PDFNet;

const main = async () =>{

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
    doc.initSecurityHandler();

    // Create a HTML converter
    const converter = await PDFNet.HTML2PDF.create();

    // Load HTML from the specified file
    let body_html = fs.readFileSync(Files.HTML_TO_PDF.INPUT_PATH, 'utf8');
    let header_html = fs.readFileSync(path.resolve(__dirname, "./header.html"), 'utf8');
    let footer_html = fs.readFileSync(path.resolve(__dirname, "./footer.html"), 'utf8');

    let generate_result = generatePagePlaceholders(body_html);
    body_html = generate_result.html;

    // Set html content
    converter.insertFromHtmlString(body_html);
    converter.setHeader(header_html);
    converter.setFooter(footer_html);

    // Apply the conversion
    await converter.convert(doc);

    await replacePagePlaceholders(generate_result.toc_arr, doc);

    //Save
    await doc.save(Files.HTML_TO_PDF.OUTPUT_PATH, SDFDoc.SaveOptions.e_incremental)
}

const zeroPad = (num, places) => String(num).padStart(places, '0')

/**
 * This function will generate the placeholders for the TOC and return the dictionary of the structured elements and the updated html
 * You can make this more complex if you wanted but this is just a simple example. We set the index as this value because we will be replacing it later and want to match the width
 * of the element so that we don't disturb the dotted css (SDK .... 1)
 * [
 *     { reference: "Introduction to Apryse SDK", page_index: 01},
 *     { reference: "Features of Apryse SDK", page_index: 02},
 *     { reference: "Benefits of Using Apryse SDK", page_index: 03},
 *     ...
 * ]
 */
const generatePagePlaceholders = (html) =>{
    
    const root = HTMLParser.parse(html);
    const toc_arr = [];
    let toc_counter = 1;

    //Find the Table of contents to start
    let element = root.getElementById("toc");

    //Find the Elements we want to place into the Table of contents
    const toc_elements = root.querySelectorAll(".toc");

    // Insert placeholders
    toc_elements.forEach(toc_element => {
        const counter = `${zeroPad(toc_counter,2)}`;

        toc_arr.push({
            reference: toc_element.innerText,
            page_index: counter
        })

        const element_id = `toc_element_${toc_counter}`;
        element.insertAdjacentHTML('afterend',`<div id="${element_id}" class="toc_entry"><p><div class="toc_title">${toc_element.innerText}</div><div class="toc_dots"></div><div class="toc_page">[${counter}]</div></p></div>`)
        
        // Get the new added element so when we add it's after it
        element = root.getElementById(element_id);
        toc_counter++;
    });

    return {
        toc_arr: toc_arr,
        html: root.toString()
    };
}

/**
 * Replace the page place holders values
 */
const replacePagePlaceholders = async (toc_arr, doc) =>{
    const txt_search = await TextSearch.create();
    const content_replacer = await ContentReplacer.create();
    const toc_page = await doc.getPage(2);

    for (let i = 0; i < toc_arr.length; i++) {
        const toc_element = toc_arr[i];

        txt_search.begin(doc, toc_element.reference, TextSearch.Mode.e_whole_word);
        let result = await txt_search.run();
        // Skip first page since it'll find the reference in the TOC
        result = await txt_search.run();
        //replace placeholder
        await content_replacer.addString(toc_element.page_index, `${result.page_num}`);
    }

    await content_replacer.process(toc_page);
}

PDFNet.runWithCleanup(main, license_key)
    .catch((err) => console.log("Error:", err))
    .then(() => PDFNet.shutdown());