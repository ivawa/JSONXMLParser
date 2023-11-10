const inputArea = document.querySelector(".area");
const btnFormat = document.querySelector(".controls__button--format");
const btnCopy = document.querySelector(".controls__button--copy");
const btnMinify = document.querySelector(".controls__button--minify");

//Url_menu
document.addEventListener("click", function (e) {
    let m = document.getElementById('menu');
    if (e.target.id !== 'test' && e.target.id !== 'menu' && e.target.id !== 'placeholder' && e.target.id !== 'area-URL' && e.target.id !== 'controls__button--url') {
        m.style.display = 'none';
    } else if (e.target.id === 'test') {
        m.style.display = (m.style.display !== 'block') ? 'block' : 'none';
    }
});

//JsonURL
function getButton() {
    let area = document.getElementById('area-URL').value
    const getJSON = async url => {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(response.statusText);

        return response.json();
    }


    console.log("Fetching data...");
    getJSON(area).then(data => {
        inputArea.value = JSON.stringify(data);
    }).catch(error => {
        console.error(error);
    });
}

//Отформатировать JSON или XML
btnFormat.addEventListener("click", () => {
    document.getElementById("output1").innerHTML = "";
    if (document.getElementById('selection').value === "JSON") {
        //JSON------------------------
        if (inputArea.value === "") {
            alert("Введите JSON")
        } else {
            if (inputArea.value.slice(0, 1)==="<") {
                alert("Неверный синтаксис")
            } else {
            function syntaxHighlight(json) {
                json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                    let cls = 'number';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'key';
                        } else {
                            cls = 'string';
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'boolean';
                    } else if (/null/.test(match)) {
                        cls = 'null';
                    }
                    return '<span class="' + cls + ' parse">' + match + '</span>';
                });
            }
        }
        }
        let obj = JSON.parse(inputArea.value);
        let str = JSON.stringify(obj, undefined, 4);
        document.getElementById("output1").appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(str);
    } else {
        //XML-----------------------------
        if (inputArea.value === "") {
            alert("Введите XML")
        } else {
            if (inputArea.value.slice(0, 1) === "{") {
                alert("Неверный синтаксис")
            } else {
                let prettifyXml = function (sourceXml) {
                    let xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
                    let xsltDoc = new DOMParser().parseFromString([
                        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.w3.org/1999/XSL/Transform http://www.w3.org/1999/XSL/Transform" version="1.0">',
                        '  <xsl:strip-space elements="*"/>',
                        '  <xsl:template match="para[content-style][not(text())]">',
                        '    <xsl:value-of select="normalize-space(.)"/>',
                        '  </xsl:template>',
                        '  <xsl:template match="node()|@*">',
                        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
                        '  </xsl:template>',
                        '  <xsl:output indent="yes"/>',
                        '</xsl:stylesheet>',
                    ].join('\n'), 'application/xml');

                    let xsltProcessor = new XSLTProcessor();
                    xsltProcessor.importStylesheet(xsltDoc);
                    let resultDoc = xsltProcessor.transformToDocument(xmlDoc);
                    let resultXml = new XMLSerializer().serializeToString(resultDoc);
                    let xml = resultXml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;').replace(/\n/g, '<br />');
                    return xml.replace(/(&lt;[^&gt;]*&gt;)|^(&lt;(.*?)&nbsp;)|(&lt;(.*?)&gt;)/g, function (match) {
                        let cls = 'key';
                        return '<span class="' + cls + ' parse">' + match + '</span>';
                    });
                };
                document.getElementById("output1").innerHTML = prettifyXml(inputArea.value)
            }
        }
    }
});

//Minified
btnMinify.addEventListener("click", () => {
    document.getElementById("output1").innerHTML = "";
    if (document.getElementById('selection').value === "JSON") {
        //JSON----------------------------
        if (inputArea.value === "") {
            alert("Введите JSON")
        } else {
        document.getElementById("output1").innerHTML = JSON.stringify(JSON.parse(inputArea.value))}
    } else {
        //XML-----------------------------
        if (inputArea.value === "") {
            alert("Введите XML")
        } else {
            let prettifyXml = function (sourceXml) {
                let xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
                let xsltDoc = new DOMParser().parseFromString([
                    '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.w3.org/1999/XSL/Transform http://www.w3.org/1999/XSL/Transform" version="1.0">',
                    '  <xsl:strip-space elements="*"/>',
                    '  <xsl:template match="para[content-style][not(text())]">',
                    '    <xsl:value-of select="normalize-space(.)"/>',
                    '  </xsl:template>',
                    '  <xsl:template match="node()|@*">',
                    '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
                    '  </xsl:template>',
                    '  <xsl:output indent="yes"/>',
                    '</xsl:stylesheet>',
                ].join('\n'), 'application/xml');

                let xsltProcessor = new XSLTProcessor();
                xsltProcessor.importStylesheet(xsltDoc);
                let resultDoc = xsltProcessor.transformToDocument(xmlDoc);
                let resultXml = new XMLSerializer().serializeToString(resultDoc);
                let xml;
                return xml = resultXml.replace(/</g, '&lt;').replace(/>/g, '&gt;');

            };
            document.getElementById("output1").innerHTML = prettifyXml(inputArea.value)
        }
    }
});

//Открытие файла
function openFile() {
    document.getElementById('inp').click();
}

//Прочитать файл
function readFile(e) {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('areaput').innerHTML = e.target.result;
    }
    reader.readAsText(file)
}

//Очистить ввод
function clearInput() {
    let getValue = document.getElementById("areaput");
    if (getValue.value !== "") {
        getValue.value = "";
    }
    while (getValue.firstChild) {
        getValue.removeChild(getValue.firstChild);
    }
}

//Вставить из буфера
async function paste(input) {
    input.value = await navigator.clipboard.readText();
}

//Пример для работы JSON или XML
async function example(input) {
    let json_example = {
        "glossary": {
            "title": "example glossary",
            "GlossDiv": {
                "title": "S",
                "GlossList": {
                    "GlossEntry": {
                        "ID": "SGML",
                        "SortAs": "SGML",
                        "GlossTerm": "Standard Generalized Markup Language",
                        "Acronym": "SGML",
                        "Abbrev": "ISO 8879:1986",
                        "GlossDef": {
                            "para": "A meta-markup language, used to create markup languages such as DocBook.",
                            "GlossSeeAlso": ["GML", "XML"]
                        },
                        "GlossSee": "markup"
                    }
                }
            }
        }
    }
    let xml_example = '<?xml version="1.0" encoding="UTF-8" ?> <employees> <employee> <id>1</id> <firstName>Leonardo</firstName> <lastName>DiCaprio</lastName> <photo>http://1.bp.blogspot.com/-zvS_6Q1IzR8/T5l6qvnRmcI/AAAAAAAABcc/HXO7HDEJKo0/s200/Leonardo+Dicaprio7.jpg</photo> </employee> <employee> <id>2</id> <firstName>Johnny</firstName> <lastName>Depp</lastName> <photo>http://4.bp.blogspot.com/_xR71w9-qx9E/SrAz--pu0MI/AAAAAAAAC38/2ZP28rVEFKc/s200/johnny-depp-pirates.jpg</photo> </employee> <employee> <id>3</id> <firstName>Hritik</firstName> <lastName>Roshan</lastName> <photo>https://upload.wikimedia.org/wikipedia/commons/3/32/Hrithik_Roshan_in_2001.jpg</photo> </employee> </employees>';
    if (document.getElementById('selection').value === "JSON") {
        input.value = JSON.stringify(json_example);
    } else {
        input.value = xml_example;
    }
}


