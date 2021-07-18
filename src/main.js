const getAllATags = function getAllATags() {

  let outList = ``;
  let emptyAList = ``;
  let aTagList = document.getElementsByTagName(`a`);
  let indent = `              `;

  // format innerHTML strings for proper line indention and blank line removal
  const formatInnerHtml = function formatInnerHtml(htmlString) {

    let innerHTML = htmlString;
    let initialIndention = ``;

    let firstLineIndention = innerHTML.match(/^\s+/);
    if (firstLineIndention) {
      initialIndention = firstLineIndention[0].split(`\n`).reverse()[0];
      innerHTML = innerHTML.replace(firstLineIndention, `\n${initialIndention}`);
    }

    // Remove multiple lines containing only whitespace
    innerHTML = innerHTML[`replaceAll`](/\n\s+\n/g, `\n`);

    // Replace whitespace on newlines with proper indention
    let re = new RegExp(`\n${initialIndention}`, `g`);
    innerHTML = innerHTML[`replaceAll`](re, `\n${indent}  `);

    return innerHTML.trim();

  }

  // How we process an individual <a> element
  const processATag = function processATag(item) {

    let linkText = item.innerText;
    linkText = linkText.toString();
    linkText = linkText.trim();
    if (linkText === ``) {
      linkText = `Link With No Text`;
    }

    let href = item.href;
    if (href === window.location.href + `#`) {
      href = ``;
    }

    let onClick = item.onclick;
    // Strip the enclosing function from onclick
    if (onClick) {
      onClick = onClick.toString();
      let stripOutter = /function.+?\) \{[\n]*(.+?)[\n]*\}$/;
      onClick = onClick.replace(stripOutter, `$1`);
    }

    let className = item.className;

    let id = item.id;

    let innerHTML = item.innerHTML;
    if (innerHTML.trim() === linkText) {
      innerHTML = ``;
    }
    if (innerHTML) {
      // Using try/catch in case of malformed innerHTML
      try{
        innerHTML = formatInnerHtml(innerHTML);
      } catch(e) {
        console.error(`Failed to process innerHTML:\r\n${innerHTML}\r\n${e}`);
      }
    }

    // if every target attribite is empty, log element to the empty list
    if (!className && !id && !href && !onClick && !innerHTML) {
      emptyAList += `  ${linkText}: ${item}\r\n`;
      return;
    }

    outList += `${linkText}:\r\n`;

    if (className) {
      outList += `    class:  ${className}\r\n`;
    }

    if (id) {
      outList += `    id:  ${id}\r\n`;
    }

    if (href) {
      outList += `    href:  ${href}\r\n`;
    }

    if (onClick) {
      outList += `    onClick:  ${onClick}\r\n`;
    }

    if (innerHTML) {
      outList += `    innerHTML:  ${innerHTML}\r\n`;
    }

    outList += `\r\n`;

  }

  Array.prototype.forEach.call(aTagList, processATag);

  if (emptyAList) {
    outList += `Empty <a> Tags:\r\n${emptyAList}`;
  }

  // Here we are turning our list(s) into a text file and downloading it.
  let path = window.location.pathname;
  let fileName = path.replace(/\//g, `-`);
  let downloadLink = document.createElement(`a`);
  downloadLink.download = `${fileName}.txt`;

  let textFileBlob = new Blob([outList], {
    type: `text/plain`
  });

  downloadLink.href = window.URL.createObjectURL(textFileBlob);
  downloadLink.click();

}
