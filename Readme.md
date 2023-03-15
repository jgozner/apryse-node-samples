# Apryse SDK Samples

This repository contains more advanced samples using the @pdftron/pdfnet-node SDK.

# Summary
- [Conversions](##converions)
  - [HTML to PDF]()

## Setup

Make sure to insert your license key into the license-key.js file before running any samples.

## **Conversions**

The Apryse SDK offers a comprehensive set of conversions capabilities. 

 - ### **HTML to PDF**
   Apryse SDK offers the ability to convert HTML to PDF with high fidelity and accuracy using our HTML2PDF module. The sample covers the following:

   -  Header and Footer templating as listed on the [chromium docs](https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-printToPDF)
   - Table of contents linking to other pages // TODO

   <br />To run this sample use the following command
   ```bash
   node .\src\samples\conversions\html-to-pdf\index.js
   ```
   
   The output file can be located at **.\src\files\output\html-to-pdf.pdf**

