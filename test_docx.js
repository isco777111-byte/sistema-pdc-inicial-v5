const fs = require('fs');
const PizZip = require('pizzip');

try {
    const content = fs.readFileSync('e:\\2026_A\\PDC_INICIAL KEY v2\\inicial.docx', 'binary');
    const zip = new PizZip(content);
    let xml = zip.file('word/document.xml').asText();

    // Check if the table "Adaptaciones Curriculares Significativas" exists.
    let count = 0;
    while (xml.indexOf('<w:tbl') !== -1) {
        let start = xml.indexOf('<w:tbl');
        let end = xml.indexOf('</w:tbl>', start) + 8;
        let tblXml = xml.substring(start, end);
        if (tblXml.includes('SIGNIFICATIVAS') || tblXml.includes('Significativas') || tblXml.includes('significativas')) {
            console.log("Found significative table! Length: " + tblXml.length);
        }
        xml = xml.substring(end);
        count++;
    }
    console.log("Total tables: " + count);
} catch (e) {
    console.error(e);
}
