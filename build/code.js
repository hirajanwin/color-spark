

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 428, height: 440 });
//function to convert hex color code to RGB because figma takes fill input as RGB
function hex2rgb(hex) {
    return [Number('0x' + hex[1] + hex[2]) | 0, Number('0x' + hex[3] + hex[4]) | 0, Number('0x' + hex[5] + hex[6]) | 0];
}
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

figma.ui.onmessage = msg => {
    if (msg.type === 'create-palette') {  
        const nodes = [];
        //create frame
        const colorsFrame = figma.createFrame();
        //set height and width with 24px padding
        const frameHeight = 150;
        const frameWidth = (msg.colorsList.length * 124) + 24;
        colorsFrame.resizeWithoutConstraints(frameWidth, frameHeight);
        //set frame name
        colorsFrame.name = msg.name + " Color Scheme";
        colorsFrame.x = figma.viewport.center.x;
        colorsFrame.y = figma.viewport.center.y;
        figma.notify(`👍 Successfully imported: ${msg.name}`)

        //loop to create color rectangles
        for (let i = 0; i < msg.colorsList.length; i++) {
            const rect = figma.createRectangle();
            rect.y = 24;
            rect.x = 24 + (i * 124);
            let rgbColor = hex2rgb(msg.colorsList[i]);
            rect.name = msg.name + "-" + i;

            if (i > 0)
                rect.name = msg.name + "-" + i + "00";
            
            else if (i === 0)
                rect.name = msg.name + "-" + "50";

            rect.fills = [{ type: 'SOLID', color: { r: rgbColor[0] / 255, g: rgbColor[1] / 255, b: rgbColor[2] / 255 } }];
            figma.currentPage.appendChild(rect);
            colorsFrame.appendChild(rect);
            nodes.push(rect);
        }
        colorsFrame.setRelaunchData({ rerun: 'Add another palette' });
        figma.viewport.scrollAndZoomIntoView(nodes);
    }

   
    figma.closePlugin();
};

