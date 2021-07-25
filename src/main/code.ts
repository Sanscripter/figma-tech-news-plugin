// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many of the chose shape on screen

// This shows the HTML page in "index.html".
figma.showUI(__html__, { visible: false });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {

	if (msg.type == 'news-fetched') {
		try {

			const cover = figma.currentPage
				.children.find(node => node.name == 'GIRO_TECH_COVER_TEMPLATE');

			const newsTemplate = figma.currentPage
				.children.find(node => node.name == 'GIRO_TECH_NEWS_TEMPLATE');

			const cta = figma.currentPage
				.children.find(node => node.name == 'GIRO_TECH_CTA_TEMPLATE');

			const allRows = figma.currentPage
				.children.filter(node => node.name.startsWith('GIRO_TECH_COVER_'));

			const Y = cover.y + (cover.height + 300) * allRows.length;
			const TODAY = new Date().toLocaleDateString();
			const LATERAL_SPACING = 100;

			const newCover = cover.clone();
			newCover.name = `GIRO_TECH_COVER_${TODAY}`
			newCover.y = Y;
			figma.currentPage.appendChild(newCover);

			const cards = msg.news.map(async (story: any, i: number) => {
				console.log(story)
				let card = (newsTemplate as FrameNode).clone();
				card.name = `GIRO_TECH_NEWS_${TODAY}_${i}`;
				card.y = Y;
				card.x = cover.x + cover.width + LATERAL_SPACING + i * (card.width + LATERAL_SPACING);
				
				const fontRegular = await figma.loadFontAsync({ family: "Open Sans", style: "Regular" });
				const fontEB = await figma.loadFontAsync({ family: "Open Sans", style: "Bold" });

				const title = card.children.find(node => node.name == 'NEWS_TITLE');
				await figma.loadFontAsync({ family: "Open Sans", style: "ExtraBold" })
				.then(() => {
						console.log('title', title);
						(title as TextNode).characters = story.title;
					});
				
				const content = card.children.find(node => node.name == 'NEWS_CONTENT');
				await figma.loadFontAsync({ family: "Open Sans", style: "Regular" })
				.then(() => {
					console.log('content', content);
					(content as TextNode).characters = story.content;
				});
				
				const source = card.children.find(node => node.name == 'NEWS_SOURCE');
				console.log('source', source);
				(source as TextNode).characters = `fonte: ${story.source}`;

			});
			cards.forEach(card => {
				figma.currentPage.appendChild(card);
			});
			const newCta = cta.clone();
			newCta.name = `GIRO_TECH_CTA_${TODAY}`
			newCta.y = Y;
			newCta.x = cover.x + cover.width + LATERAL_SPACING + msg.news.length * (LATERAL_SPACING + newsTemplate.width);
			figma.currentPage.appendChild(newCta)

			figma.closePlugin()


		} catch (e) {
			return e;
		}




		// // let coverNode = figma.getNodeById('514:633');
		// // let cloneNode = coverNode.clone();
		// // cloneNode.y = coverNode.y + 300 + coverNode.height;
		// // figma.currentPage.appendChild(cloneNode);
		// // figma.viewport.scrollAndZoomIntoView([coverNode]);
		// // console.log(cloneNode);
		// // console.log(coverNode);

		// const nodes: SceneNode[] = [];

		// console.log(msg)

		// if (figma.currentPage.selection.length !== 1) {
		// 	return "Select a single node."
		// }

		// const node = figma.currentPage.selection[0]
		// if (node.type !== 'TEXT') {
		// 	return "Select a single text node."
		// }

		// figma.root.appendChild()

		// console.log(node)

		// figma.loadFontAsync({ family: "Open Sans", style: "Regular" })
		// 	.then(r => {
		// 		figma.loadFontAsync({ family: "Open Sans", style: "Bold" })
		// 			.then( rr=> {
		// 				node.characters = msg.response[0].content;
		// 				figma.closePlugin()
		// 			})
		// 	})

	}
	// One way of distinguishing between different types of messages sent from
	// your HTML page is to use an object with a "type" property like this.
	// if (msg.type === 'create-shapes') {


	// 	for (let i = 0; i < msg.count; i++) {

	// 		var shape;

	// 		if (msg.shape === 'rectangle') {
	// 			shape = figma.createRectangle();
	// 			console.log('hello');
	// 		} else if (msg.shape === 'triangle') {
	// 			shape = figma.createPolygon();
	// 		} else {
	// 		 shape = figma.createEllipse();
	// 		}

	// 		shape.x = i * 150;
	// 		shape.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
	// 		figma.currentPage.appendChild(shape);
	// 		nodes.push(shape);
	// 	}

	// 	figma.currentPage.selection = nodes;
	// 	figma.viewport.scrollAndZoomIntoView(nodes);
	// }

	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.
	// figma.closePlugin();
};

// async function generateNewsreel(): Promise<string | undefined> {
//     // const text = document.querySelector('#text_space');
//     return fetch('https://fanicorn.api.stdlib.com/gm-tech-news@1.0.0/news/',
//         {
//             method: 'GET',
//             headers: {
//                 Accept: 'application/json',
//             },

//         }
//     )
//         .then((res) => {
//             console.log(res.body)
//             return res.json().then(json => JSON.stringify(json));
//             // if (res.ok) {
//             //     res.json().then(json => {
//             //         console.log(json);
//             //         text.innerHTML = JSON.stringify(json);
//             //     });
//             // }
//         })
//     // parent.postMessage({ pluginMessage: { 
//     //     'type': 'create-shapes', 
//     //     'count': countInput.value,
//     //     'shape': shapeMenu.value
//     // } }, '*');
// }


async function main(): Promise<string | undefined> {



	if (figma.currentPage.selection.length !== 1) {
		return "Select a single node."
	}

	const node = figma.currentPage.selection[0]
	if (node.type !== 'TEXT') {
		return "Select a single text node."
	}

	// node.characters = await generateNewsreel();

	// Replace spaces with nonbreaking spaces.
	const text = node.characters.replace(/ /g, " ")

	// Create a new text node for each character, and
	// measure the total width.
	// const nodes = []


	// Put all nodes in a group!
	// figma.group(nodes, node.parent)
}

//   main().then((message: string | undefined) => {
// 	figma.closePlugin(message)
//   })